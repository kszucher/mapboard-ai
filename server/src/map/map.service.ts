import { JsonObject } from '@prisma/client/runtime/library';
import { mapArrayToObject, mapObjectToArray } from '../../../shared/src/map/getters/map-queries';
import { mapCopy } from '../../../shared/src/map/setters/map-copy';
import { M } from '../../../shared/src/map/state/map-types';
import { jsonDiff } from '../../../shared/src/map/utils/json-diff';
import { jsonMerge } from '../../../shared/src/map/utils/json-merge';
import { PrismaClient } from '../generated/client';
import { TabService } from '../tab/tab.service';
import { WorkspaceService } from '../workspace/workspace.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getTabService: () => TabService,
    private getWorkspaceService: () => WorkspaceService,
  ) {
  }

  get tabService(): TabService {
    return this.getTabService();
  }

  get workspaceService(): WorkspaceService {
    return this.getWorkspaceService();
  }

  async readMap({ workspaceId }: { workspaceId: number }) {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        Map: { select: { id: true, name: true } },
      },
    });
    return workspace.Map;
  }

  async readMapData({ workspaceId }: { workspaceId: number }) {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        Map: { select: { data: true } },
      },
    });
    return workspace.Map;
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

  async createMapInTab({ userId, workspaceId, mapName }: { userId: number, workspaceId: number, mapName: string }) {
    const newMap = await this.prisma.map.create({
      data: {
        userId,
        name: mapName,
        data: this.createNewMapData(),
      },
      select: {
        id: true,
      },
    });
    await this.tabService.addMapToTab({ userId, mapId: newMap.id });
    await this.workspaceService.updateWorkspaceMap({ workspaceId, mapId: newMap.id });
  }

  async createMapInTabDuplicate({ userId, workspaceId, mapId }: {
    userId: number,
    workspaceId: number,
    mapId: number
  }) {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { id: true, name: true, data: true },
    });

    const mapDataObject = mapObjectToArray(map.data as M);

    const newMapDataArray = mapCopy(mapDataObject, () => global.crypto.randomUUID().slice(-8));

    const newMapDataObject = mapArrayToObject(newMapDataArray);

    const newMap = await this.prisma.map.create({
      data: {
        userId,
        name: map.name + 'Copy',
        data: newMapDataObject as JsonObject,
      },
      select: {
        id: true,
        name: true,
        data: true,
      },
    });

    await this.tabService.addMapToTab({ userId, mapId: newMap.id });
    await this.workspaceService.updateWorkspaceMap({ workspaceId, mapId: newMap.id });
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

    const currentData = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId, Map: { isNot: null } },
      select: {
        Map: { select: { data: true } },
        mapData: true,
      },
    });

    const result = jsonMerge(mapData, jsonDiff(currentData.Map!.data, currentData.mapData));

    await this.prisma.map.update({
      where: { id: mapId },
      data: { data: result },
    });

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { mapData: result },
    });
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

  async deleteMap({ userId, mapId }: { userId: number, mapId: number }) {

    await this.workspaceService.removeMapFromWorkspaces({ mapId });

    await this.tabService.deleteMapFromTab({ userId, mapId });

    await this.prisma.share.deleteMany({
      where: { mapId },
    });

    await this.prisma.map.delete({
      where: { id: mapId },
    });

  }
}
