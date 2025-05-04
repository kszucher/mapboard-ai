import { JsonObject } from '@prisma/client/runtime/library';
import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { mapArrayToObject, mapObjectToArray } from '../../../shared/src/map/getters/map-queries';
import { mapCopy } from '../../../shared/src/map/setters/map-copy';
import { M } from '../../../shared/src/map/state/map-types';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { TabService } from '../tab/tab.service';
import { WorkspaceService } from '../workspace/workspace.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getTabService: () => TabService,
    private getWorkspaceService: () => WorkspaceService,
    private getDistributionService: () => DistributionService,
  ) {
  }

  get tabService(): TabService {
    return this.getTabService();
  }

  get workspaceService(): WorkspaceService {
    return this.getWorkspaceService();
  }

  get distributionService(): DistributionService {
    return this.getDistributionService();
  }

  async getMap({ workspaceId }: { workspaceId: number }) {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        Map: { select: { id: true, name: true, data: true } },
      },
    });
    return workspace.Map;
  }

  async getLastMap({ userId }: { userId: number }) {
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
      [global.crypto.randomUUID().slice(-8)]: { path: 'g' },
      [global.crypto.randomUUID().slice(-8)]: { path: 'r,0' },
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

  private async createMapInTabCommon({ userId, workspaceId, newMapId }: {
    userId: number,
    workspaceId: number,
    newMapId: number
  }) {
    await this.tabService.addMapToTabIfNotAdded({ userId, mapId: newMapId });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMapId });

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.TAB_UPDATED,
      payload: {},
    });
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number, workspaceId: number, mapName: string }) {
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

    await this.createMapInTabCommon({ userId, workspaceId, newMapId: newMap.id });
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

    await this.createMapInTabCommon({ userId, workspaceId, newMapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number, mapName: string }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.MAP_RENAMED,
      payload: { mapId, mapName },
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
    console.time('Save Map');

    this.prisma.map.update({
      where: { id: mapId },
      data: { data: mapData },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.MAP_DATA_UPDATED,
      payload: { mapInfo: { id: mapId, data: mapData } },
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
    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });
    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.workspaceService.removeMapFromWorkspaces({ mapId });

    await this.tabService.removeMapFromTab({ userId, mapId });

    await this.prisma.share.deleteMany({
      where: { mapId },
    });

    await this.prisma.map.delete({
      where: { id: mapId },
    });

    await this.distributionService.publish(workspaceIdsOfUser, {
      type: WORKSPACE_EVENT.TAB_UPDATED,
      payload: { mapId },
    });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.MAP_DELETED,
      payload: { mapId },
    });
  }
}
