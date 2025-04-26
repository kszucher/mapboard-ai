import { PrismaClient } from '../generated/client';
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

  async createMap({ userId, mapName }: { userId: number, mapName: string }) {
    return this.prisma.map.create({
      data: {
        userId,
        name: mapName,
        data: this.createNewMapData(),
      },
      select: {
        id: true,
        name: true,
        data: true,
      },
    });
  }

  async createMapInTab({ userId, mapName }: { userId: number, mapName: string }) {
    const map = await this.createMap({ userId, mapName });
    await this.tabService.addMapIfNotIncluded({ userId, mapId: map.id });
    return map;
  }

  async createMapInTabDuplicate() {

  }

  async readLastMap({ userId }: { userId: number }) {
    return this.prisma.map.findFirst({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, data: true },
    });
  }

  async readMap({ workspaceId }: { workspaceId: number }) {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        Map: {
          select: {
            id: true,
            name: true,
            data: true,
          },
        },
      },
    });

    await this.updateOpenCount({ mapId: workspace.Map.id });

    return workspace.Map;
  }

  async renameMap({ mapId, mapName }: { mapId: number, mapName: string }) {
    return this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
      select: { name: true },
    });
  }

  async updateOpenCount({ mapId }: { mapId: number }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: {
        openCount: {
          increment: 1,
        },
      },
    });
  }

  async updateMapByClient({ workspaceId, mapId, mapData }: { workspaceId: number, mapId: number, mapData: object }) {
    // S = C + S - LC
    // Map.mapData = mapData + Map.data - Workspace.mapData

    console.time('Save Map');

    await this.prisma.$transaction(async (tx) => {
      // First, calculate the merged data using a raw query
      const mergedDataResult = await tx.$queryRawUnsafe<{ merged_data: any }[]>(`
        --
        WITH "MergedData" AS (
          SELECT jsonb_merge_recurse(
            $3::jsonb,
            jsonb_diff_recurse(
              (SELECT "data" FROM "Map" WHERE id = $2),
              (SELECT "mapData" FROM "Workspace" WHERE id = $1)
            )
          ) AS merged_data
        )
        SELECT merged_data FROM "MergedData"
      `, workspaceId, mapId, JSON.stringify(mapData));

      // Now, safely access the merged data
      const mergedData = mergedDataResult[0].merged_data;

      // Update Workspace table
      await tx.workspace.update({
        where: { id: workspaceId },
        data: { mapData: mergedData },
      });

      // Update Map table
      await tx.map.update({
        where: { id: mapId },
        data: { data: mergedData, updatedAt: new Date() },
      });
    });
    
    console.timeEnd('Save Map');
  }

  async updateMapByServer({ mapId, mapDataDelta }: { mapId: number, mapDataDelta: object }) {
    await this.prisma.$executeRawUnsafe(`
        UPDATE "Map"
        SET "data" = jsonb_merge_recurse(
            "Map"."data",
            $1::jsonb
        )
      WHERE id = $2
    `, JSON.stringify(mapDataDelta), mapId);
  }
}
