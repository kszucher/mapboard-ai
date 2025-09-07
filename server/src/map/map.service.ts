import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { MapInfo, MapOp, MapOpType } from '../../../shared/src/api/api-types-map';
import {
  getLastIndexN,
  getMapSelfH,
  getMapSelfW,
  getTopologicalSort,
} from '../../../shared/src/map/getters/map-queries';
import { ControlType, M } from '../../../shared/src/map/state/map-consts-and-types';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { TabService } from '../tab/tab.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { MapNodeContextService } from './map-node-context.service';
import { MapNodeDataFrameService } from './map-node-data-frame.service';
import { MapNodeFileService } from './map-node-file.service';
import { MapNodeIngestionService } from './map-node-ingestion.service';
import { MapNodeLlmService } from './map-node-llm.service';
import { MapNodeQuestionService } from './map-node-question.service';
import { MapNodeVectorDatabaseService } from './map-node-vector-database.service';
import { MapNodeVisualizerService } from './map-node-visualizer.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getTabService: () => TabService,
    private getWorkspaceService: () => WorkspaceService,
    private getDistributionService: () => DistributionService,
    private getMapNodeFileService: () => MapNodeFileService,
    private getMapNodeIngestionService: () => MapNodeIngestionService,
    private getMapNodeContextService: () => MapNodeContextService,
    private getMapNodeQuestionService: () => MapNodeQuestionService,
    private getMapNodeVectorDatabaseService: () => MapNodeVectorDatabaseService,
    private getMapNodeDataFrameService: () => MapNodeDataFrameService,
    private getMapNodeLlmService: () => MapNodeLlmService,
    private getMapNodeVisualizerService: () => MapNodeVisualizerService
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

  get mapNodeFileService(): MapNodeFileService {
    return this.getMapNodeFileService();
  }

  get mapNodeIngestionService(): MapNodeIngestionService {
    return this.getMapNodeIngestionService();
  }

  get mapNodeContextService(): MapNodeContextService {
    return this.getMapNodeContextService();
  }

  get mapNodeQuestionService(): MapNodeQuestionService {
    return this.getMapNodeQuestionService();
  }

  get mapNodeVectorDatabaseService(): MapNodeVectorDatabaseService {
    return this.getMapNodeVectorDatabaseService();
  }

  get mapNodeDataFrameService(): MapNodeDataFrameService {
    return this.getMapNodeDataFrameService();
  }

  get mapNodeLlmService(): MapNodeLlmService {
    return this.getMapNodeLlmService();
  }

  get mapNodeVisualizerService(): MapNodeVisualizerService {
    return this.getMapNodeVisualizerService();
  }

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
          data: Object.entries(newMapData.n).map(([id, n]) => ({ id: Number(id), ...n, mapId: map.id })),
        });
        await prisma.mapLink.createMany({
          data: Object.entries(newMapData.l).map(([id, l]) => ({ id: Number(id), ...l, mapId: map.id })),
        });
      });
    }

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    return map;
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number; workspaceId: number; mapName: string }) {
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
  }) {
    // TODO rework

    const mapInfo = await this.getMapInfo({ mapId });

    // const newMapData = mapCopy(mapInfo.data, this.genId);

    // const newMap = await this.createMap({ userId, mapName: mapInfo.name + 'Copy', newMapData });

    // await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

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

  private async updateMapGraphIsProcessingSet({ nodeId }: { nodeId: number }) {
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

  async updateMap({ workspaceId, mapId, mapOp }: { workspaceId: number; mapId: number; mapOp: MapOp }) {
    console.log(mapOp);

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
        await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }
      case MapOpType.INSERT_LINK: {
        await this.prisma.mapLink.create({
          data: {
            mapId,
            fromNodeId: mapOp.payload.fromNodeId,
            toNodeId: mapOp.payload.toNodeId,
          },
        });
        await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }
      case MapOpType.DELETE_NODE: {
        const { nodeId } = mapOp.payload;

        await this.prisma.$transaction(async tx => {
          await tx.mapLink.deleteMany({
            where: {
              OR: [{ fromNodeId: nodeId }, { toNodeId: nodeId }],
            },
          });
          await tx.mapNode.delete({
            where: { id: nodeId },
          });
          await tx.mapNode.updateMany({
            where: { mapId },
            data: {
              offsetW: {
                increment: -Math.min(
                  ...Object.entries(m.n)
                    .filter(([k]) => Number(k) !== nodeId)
                    .map(([, ni]) => ni.offsetW)
                ),
              },
              offsetH: {
                increment: -Math.min(
                  ...Object.entries(m.n)
                    .filter(([k]) => Number(k) !== nodeId)
                    .map(([, ni]) => ni.offsetH)
                ),
              },
            },
          });
        });
        await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }
      case MapOpType.DELETE_LINK: {
        const { linkId } = mapOp.payload;

        await this.prisma.mapLink.delete({
          where: { id: linkId },
        });
        await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }
      case MapOpType.MOVE_NODE: {
        const { nodeId, offsetX, offsetY } = mapOp.payload;

        await this.prisma.$transaction(async tx => {
          await tx.mapNode.update({
            where: { id: nodeId },
            data: {
              offsetW: offsetX,
              offsetH: offsetY,
            },
          });
          await tx.mapNode.updateMany({
            where: { mapId },
            data: {
              offsetW: {
                increment: -Math.min(
                  offsetX,
                  ...Object.entries(m.n)
                    .filter(([k]) => Number(k) !== nodeId)
                    .map(([, ni]) => ni.offsetW)
                ),
              },
              offsetH: {
                increment: -Math.min(
                  offsetY,
                  ...Object.entries(m.n)
                    .filter(([k]) => Number(k) !== nodeId)
                    .map(([, ni]) => ni.offsetH)
                ),
              },
            },
          });
        });
        await this.distributeMapGraphChangeToOthers({ workspaceId, mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }

      case MapOpType.UPDATE_NODE: {
        const { nodeId } = mapOp.payload;

        await this.prisma.mapNode.update({
          where: { id: nodeId },
          data: { ...mapOp.payload.data },
        });

        await this.distributeMapGraphChangeToOthers({ workspaceId, mapId, mapData: await this.getMapGraph({ mapId }) });
        break;
      }
    }
  }

  async executeMapUploadFile(mapId: number, nodeId: number, file: Express.Multer.File) {
    await this.updateMapGraphIsProcessingSet({ nodeId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

    const fileHash = await this.mapNodeFileService.upload(file);

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { fileName: file.originalname, fileHash: fileHash ?? '' },
    });

    await this.updateMapGraphIsProcessingClear({ mapId });
    await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
  }

  async executeMap({ mapId }: { mapId: number }) {
    const m = await this.getMapGraph({ mapId });

    const topologicalSort = getTopologicalSort(m);
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    for (const nodeId of topologicalSort) {
      const ni = m.n[nodeId];

      await this.updateMapGraphIsProcessingSet({ nodeId });
      await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });

      await new Promise(el => setTimeout(el, 2000));

      try {
        switch (ni.controlType) {
          case ControlType.FILE: {
            await this.mapNodeFileService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.INGESTION: {
            await this.mapNodeIngestionService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.CONTEXT: {
            await this.mapNodeContextService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.QUESTION: {
            await this.mapNodeQuestionService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.VECTOR_DATABASE: {
            await this.mapNodeVectorDatabaseService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.DATAFRAME: {
            await this.mapNodeDataFrameService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.LLM: {
            await this.mapNodeLlmService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.VISUALIZER: {
            await this.mapNodeVisualizerService.execute({ mapId, nodeId });
            break;
          }
        }

        await this.distributeMapGraphChangeToAll({ mapId, mapData: await this.getMapGraph({ mapId }) });
      } catch (e) {
        console.error(ni.controlType + 'error', e);
        break;
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
