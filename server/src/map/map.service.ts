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
    await this.tabService.addMapToTab({ userId, mapId: map.id });
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
    await this.prisma.$executeRawUnsafe(`
        UPDATE "Map"
        SET "data" = jsonb_merge_recurse(
            $1::jsonb,
            jsonb_diff_recurse(
                "Map"."data",
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
        SET "data" = jsonb_merge_recurse(
            "Map"."data",
            $1::jsonb
        )
      WHERE id = $2
    `, JSON.stringify(mapDataDelta), mapId);
  }
}
