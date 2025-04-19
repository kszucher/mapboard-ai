import { JsonObject } from '@prisma/client/runtime/library';
import { MapInfoDefaultState } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class MapService {
  constructor(private prisma: PrismaClient) {
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

  async loadMap({ userId, workspaceId }: { userId: number, workspaceId: number }): Promise<MapInfoDefaultState> {
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

  async saveMap({ workspaceId, mapId, mapData }: {
    workspaceId: number,
    mapId: number,
    mapData: object
  }): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      UPDATE "Map"
      SET data = jsonb_merge_recurse(
        $1::jsonb,
        jsonb_diff_recurse(
          "Map".data,
          (
            SELECT "mapData"
            FROM "Workspace"
            WHERE id = $2
          )
        )
      )
      WHERE id = $3
    `, JSON.stringify(mapData), workspaceId, mapId);
  }

}
