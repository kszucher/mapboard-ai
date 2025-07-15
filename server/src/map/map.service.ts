import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { MapInfo } from '../../../shared/src/api/api-types-map';
import { getTopologicalSort } from '../../../shared/src/map/getters/map-queries';
import { mapCopy } from '../../../shared/src/map/setters/map-copy';
import { ControlType, M } from '../../../shared/src/map/state/map-types';
import { AiService } from '../ai/ai.service';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { FileService } from '../resource/file.service';
import { TabService } from '../tab/tab.service';
import { WorkspaceService } from '../workspace/workspace.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getTabService: () => TabService,
    private getWorkspaceService: () => WorkspaceService,
    private getDistributionService: () => DistributionService,
    private getFileService: () => FileService,
    private getAiService: () => AiService,
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

  get fileService(): FileService {
    return this.getFileService();
  }

  get aiService(): AiService {
    return this.getAiService();
  }

  private genId = () => global.crypto.randomUUID();

  private hasProcessing = (m: M): boolean => {
    return (
      Object.values(m.l).some(link => link.isProcessing) ||
      Object.values(m.r).some(node => node.isProcessing)
    );
  };

  private async getMapGraph({ mapId }: { mapId: number }): Promise<M> {
    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({ where: { mapId } }),
      this.prisma.mapLink.findMany({ where: { mapId } }),
    ]);

    const l = Object.fromEntries(mapLinks.map(({ id, mapId, ...rest }) => [id, rest]));
    const r = Object.fromEntries(mapNodes.map(({ id, mapId, ...rest }) => [id, rest]));
    return { l, r };
  };

  private async getMapInfo({ mapId }: { mapId: number }): Promise<MapInfo> {
    const map = await this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: {
        id: true,
        name: true,
        MapLinks: true,
        MapNodes: true,
      },
    });

    const mapGraph = await this.getMapGraph({ mapId });

    return {
      id: map.id,
      name: map.name,
      data: mapGraph,
    };
  }

  async getWorkspaceMapInfo({ workspaceId }: { workspaceId: number }): Promise<MapInfo> {
    const workspace = await this.prisma.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: {
        mapId: true,
      },
    });

    if (!workspace.mapId) {
      throw new Error('workspace has no map');
    } else {
      return await this.getMapInfo({ mapId: workspace.mapId });
    }
  }

  async getUserLastMapInfo({ userId }: { userId: number }): Promise<MapInfo> {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true },
    });

    return this.getMapInfo({ mapId: map.id });
  }

  async createMap({ userId, mapName, newMapData }: {
    userId: number,
    mapName: string,
    newMapData?: M,
  }) {
    const map = await this.prisma.map.create({
      data: {
        userId,
        name: mapName,
      },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    });

    if (newMapData) {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.mapNode.createMany({
          data: Object.entries(newMapData.r).map(([id, r]) => ({ id, ...r, mapId: map.id })),
        });
        await prisma.mapLink.createMany({
          data: Object.entries(newMapData.l).map(([id, l]) => ({ id, ...l, mapId: map.id })),
        });
      });
    }

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    return map;
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: {
    userId: number,
    workspaceId: number,
    mapName: string
  }): Promise<void> {
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
  }): Promise<void> {
    const mapInfo = await this.getMapInfo({ mapId });

    const newMapData = mapCopy(mapInfo.data, this.genId);

    const newMap = await this.createMap({ userId, mapName: mapInfo.name + 'Copy', newMapData });

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

  private async updateMapGraphIsProcessingSet({ mapId, nodeId }: { mapId: number, nodeId: string }) {
    await this.prisma.$transaction([
      this.prisma.mapNode.update({
        where: { id: nodeId },
        data: { isProcessing: true },
      }),
      this.prisma.mapNode.updateMany({
        where: { id: { not: nodeId } },
        data: { isProcessing: false },
      }),
      this.prisma.mapLink.updateMany({
        where: { toNodeId: nodeId },
        data: { isProcessing: true },
      }),
      this.prisma.mapLink.updateMany({
        where: { toNodeId: { not: nodeId } },
        data: { isProcessing: false },
      }),
    ]);
  }

  private async updateMapGraphIsProcessingClear({ mapId }: { mapId: number }) {
    await this.prisma.$transaction([
      this.prisma.mapNode.updateMany({
        where: { mapId },
        data: { isProcessing: false },
      }),
      this.prisma.mapLink.updateMany({
        where: { mapId },
        data: { isProcessing: false },
      }),
    ]);
  }

  async saveMap({ workspaceId, mapId, mapData }: { workspaceId: number; mapId: number; mapData: M }) {
    const m = await this.getMapGraph({ mapId });

    if (this.hasProcessing(m)) {
      console.log('map is processing, should be reverting local changes...');
      return;
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.mapLink.deleteMany({ where: { mapId } });
        await prisma.mapNode.deleteMany({ where: { mapId } });

        await prisma.mapNode.createMany({
          data: Object.entries(mapData.r).map(([id, r]) => ({ id, mapId, ...r })),
        });

        await prisma.mapLink.createMany({
          data: Object.entries(mapData.l).map(([id, l]) => ({ id, mapId, ...l })),
        });
      });

      await this.distributeMapGraphChangeToOthers({ workspaceId, mapId, mapData });
    } catch (error) {
      console.error('Failed to save map:', error);
      throw error;
    }
  }

  async executeMapUploadFile(mapId: number, nodeId: string, file: Express.Multer.File) {

    await this.updateMapGraphIsProcessingSet({ mapId, nodeId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

    const fileHash = await this.fileService.upload(file);

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { fileName: file.originalname, fileHash: fileHash ?? '' },
    });

    await this.updateMapGraphIsProcessingClear({ mapId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
  }

  async executeMap({ mapId }: { mapId: number }) {
    const m = await this.getMapGraph({ mapId });

    if (this.hasProcessing(m)) {
      throw new Error('map is processing');
    }

    const topologicalSort = getTopologicalSort(m);
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    executionLoop: for (const nodeId of topologicalSort) {

      const currentNode = m.r[nodeId];

      const skipControlTypes: ControlType[] = [ControlType.FILE, ControlType.CONTEXT, ControlType.QUESTION];
      if (skipControlTypes.includes(currentNode.controlType)) {
        continue;
      }

      await this.updateMapGraphIsProcessingSet({ mapId, nodeId });
      await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

      switch (currentNode.controlType) {
        case ControlType.INGESTION: {

          const inputLink = await this.prisma.mapLink.findFirstOrThrow({
            where: { toNodeId: nodeId },
            select: { id: true, fromNodeId: true },
          });

          const inputNodeFileUpload = await this.prisma.mapNode.findFirstOrThrow({
            where: { id: inputLink.fromNodeId },
            select: { fileHash: true },
          });

          if (!inputNodeFileUpload.fileHash) {
            console.error('no fileHash');
            break executionLoop;
          }

          if (currentNode.ingestionId) {
            await new Promise(r => setTimeout(r, 1000));
            console.log(currentNode.fileName + ' already ingested');
            continue;
          }

          try {
            const ingestionJson = await this.aiService.ingestion(inputNodeFileUpload.fileHash!);
            if (!ingestionJson) {
              console.error('no ingestionJson');
              break executionLoop;
            }

            const ingestion = await this.prisma.ingestion.create({
              data: { data: ingestionJson as any },
              select: { id: true },
            });

            await this.prisma.mapNode.update({
              where: { id: nodeId },
              data: { ingestionId: ingestion.id },
            });

          } catch (e) {
            console.error('ingestion error', e);
            break executionLoop;
          }

          break;
        }
        case ControlType.VECTOR_DATABASE: {

          // const ingestionIdList = Object.values(inputL)
          //   .filter(el => el.toNodeSideIndex === 0)
          //   .map(el => m.r[el.fromNodeId].ingestionId!);
          //
          // const contextList = Object.values(inputL)
          //   .filter(el => el.toNodeSideIndex === 1)
          //   .map(el => m.r[el.fromNodeId].context!);
          //
          // const questionList = Object.values(inputL)
          //   .filter(el => el.toNodeSideIndex === 2)
          //   .map(el => m.r[el.fromNodeId].question!);
          //
          // const ingestionDataList = await this.prisma.ingestion.findMany({
          //   where: { id: { in: ingestionIdList } },
          //   select: { data: true },
          // });

          await new Promise(r => setTimeout(r, 3000));

          // TODO wrap with a try catch and if the service is unavailable, update the map
          // await this.aiService.vectorDatabase(ingestionDataList.map(el => el.data), contextList, questionList[0]);

          // await this.updateMapByServer({
          //   mapId, mapDelta: {
          //     r: { [nodeId]: { vectorDatabaseId: 0 } }, // use the id provided by the python service - index or namespace
          //   },
          // });

          break;
        }
        case ControlType.LLM: {

          await new Promise(r => setTimeout(r, 3000));

          await this.prisma.mapNode.update({
            where: { id: nodeId },
            data: { llmHash: 'LLM answer' },
          });

          await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

          break;
        }
      }

    }

    await this.updateMapGraphIsProcessingClear({ mapId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
  }

  async deleteMap({ userId, mapId }: { userId: number, mapId: number }) {

    await this.workspaceService.removeMapFromWorkspaces({ mapId });

    await this.tabService.removeMapFromTab({ userId, mapId });

    const shares = await this.prisma.share.findMany({
      where: { mapId },
      select: { shareUserId: true },
    });

    await this.prisma.share.deleteMany({
      where: { mapId },
    });

    await this.prisma.mapLink.deleteMany({
      where: { mapId },
    });

    await this.prisma.mapNode.deleteMany({
      where: { mapId },
    });

    await this.prisma.map.delete({
      where: { id: mapId },
    });

    const userIds = [userId, ...shares.map(share => share.shareUserId)];

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({ userIds });

    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.DELETE_MAP,
      payload: { mapId },
    });
  }


  async distributeMapGraphChangeToAll({ mapId, mapData }: {
    mapId: number,
    mapData: M
  }) {
    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
      payload: { mapInfo: { id: mapId, data: mapData } },
    });
  }

  async distributeMapGraphChangeToOthers({ workspaceId, mapId, mapData }: {
    workspaceId: number,
    mapId: number,
    mapData: M
  }) {
    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap.filter(el => el !== workspaceId), {
      type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
      payload: { mapInfo: { id: mapId, data: mapData } },
    });
  }

  async terminateProcesses() {
    await this.prisma.mapNode.updateMany({ data: { isProcessing: false } });
    await this.prisma.mapLink.updateMany({ data: { isProcessing: false } });
  }
}
