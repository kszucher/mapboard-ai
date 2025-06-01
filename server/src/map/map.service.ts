import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { getInputL, getTopologicalSort } from '../../../shared/src/map/getters/map-queries';
import { mapCopy } from '../../../shared/src/map/setters/map-copy';
import { rDefault } from '../../../shared/src/map/state/map-defaults';
import { ControlType, M, MDelta } from '../../../shared/src/map/state/map-types';
import { jsonMerge } from '../../../shared/src/map/utils/json-merge';
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
        Map: { select: { id: true, name: true, data: true, userId: true } },
      },
    });
    return workspace.Map;
  }

  async getLastMap({ userId }: { userId: number }) {
    return this.prisma.map.findFirstOrThrow({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, data: true, userId: true },
    });
  }

  private createNewMapData(): M {
    return {
      g: { isLocked: false },
      l: {},
      r: { [global.crypto.randomUUID().slice(-8)]: { ...rDefault, iid: 0 } },
    };
  }

  async createMap({ userId, mapName, mapData = this.createNewMapData() }: {
    userId: number,
    mapName: string,
    mapData?: object
  }) {
    const map = await this.prisma.map.create({
      data: {
        userId,
        name: mapName,
        data: mapData,
      },
      select: {
        id: true,
        name: true,
        data: true,
        userId: true,
      },
    });

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    return map;
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number, workspaceId: number, mapName: string }) {
    const newMap = await this.createMap({ userId, mapName });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.UPDATE_TAB,
      payload: {},
    });
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

    const newMapData = mapCopy(map.data as unknown as M, () => global.crypto.randomUUID().slice(-8));

    const newMap = await this.createMap({ userId, mapName: map.name + 'Copy', mapData: newMapData });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.UPDATE_TAB,
      payload: {},
    });
  }

  async renameMap({ mapId, mapName }: { mapId: number, mapName: string }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.RENAME_MAP,
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
    await this.prisma.map.update({
      where: { id: mapId },
      data: { data: mapData },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
      payload: { mapInfo: { id: mapId, data: mapData } },
    });
  }

  async updateMapByServer({ mapId, mapDelta }: { mapId: number, mapDelta: MDelta }) {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { data: true },
    });

    const mapData = map.data as unknown as M;

    const newMapData = jsonMerge(mapData, mapDelta);

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
      payload: { mapInfo: { id: mapId, data: newMapData } },
    });
  }

  async executeMap({ mapId }: { mapId: number }) {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { id: true, name: true, data: true },
    });

    const m = map.data as unknown as M;

    const topologicalSort = getTopologicalSort(m);

    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    await this.updateMapByServer({ mapId, mapDelta: { g: { isLocked: true } } });

    for (const nodeId of topologicalSort) {
      const ri = m.r[nodeId];
      const inputLinks = getInputL(m, nodeId);

      if (ri.controlType !== ControlType.TEXT_INPUT && ri.controlType !== ControlType.FILE) {
        await this.updateMapByServer({
          mapId, mapDelta: {
            r: { [nodeId]: { isProcessing: true } },
            l: Object.fromEntries(Object.entries(inputLinks).map(([lid]) => [lid, { isProcessing: true }])),
          },
        });
      }

      if (ri.controlType === ControlType.TEXT_INPUT) {

      } else if (ri.controlType === ControlType.FILE) {

      } else if (ri.controlType === ControlType.INGESTION) {
        await new Promise(r => setTimeout(r, 3000));
      } else if (ri.controlType === ControlType.VECTOR_DATABASE) {
        await new Promise(r => setTimeout(r, 3000));
      } else if (ri.controlType === ControlType.EXTRACTION) {
        await new Promise(r => setTimeout(r, 3000));
      } else if (ri.controlType === ControlType.TEXT_OUTPUT) {
        await new Promise(r => setTimeout(r, 3000));
      }

      if (ri.controlType !== ControlType.TEXT_INPUT && ri.controlType !== ControlType.FILE) {
        await this.updateMapByServer({
          mapId, mapDelta: {
            r: { [nodeId]: { isProcessing: false } },
            l: Object.fromEntries(Object.entries(inputLinks).map(([lid]) => [lid, { isProcessing: false }])),
          },
        });
      }
    }

    await this.updateMapByServer({ mapId, mapDelta: { g: { isLocked: false } } });
  }

  async deleteMap({ userId, mapId }: { userId: number, mapId: number }) {
    const shares = await this.prisma.share.findMany({
      where: { mapId },
      select: { shareUserId: true },
    });

    const userIds = [userId, ...shares.map(share => share.shareUserId)];
    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({ userIds });

    await this.workspaceService.removeMapFromWorkspaces({ mapId });

    await this.tabService.removeMapFromTab({ userId, mapId });

    await this.prisma.share.deleteMany({
      where: { mapId },
    });

    await this.prisma.map.delete({
      where: { id: mapId },
    });

    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.DELETE_MAP,
      payload: { mapId },
    });
  }
}
