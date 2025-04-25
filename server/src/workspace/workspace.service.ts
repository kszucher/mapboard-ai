import { JsonObject } from '@prisma/client/runtime/library';
import { PrismaClient } from '../generated/client';
import { MapService } from '../map/map.service';
import { prismaClient } from '../startup';

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private mapService: MapService,
  ) {
  }

  async createWorkspace({ userSub }: { userSub: string }): Promise<{ userId: number, workspaceId: number }> {
    const user = await this.prisma.user.update({
      where: { sub: userSub },
      data: {
        signInCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
      },
    });

    const lastAvailableMap = await this.prisma.map.findFirst({
      where: { userId: user.id },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, mapData: true },
    });

    if (lastAvailableMap) {
      await this.mapService.updateOpenCount({ mapId: lastAvailableMap.id });
    }

    const map = lastAvailableMap ?? await this.mapService.createMapInTab({ userId: user.id, mapName: 'New Map' });

    const workspace = await this.prisma.workspace.create({
      data: {
        User: { connect: { id: user.id } },
        Map: { connect: { id: map.id } },
        mapData: map.mapData as JsonObject,
      },
      select: {
        id: true,
      },
    });

    return {
      userId: user.id,
      workspaceId: workspace.id,
    };
  }

  async readWorkspace({ workspaceId }: { workspaceId: number }) {
    const workspace = await prismaClient.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        User: {
          select: {
            name: true,
            colorMode: true,
            Maps: {
              select: {
                id: true,
                name: true,
              },
            },
            Tab: {
              select: {
                mapIds: true,
              },
            },
            SharesByMe: {
              select: {
                id: true,
                access: true,
                status: true,
                Map: {
                  select: {
                    name: true,
                  },
                },
                ShareUser: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            SharesWithMe: {
              select: {
                id: true,
                access: true,
                status: true,
                Map: {
                  select: {
                    name: true,
                  },
                },
                OwnerUser: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
        Map: {
          select: {
            id: true,
            name: true,
            mapData: true,
          },
        },
      },
    });


    const userInfo = workspace.User;
    const mapInfo = workspace.Map;
    const tabMapInfo = workspace.User.Tab.mapIds.map(el => workspace.User.Maps.find(map => map.id === el)!);
    const shareInfo = { SharesByMe: workspace.User.SharesByMe, SharesWithMe: workspace.User.SharesWithMe };
    return { userInfo, mapInfo, tabMapInfo, shareInfo };
  }

  async updateWorkspaceMap({ workspaceId, mapId }: { workspaceId: number, mapId: number }): Promise<void> {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { id: true, mapData: true },
    });

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        mapId: map.id,
        mapData: map.mapData as JsonObject,
      },
    });

    await this.mapService.updateOpenCount({ mapId });
  }
}
