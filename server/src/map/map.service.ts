import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import {
  DeleteLinkRequestDto,
  DeleteNodeRequestDto,
  InsertLinkRequestDto,
  InsertNodeRequestDto,
  MapInfo,
  MoveNodeRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map';
import { ControlType, LlmOutputSchema } from '../../../shared/src/api/api-types-map-node';
import { getLastIndexN, getMapSelfH, getMapSelfW, getTopologicalSort } from '../../../shared/src/map/map-getters';
import { DistributionService } from '../distribution/distribution.service';
import { Prisma, PrismaClient } from '../generated/client';
import { TabRepository } from '../tab/tab.repository';
import { TabService } from '../tab/tab.service';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { MapNodeContextService } from './map-node-context.service';
import { MapNodeDataFrameService } from './map-node-data-frame.service';
import { MapNodeFileService } from './map-node-file.service';
import { MapNodeIngestionService } from './map-node-ingestion.service';
import { MapNodeLlmService } from './map-node-llm.service';
import { MapNodeQuestionService } from './map-node-question.service';
import { MapNodeVectorDatabaseService } from './map-node-vector-database.service';
import { MapNodeVisualizerService } from './map-node-visualizer.service';
import { MapRepository } from './map.repository';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private getMapRepository: () => MapRepository,
    private getTabRepository: () => TabRepository,
    private getTabService: () => TabService,
    private getWorkspaceRepository: () => WorkspaceRepository,
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

  get mapRepository(): MapRepository {
    return this.getMapRepository();
  }

  get tabRepository(): TabRepository {
    return this.getTabRepository();
  }

  get tabService(): TabService {
    return this.getTabService();
  }

  get workspaceRepository(): WorkspaceRepository {
    return this.getWorkspaceRepository();
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
    const [activeNode, inactiveNodes] = await this.mapRepository.setProcessing({ mapId, nodeId });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: [activeNode, ...inactiveNodes] },
    });
  }

  private async clearProcessing({ mapId }: { mapId: number }) {
    const mapNodes = await this.mapRepository.clearProcessing({ mapId });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: mapNodes },
    });
  }

  private async clearResults({ mapId }: { mapId: number }) {
    const mapNodes = await this.mapRepository.clearResults({ mapId });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.UPDATE_NODES,
      payload: { nodes: mapNodes },
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
    }

    return await this.mapRepository.getMapinfo({ mapId: workspace.mapId });
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number; workspaceId: number; mapName: string }) {
    const newMap = await this.mapRepository.createMap({ userId, mapName });

    await this.tabService.addMapToTab({ userId, mapId: newMap.id });

    // TODO distribute

    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId: newMap.id });
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

    // TODO distribute

    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.mapRepository.renameMap({ mapId, mapName });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.RENAME_MAP,
      payload: { mapId, mapName },
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
        ...(controlType === ControlType.LLM && { llmOutputSchema: LlmOutputSchema.TEXT }),
        offsetW: getMapSelfW(m),
        offsetH: getMapSelfH(m),
      },
    });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.INSERT_NODE,
      payload: { node: mapNode },
    });
  }

  async insertLink({ mapId, fromNodeId, toNodeId }: InsertLinkRequestDto) {
    const mapLink = await this.prisma.mapLink.create({
      data: { mapId, fromNodeId, toNodeId },
    });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

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

    await this.mapRepository.align({ mapId });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.DELETE_NODE,
      payload: { nodeId, linkIds: mapLinksToDelete.map(l => l.id) },
    });
  }

  async deleteLink({ mapId, linkId }: DeleteLinkRequestDto) {
    await this.prisma.mapLink.delete({
      where: { id: linkId },
    });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

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

    await this.mapRepository.align({ mapId });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

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

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });

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
    await this.workspaceRepository.removeMapFromWorkspaces({ mapId });

    await this.tabRepository.removeMapFromTab({ userId, mapId });

    // TODO distribute

    const shares = await this.prisma.share.findMany({ where: { mapId }, select: { shareUserId: true } });

    await this.prisma.share.deleteMany({ where: { mapId } });

    await this.prisma.mapLink.deleteMany({ where: { mapId } });

    await this.prisma.mapNode.deleteMany({ where: { mapId } });

    await this.prisma.map.delete({ where: { id: mapId } });

    const userIds = [userId, ...shares.map(share => share.shareUserId)];

    const workspaceIdsOfUsers = await this.workspaceRepository.getWorkspaceIdsOfUsers({ userIds });

    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: SSE_EVENT_TYPE.DELETE_MAP,
      payload: { mapId },
    });
  }
}
