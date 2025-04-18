import {
  ColorMode,
  MapInfoDefaultState,
  SharesInfoDefaultState,
  UserInfoDefaultState,
} from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';
import { JsonObject } from '@prisma/client/runtime/library';

export class MapService {
  constructor(private prisma: PrismaClient) {
  }

  async getMapInfo({ userId, workspaceId }: { userId: number, workspaceId: number }): Promise<MapInfoDefaultState> {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        Map: {
          select: {
            id: true,
            name: true,
            mapData: true,
          },
        },
      },
    });

    await this.prisma.map.update({
      where: { id: workspace.Map.id },
      data: {
        openCount: {
          increment: 1,
        },
      },
    });

    return {
      mapId: workspace.Map.id.toString(),
      mapName: workspace.Map.name,
      mapData: workspace.Map.mapData as JsonObject,
    };
  }

  async getUserInfo({ workspaceId }: { workspaceId: number }): Promise<UserInfoDefaultState> {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        User: {
          select: {
            name: true,
            colorMode: true,
            Tab: {
              select: {
                mapIds: true,
              },
            },
          },
        },
      },
    });

    const tabMaps = await this.prisma.map.findMany({
      where: { id: { in: workspace.User.Tab.mapIds } },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      userName: workspace.User.name,
      colorMode: workspace.User.colorMode as ColorMode,
      tabMapIdList: tabMaps.map(el => el.id.toString()),
      tabMapNameList: tabMaps.map(el => el.name),
    };
  }

  async getShareInfo({ userId }: { userId: string }): Promise<SharesInfoDefaultState> {
    const user = await this.prisma.user.findFirstOrThrow({
      select: {
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
    });

    return {
      sharesByUser: user.SharesByMe.map(el => ({
        id: el.id.toString(),
        sharedMapName: el.Map.name,
        shareUserEmail: el.ShareUser.email,
        access: el.access,
        status: el.status,
      })),
      sharesWithUser: user.SharesWithMe.map(el => ({
        id: el.id.toString(),
        sharedMapName: el.Map.name,
        ownerUserEmail: el.OwnerUser.email,
        access: el.access,
        status: el.status,
      })),
    };
  }

  async signIn(): Promise<void> {

    const userId = 1;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        signInCount: {
          increment: 1,
        },
      },
    });

    const lastAvailableMap = await this.prisma.map.findFirstOrThrow({
      where: { userId },
      orderBy: {
        // updatedAt: 'desc', // this will give me the most recent one!!!
        // when opening a map I should increment an openCount or something so there will be an update
      },
      select: { id: true, mapData: true },
    });

    await this.prisma.workspace.create({
        data: {
          User: { connect: { id: userId } },
          Map: { connect: { id: lastAvailableMap.id } },
          mapData: lastAvailableMap.mapData as JsonObject,
        },
      },
    );
  }

  async createMapInTab({ userId, mapData, mapName }: {
    userId: number,
    mapData: object,
    mapName: string
  }): Promise<void> {
    const map = await this.prisma.map.create({
      data: {
        mapData,
        name: mapName,
        User: { connect: { id: userId } },
      },
      select: { id: true },
    });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        Tab: {
          update: {
            mapIds: {
              push: map.id,
            },
          },
        },
      },
    });
  }

  async createMapInTabDuplicate() {

  }
}
