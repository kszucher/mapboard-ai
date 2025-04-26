import { JsonObject } from '@prisma/client/runtime/library';
import { PrismaClient } from '../generated/client';
import { MapService } from '../map/map.service';
import { prismaClient } from '../startup';
import { TabService } from '../tab/tab.service';
import { UserService } from '../user/user.service';

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private userService: UserService,
    private mapService: MapService,
    private tabService: TabService,
  ) {
  }

  async createWorkspace({ userId }: { userId: number }): Promise<{ userId: number, workspaceId: number }> {
    const lastMap = await this.mapService.readLastMap({ userId });

    if (lastMap) {
      await this.mapService.updateOpenCount({ mapId: lastMap.id });
    }

    const map = lastMap ?? await this.mapService.createMap({ userId, mapName: 'New Map' });

    await this.tabService.createTabIfNotExists({ userId });

    await this.tabService.addMapIfNotIncluded({ userId, mapId: map.id });

    await this.userService.incrementSignInCount({ userId });

    const workspace = await this.prisma.workspace.create({
      data: {
        User: { connect: { id: userId } },
        Map: { connect: { id: map.id } },
        mapData: map.data as JsonObject,
      },
      select: {
        id: true,
      },
    });

    return {
      userId,
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
            data: true,
          },
        },
      },
    });

    const userInfo = workspace.User;
    const mapInfo = workspace.Map;
    const tabMapInfo = workspace.User.Tab!.mapIds.map(el => workspace.User.Maps.find(map => map.id === el)!);
    const shareInfo = { SharesByMe: workspace.User.SharesByMe, SharesWithMe: workspace.User.SharesWithMe };
    return { userInfo, mapInfo, tabMapInfo, shareInfo };
  }

  async updateWorkspaceMap({ workspaceId, mapId }: { workspaceId: number, mapId: number }): Promise<void> {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { id: true, data: true },
    });

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        mapId: map.id,
        mapData: map.data as JsonObject,
      },
    });

    await this.mapService.updateOpenCount({ mapId });
  }
}
