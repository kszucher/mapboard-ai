import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { MapInfo, MapOp, MapOpType } from '../../../shared/src/api/api-types-map';
import {
  getLastIndexN,
  getMapSelfH,
  getMapSelfW,
  getTopologicalSort,
} from '../../../shared/src/map/getters/map-queries';
import { mapCopy } from '../../../shared/src/map/setters/map-copy';
import { allowedSourceControls, ControlType, M } from '../../../shared/src/map/state/map-consts-and-types';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { TabService } from '../tab/tab.service';
import { DataFrameService } from '../workflow/data-frame.service';
import { FileService } from '../workflow/file.service';
import { IngestionService } from '../workflow/ingestion.service';
import { LlmService } from '../workflow/llm.service';
import { VectorDatabaseService } from '../workflow/vector-database.service';
import { WorkspaceService } from '../workspace/workspace.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getTabService: () => TabService,
    private getWorkspaceService: () => WorkspaceService,
    private getDistributionService: () => DistributionService,
    private getFileService: () => FileService,
    private getIngestionService: () => IngestionService,
    private getVectorDatabaseService: () => VectorDatabaseService,
    private getDataFrameService: () => DataFrameService,
    private getLlmService: () => LlmService
  ) {}

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

  get ingestionService(): IngestionService {
    return this.getIngestionService();
  }

  get vectorDatabaseService(): VectorDatabaseService {
    return this.getVectorDatabaseService();
  }

  get dataFrameService(): DataFrameService {
    return this.getDataFrameService();
  }

  get llmService(): LlmService {
    return this.getLlmService();
  }

  private genId = () => global.crypto.randomUUID();

  private hasProcessing = (m: M): boolean => {
    return Object.values(m.l).some(link => link.isProcessing) || Object.values(m.n).some(node => node.isProcessing);
  };

  private async getMapGraph({ mapId }: { mapId: number }): Promise<M> {
    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({ where: { mapId } }),
      this.prisma.mapLink.findMany({ where: { mapId } }),
    ]);

    const l = Object.fromEntries(mapLinks.map(({ id, mapId, ...rest }) => [id, rest]));
    const n = Object.fromEntries(mapNodes.map(({ id, mapId, ...rest }) => [id, rest]));
    return { l, n };
  }

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

    return await this.getMapInfo({ mapId: map.id });
  }

  async createMap({ userId, mapName, newMapData }: { userId: number; mapName: string; newMapData?: M }) {
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
      await this.prisma.$transaction(async prisma => {
        await prisma.mapNode.createMany({
          data: Object.entries(newMapData.n).map(([id, n]) => ({ id, ...n, mapId: map.id })),
        });
        await prisma.mapLink.createMany({
          data: Object.entries(newMapData.l).map(([id, l]) => ({ id, ...l, mapId: map.id })),
        });
      });
    }

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    return map;
  }

  async createMapInTabNew({
    userId,
    workspaceId,
    mapName,
  }: {
    userId: number;
    workspaceId: number;
    mapName: string;
  }): Promise<void> {
    const newMap = await this.createMap({ userId, mapName });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(
      workspaceIdsOfUser.filter(el => el !== workspaceId),
      {
        type: WORKSPACE_EVENT.UPDATE_TAB,
        payload: {},
      }
    );
  }

  async createMapInTabDuplicate({
    userId,
    workspaceId,
    mapId,
  }: {
    userId: number;
    workspaceId: number;
    mapId: number;
  }): Promise<void> {
    const mapInfo = await this.getMapInfo({ mapId });

    const newMapData = mapCopy(mapInfo.data, this.genId);

    const newMap = await this.createMap({ userId, mapName: mapInfo.name + 'Copy', newMapData });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(
      workspaceIdsOfUser.filter(el => el !== workspaceId),
      {
        type: WORKSPACE_EVENT.UPDATE_TAB,
        payload: {},
      }
    );
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
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

  private async updateMapGraphIsProcessingSet({ nodeId }: { nodeId: string }) {
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
      await this.prisma.$transaction(async prisma => {
        await prisma.mapLink.deleteMany({ where: { mapId } });
        await prisma.mapNode.deleteMany({ where: { mapId } });

        await prisma.mapNode.createMany({
          data: Object.entries(mapData.n).map(([id, n]) => ({ id, mapId, ...n })),
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

  async updateMap({ mapId, mapOp }: { mapId: number; mapOp: MapOp }) {
    const m = await this.getMapGraph({ mapId });

    switch (mapOp.type) {
      case MapOpType.INSERT_NODE: {
        await this.prisma.mapNode.create({
          data: {
            mapId,
            iid: getLastIndexN(m) + 1,
            controlType: mapOp.payload.controlType,
            offsetW: getMapSelfW(m),
            offsetH: getMapSelfH(m),
          },
        });
        break;
      }
    }

    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
  }

  async executeMapUploadFile(mapId: number, nodeId: string, file: Express.Multer.File) {
    await this.updateMapGraphIsProcessingSet({ nodeId });
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
      const ni = m.n[nodeId];

      const skipControlTypes: ControlType[] = [ControlType.FILE, ControlType.CONTEXT, ControlType.QUESTION];
      if (skipControlTypes.includes(ni.controlType)) {
        continue;
      }

      await this.updateMapGraphIsProcessingSet({ nodeId });
      await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

      const inputNodes = await this.prisma.mapNode.findMany({
        where: {
          controlType: { in: allowedSourceControls[ni.controlType] },
          FromLinks: {
            some: {
              toNodeId: nodeId,
              ToNode: {
                controlType: ni.controlType,
              },
            },
          },
        },
        select: {
          iid: true,
          controlType: true,
          fileHash: true,
          fileName: true,
          ingestionOutputJson: true,
          vectorDatabaseId: true,
          vectorDatabaseOutputText: true,
          contextOutputText: true,
          questionOutputText: true,
          dataFrameOutputText: true,
          llmInstructions: true,
          llmOutputJson: true,
          visualizerInputText: true,
        },
      });

      switch (ni.controlType) {
        case ControlType.INGESTION: {
          if (ni.ingestionOutputJson) {
            await new Promise(el => setTimeout(el, 1000));
            console.log(ni.fileName + ' already processed ingestion');
            continue;
          }

          const inputNodeFileUploadFileHash = inputNodes.find(el => el.controlType === ControlType.FILE)?.fileHash;

          if (!inputNodeFileUploadFileHash) {
            console.error('no input file hash');
            break executionLoop;
          }

          try {
            const ingestionJson = null; // await this.ingestionService(inputNodeFileUploadFileHash);
            if (!ingestionJson) {
              console.error('no ingestionJson');
              break executionLoop;
            }

            await this.prisma.mapNode.update({
              where: { id: nodeId },
              data: { ingestionOutputJson: {} },
            });
          } catch (e) {
            console.error(ni.controlType + 'error', e);
            break executionLoop;
          }

          break;
        }
        case ControlType.VECTOR_DATABASE: {
          await new Promise(el => setTimeout(el, 3000));

          if (ni.vectorDatabaseId) {
            console.log(ni.fileName + ' already processed vector database');
            continue;
          }

          const vectorDatabaseInputJson = {
            [ControlType.INGESTION]: inputNodes
              .filter(el => el.controlType === ControlType.INGESTION)
              .map(el => [`N${el.iid}`, el.ingestionOutputJson]),
            [ControlType.CONTEXT]: inputNodes
              .filter(el => el.controlType === ControlType.CONTEXT)
              .map(el => [`N${el.iid}`, el.contextOutputText]),
            [ControlType.QUESTION]: inputNodes
              .filter(el => el.controlType === ControlType.QUESTION)
              .map(el => [`N${el.iid}`, el.questionOutputText]),
          };

          try {
            // TODO

            await this.prisma.mapNode.update({
              where: { id: nodeId },
              data: {},
            });
          } catch (e) {
            console.error(ni.controlType + 'error', e);
            break executionLoop;
          }
          break;
        }

        case ControlType.LLM: {
          await new Promise(el => setTimeout(el, 3000));

          const llmInputJson = {
            [ControlType.LLM]: inputNodes
              .filter(el => el.controlType === ControlType.LLM)
              .map(el => [`N${el.iid}`, el.llmOutputJson]),
            [ControlType.VECTOR_DATABASE]: inputNodes
              .filter(el => el.controlType === ControlType.VECTOR_DATABASE)
              .map(el => [`N${el.iid}`, el.vectorDatabaseOutputText]),
            [ControlType.CONTEXT]: inputNodes
              .filter(el => el.controlType === ControlType.CONTEXT)
              .map(el => [`N${el.iid}`, el.contextOutputText]),
            [ControlType.DATAFRAME]: inputNodes
              .filter(el => el.controlType === ControlType.DATAFRAME)
              .map(el => [`N${el.iid}`, el.dataFrameOutputText]),
            [ControlType.QUESTION]: inputNodes
              .filter(el => el.controlType === ControlType.QUESTION)
              .map(el => [`N${el.iid}`, el.questionOutputText]),
          };

          try {
            const llmOutputJson = await this.llmService.llm({
              llmInstructions: ni.llmInstructions ?? '',
              llmInputJson,
            });

            await this.prisma.mapNode.update({
              where: { id: nodeId },
              data: { llmInputJson, llmOutputJson },
            });
          } catch (e) {
            console.error(ni.controlType + 'error', e);
            break executionLoop;
          }

          await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

          break;
        }

        case ControlType.DATAFRAME: {
          await new Promise(el => setTimeout(el, 3000));

          const dataFrameInputJson = {
            [ControlType.FILE]: inputNodes
              .filter(el => el.controlType === ControlType.FILE)
              .map(el => [`N${el.iid}`, el.fileHash]),
            [ControlType.LLM]: inputNodes
              .filter(el => el.controlType === ControlType.LLM)
              .map(el => [`N${el.iid}`, el.llmOutputJson]),
          };

          // 1 read csv into polars dataframe
          // 2 save json
          // 3 query against json
          // 4 save query
        }
      }
    }

    await this.updateMapGraphIsProcessingClear({ mapId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
  }

  async deleteMap({ userId, mapId }: { userId: number; mapId: number }) {
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

  async distributeMapGraphChangeToAll({ mapId, mapData }: { mapId: number; mapData: M }) {
    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
      payload: { mapInfo: { id: mapId, data: mapData } },
    });
  }

  async distributeMapGraphChangeToOthers({
    workspaceId,
    mapId,
    mapData,
  }: {
    workspaceId: number;
    mapId: number;
    mapData: M;
  }) {
    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(
      workspaceIdsOfMap.filter(el => el !== workspaceId),
      {
        type: WORKSPACE_EVENT.UPDATE_MAP_DATA,
        payload: { mapInfo: { id: mapId, data: mapData } },
      }
    );
  }

  async terminateProcesses() {
    await this.prisma.mapNode.updateMany({ data: { isProcessing: false } });
    await this.prisma.mapLink.updateMany({ data: { isProcessing: false } });
  }
}
