import { PrismaClient } from '@prisma/client';
import { MapInfoDefaultState, UserInfoDefaultState } from '../../../shared/types/api-state-types';

export class MapService {
  constructor(private prisma: PrismaClient) {
  }

  async getMapInfo({ userId, workspaceId }: { userId: number, workspaceId: number }): Promise<MapInfoDefaultState> {
    const workspace = await this.prisma.workspace.findFirst({
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

    return {
      mapId: workspace.Map.id,
      mapName: workspace.Map.name,
      mapData: workspace.Map.mapData,
    };
  }

  async getUserInfo({ workspaceId }: { workspaceId: number }): Promise<UserInfoDefaultState> {
    const workspace = await this.prisma.workspace.findFirst({
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

    const mapIds = workspace.User.Tab.mapIds;

    const tabMaps = await this.prisma.map.findMany({
      where: { id: { in: mapIds } },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      userName: workspace.User.name,
      colorMode: workspace.User.colorMode,
      tabMapIdList: tabMaps.map(el => el.id),
      tabMapNameList: tabMaps.map(el => el.name),
    };
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
        OwnerUser: { connect: { id: userId } },
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
}
