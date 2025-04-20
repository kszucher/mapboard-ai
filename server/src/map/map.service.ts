import { JsonObject } from '@prisma/client/runtime/library';
import { PrismaClient, Map } from '../generated/client';
import { TabService } from '../tab/tab.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private tabService: TabService,
  ) {
  }

  private createNewMapData() {
    return {
      [global.crypto.randomUUID().slice(-8)]: { path: ['g'] },
      [global.crypto.randomUUID().slice(-8)]: { path: ['r', 0] },
    };
  }

  async createMapInTab({ userId, mapName }: {
    userId: number,
    mapName: string
  }): Promise<Pick<Map, 'id' | 'name' | 'mapData'>> {
    const map = await this.prisma.map.create({
      data: {
        name: mapName,
        mapData: this.createNewMapData(),
        User: { connect: { id: userId } },
      },
      select: {
        id: true,
        name: true,
        mapData: true,
      },
    });

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    return map;
  }

  async createMapInTabDuplicate() {

  }

  async readMap({ workspaceId }: { workspaceId: number }): Promise<Pick<Map, 'id' | 'name' | 'mapData'>> {
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

    await this.updateOpenCount({ mapId: workspace.Map.id });

    return {
      id: workspace.Map.id,
      name: workspace.Map.name,
      mapData: workspace.Map.mapData as JsonObject,
    };
  }

  async renameMap({ mapId, mapName }: { mapId: number, mapName: string }): Promise<Pick<Map, 'name'>> {
    return this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
      select: { name: true },
    });
  }

  async updateOpenCount({ mapId }: { mapId: number }): Promise<void> {
    await this.prisma.map.update({
      where: { id: mapId },
      data: {
        openCount: {
          increment: 1,
        },
      },
    });
  }

  async updateMapByClient({ workspaceId, mapId, mapData }: {
    workspaceId: number,
    mapId: number,
    mapData: object
  }): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
        UPDATE "Map"
        SET "mapData" = jsonb_merge_recurse(
            $1::jsonb,
            jsonb_diff_recurse(
                "Map"."mapData",
                (
                    SELECT "mapData"
                    FROM "Workspace"
                    WHERE id = $2
                )
            )
        ),
        "updatedAt" = NOW()
      WHERE id = $3
    `, JSON.stringify(mapData), workspaceId, mapId);
  }

  async updateMapByServer({ mapId, mapDataDelta }: { mapId: number, mapDataDelta: object }) {
    await this.prisma.$executeRawUnsafe(`
        UPDATE "Map"
        SET "mapData" = jsonb_merge_recurse(
            "Map"."mapData",
            $1::jsonb
        )
      WHERE id = $2
    `, JSON.stringify(mapDataDelta), mapId);
  }
}
