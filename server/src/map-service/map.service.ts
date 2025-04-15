import { PrismaClient } from '@prisma/client';
import { MapInfoDefaultState } from '../../../shared/types/api-state-types';

export class MapService {
  constructor(private prisma: PrismaClient) {
  }

  async getMapInfo({ userId, workspaceId }: { userId: number, workspaceId: number }): Promise<MapInfoDefaultState> {
    const map = await this.prisma.workspace.findFirst({
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
      mapId: map.id,
      mapName: map.name,
      mapData: map.mapData,
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
