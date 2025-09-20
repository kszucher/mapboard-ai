import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import {
  DeleteLinkRequestDto,
  DeleteNodeRequestDto,
  InsertLinkRequestDto,
  InsertNodeRequestDto,
  M,
  MapInfo,
  MoveNodeRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map';
import { getLastIndexN, getMapSelfH, getMapSelfW, getTopologicalSort } from '../../../shared/src/map/map-getters';
import { ControlType } from '../../../shared/src/api/api-types-map-node';
import { DistributionService } from '../distribution/distribution.service';
import { Prisma, PrismaClient } from '../generated/client';
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

  private async setProcessing({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const [activeNode, inactiveNodes] = await this.prisma.$transaction([
      this.prisma.mapNode.update({
        where: { id: nodeId },
        data: { isProcessing: true },
        select: { id: true, isProcessing: true },
      }),
      this.prisma.mapNode.updateManyAndReturn({
        where: { id: { not: nodeId }, mapId },
        data: { isProcessing: false },
        select: { id: true, isProcessing: true },
      }),
    ]);

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: [activeNode, ...inactiveNodes] },
    });
  }

  private async clearProcessing({ mapId }: { mapId: number }) {
    const mapNodes = await this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: { isProcessing: false },
      select: { id: true, isProcessing: true },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: mapNodes },
    });
  }

  private async clearResults({ mapId }: { mapId: number }) {
    const mapNodes = await this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: {
        ingestionOutputJson: Prisma.JsonNull,
        vectorDatabaseId: null,
        vectorDatabaseOutputText: null,
        dataFrameOutputJson: Prisma.JsonNull,
        llmOutputJson: Prisma.JsonNull,
        visualizerOutputText: null,
      },
      select: {
        id: true,
        ingestionOutputJson: true,
        vectorDatabaseId: true,
        vectorDatabaseOutputText: true,
        dataFrameOutputJson: true,
        llmOutputJson: true,
        visualizerOutputText: true,
      },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: mapNodes },
    });
  }

  private async align({ mapId }: { mapId: number }) {
    const mapNodes = await this.prisma.mapNode.findMany({
      where: { mapId },
      select: { offsetW: true, offsetH: true },
    });

    await this.prisma.mapNode.updateMany({
      where: { mapId },
      data: {
        offsetW: { decrement: Math.min(...mapNodes.map(node => node.offsetW)) },
        offsetH: { decrement: Math.min(...mapNodes.map(node => node.offsetH)) },
      },
    });
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
      const map = await this.prisma.map.findUniqueOrThrow({
        where: { id: workspace.mapId },
        select: {
          id: true,
          name: true,
          MapLinks: true,
          MapNodes: true,
        },
      });

      const [mapNodes, mapLinks] = await Promise.all([
        this.prisma.mapNode.findMany({ where: { mapId: workspace.mapId }, omit: { createdAt: true, updatedAt: true } }),
        this.prisma.mapLink.findMany({ where: { mapId: workspace.mapId }, omit: { createdAt: true, updatedAt: true } }),
      ]);

      return {
        id: map.id,
        name: map.name,
        data: { n: mapNodes, l: mapLinks },
      };
    }
  }

  async getLastMapOfUser({ userId }: { userId: number }): Promise<{ id: number }> {
    return this.prisma.map.findFirstOrThrow({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true },
    });
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number; workspaceId: number; mapName: string }) {
    const newMap = await this.prisma.map.create({
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

    await this.tabService.addMapToTab({ userId, mapId: newMap.id });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });

    return newMap;
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
    const originalMap = await this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: { name: true },
    });

    const originalMapNodes = await this.prisma.mapNode.findMany({ where: { mapId } });
    const originalMapLinks = await this.prisma.mapLink.findMany({ where: { mapId } });

    const newMap = await this.prisma.map.create({
      data: {
        name: originalMap.name + ' (Copy)',
        userId,
      },
      select: { id: true },
    });

    const newMapNodes = await this.prisma.mapNode.createManyAndReturn({
      data: originalMapNodes.map(({ id, mapId, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        mapId: newMap.id,
        ingestionOutputJson: rest.ingestionOutputJson ?? Prisma.JsonNull,
        dataFrameOutputJson: rest.dataFrameOutputJson ?? Prisma.JsonNull,
        llmOutputJson: rest.llmOutputJson ?? Prisma.JsonNull,
      })),
      select: {
        id: true,
      },
    });

    const idMap = new Map(originalMapNodes.map((n, i) => [n.id, newMapNodes[i].id]));

    await this.prisma.mapLink.createMany({
      data: originalMapLinks.map(({ id, mapId, fromNodeId, toNodeId, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        mapId: newMap.id,
        fromNodeId: idMap.get(fromNodeId)!,
        toNodeId: idMap.get(toNodeId)!,
      })),
    });

    await this.tabService.addMapToTab({ userId, mapId: newMap.id });

    await this.workspaceService.updateWorkspaceMap({ workspaceId, userId, mapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.RENAME_MAP,
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

  async insertNode({ mapId, controlType }: InsertNodeRequestDto) {
    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({
        where: { mapId },
        select: { iid: true, controlType: true, offsetW: true, offsetH: true },
      }),
      this.prisma.mapLink.findMany({
        where: { mapId },
        select: { id: true, fromNodeId: true, toNodeId: true },
      }),
    ]);

    const m = { n: mapNodes, l: mapLinks };

    const mapNode = await this.prisma.mapNode.create({
      data: {
        mapId,
        iid: getLastIndexN(m) + 1,
        controlType,
        offsetW: getMapSelfW(m),
        offsetH: getMapSelfH(m),
      },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.INSERT_NODE,
      payload: { node: mapNode },
    });
  }

  async insertLink({ mapId, fromNodeId, toNodeId }: InsertLinkRequestDto) {
    const mapLink = await this.prisma.mapLink.create({
      data: { mapId, fromNodeId, toNodeId },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.INSERT_LINK,
      payload: { link: mapLink },
    });
  }

  async deleteNode({ mapId, nodeId }: DeleteNodeRequestDto) {
    const mapLinksToDelete = await this.prisma.mapLink.findMany({
      where: { OR: [{ fromNodeId: nodeId }, { toNodeId: nodeId }] },
      select: { id: true },
    });

    await this.prisma.mapLink.deleteMany({
      where: { OR: [{ fromNodeId: nodeId }, { toNodeId: nodeId }] },
    });

    await this.prisma.mapNode.delete({
      where: { id: nodeId },
    });

    await this.align({ mapId });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.DELETE_NODE,
      payload: { nodeId, linkIds: mapLinksToDelete.map(l => l.id) },
    });
  }

  async deleteLink({ mapId, linkId }: DeleteLinkRequestDto) {
    await this.prisma.mapLink.delete({
      where: { id: linkId },
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.DELETE_LINK,
      payload: { linkId },
    });
  }

  async moveNode({ workspaceId, mapId, nodeId, offsetX, offsetY }: MoveNodeRequestDto & { workspaceId: number }) {
    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        offsetW: offsetX,
        offsetH: offsetY,
      },
    });

    await this.align({ mapId });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(
      workspaceIdsOfMap.filter(el => el !== workspaceId),
      {
        type: SSE_EVENT_TYPE.MOVE_NODE,
        payload: { nodeId, offsetX, offsetY },
      }
    );
  }

  async updateNode({ workspaceId, mapId, nodeId, node }: UpdateNodeRequestDto & { workspaceId: number }) {
    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: node,
    });

    const workspaceIdsOfMap = await this.workspaceService.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(
      workspaceIdsOfMap.filter(el => el !== workspaceId),
      {
        type: SSE_EVENT_TYPE.UPDATE_NODE,
        payload: { node },
      }
    );
  }

  async executeMapUploadFile({ mapId, nodeId, file }: { mapId: number; nodeId: number; file: Express.Multer.File }) {
    await this.setProcessing({ mapId, nodeId });

    const fileHash = await this.mapNodeFileService.upload(file);

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { fileName: file.originalname, fileHash: fileHash ?? '' },
    });

    await this.clearProcessing({ mapId });
  }

  async executeMap({ mapId }: { mapId: number }) {
    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({ where: { mapId }, select: { id: true, controlType: true } }),
      this.prisma.mapLink.findMany({ where: { mapId }, select: { fromNodeId: true, toNodeId: true } }),
    ]);

    const m = { n: mapNodes, l: mapLinks };

    await this.clearResults({ mapId });

    const topologicalSort = getTopologicalSort(m);
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    for (const nodeId of topologicalSort) {
      const ni = m.n.find(ni => ni.id === nodeId)!;

      await this.setProcessing({ mapId, nodeId });

      try {
        switch (ni.controlType) {
          case ControlType.FILE: {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeFileService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.INGESTION: {
            await this.mapNodeIngestionService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.CONTEXT: {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeContextService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.QUESTION: {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeQuestionService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.VECTOR_DATABASE: {
            await this.mapNodeVectorDatabaseService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.DATA_FRAME: {
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
      } catch (e) {
        console.error(ni.controlType + 'error', e);
        break;
      }
    }

    await this.clearProcessing({ mapId });
  }

  async deleteMap({ userId, mapId }: { userId: number; mapId: number }) {
    await this.workspaceService.removeMapFromWorkspaces({ mapId });

    await this.tabService.removeMapFromTab({ userId, mapId });

    const shares = await this.prisma.share.findMany({ where: { mapId }, select: { shareUserId: true } });

    await this.prisma.share.deleteMany({ where: { mapId } });

    await this.prisma.mapLink.deleteMany({ where: { mapId } });

    await this.prisma.mapNode.deleteMany({ where: { mapId } });

    await this.prisma.map.delete({ where: { id: mapId } });

    const userIds = [userId, ...shares.map(share => share.shareUserId)];

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({ userIds });

    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: SSE_EVENT_TYPE.DELETE_MAP,
      payload: { mapId },
    });
  }

  async terminateProcesses() {
    await this.prisma.mapNode.updateMany({ data: { isProcessing: false } });
  }
}
