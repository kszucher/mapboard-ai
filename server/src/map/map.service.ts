import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import {
  DeleteLinkRequestDto,
  DeleteNodeRequestDto,
  GetMapInfoQueryResponseDto,
  InsertLinkRequestDto,
  InsertNodeRequestDto,
  MoveNodeRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map';
import { ControlType } from '../../../shared/src/api/api-types-map-node';
import { ShareAccess } from '../../../shared/src/api/api-types-share';
import { getTopologicalSort } from '../../../shared/src/map/map-getters';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { ShareRepository } from '../share/share.repository';
import { TabRepository } from '../tab/tab.repository';
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

@injectable()
export class MapService {
  async getWorkspaceMapInfo({ workspaceId }: { workspaceId: number }): Promise<GetMapInfoQueryResponseDto> {
    const workspace = await this.workspaceRepository.getWorkspaceById({ workspaceId });

    if (!workspace.mapId) {
      throw new Error('workspace has no map');
    }

    const map = await this.mapRepository.getMapWithGraph({ mapId: workspace.mapId });

    await this.mapRepository.incrementOpenCount({ mapId: map.id });

    const shareAccess =
      workspace.userId === map.userId
        ? ShareAccess.EDIT
        : await this.shareRepository.getShareAccess({
            shareUserId: workspace.userId,
            mapId: map.id,
          });

    return {
      id: map.id,
      name: map.name,
      data: { n: map.MapNodes, l: map.MapLinks },
      shareAccess,
    };
  }

  constructor(
    private prisma: PrismaClient,
    private mapRepository: MapRepository,
    private tabRepository: TabRepository,
    private shareRepository: ShareRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService,
    private mapNodeFileService: MapNodeFileService,
    private mapNodeIngestionService: MapNodeIngestionService,
    private mapNodeContextService: MapNodeContextService,
    private mapNodeQuestionService: MapNodeQuestionService,
    private mapNodeVectorDatabaseService: MapNodeVectorDatabaseService,
    private mapNodeDataFrameService: MapNodeDataFrameService,
    private mapNodeLlmService: MapNodeLlmService,
    private mapNodeVisualizerService: MapNodeVisualizerService
  ) {}

  private async createMapCommon({
    userId,
    workspaceId,
    mapId,
  }: {
    userId: number;
    workspaceId: number;
    mapId: number;
  }) {
    await this.tabRepository.addMapToTab({ userId, mapId });

    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId });

    const workspacesOfUser = await this.workspaceRepository.getWorkspacesOfUser({ userId });

    await this.distributionService.publish(
      workspacesOfUser.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_TAB, payload: {} }
    );
  }

  async createMapInTabNew({ userId, workspaceId, mapName }: { userId: number; workspaceId: number; mapName: string }) {
    const newMap = await this.mapRepository.createMap({ userId, mapName });

    await this.createMapCommon({ userId, workspaceId, mapId: newMap.id });
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
    const newMap = await this.mapRepository.createMapDuplicate({ userId, mapId });

    await this.createMapCommon({ userId, workspaceId, mapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.mapRepository.renameMap({ mapId, mapName });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_TAB, payload: {} }
    );
  }

  async insertNode({ mapId, controlType }: InsertNodeRequestDto) {
    const mapNode = await this.mapRepository.insertNode({ mapId, controlType });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { insert: [mapNode] } } }
    );
  }

  async insertLink({ mapId, fromNodeId, toNodeId }: InsertLinkRequestDto) {
    const mapLink = await this.prisma.mapLink.create({
      data: { mapId, fromNodeId, toNodeId },
    });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { links: { insert: [mapLink] } } }
    );
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

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      {
        type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        payload: { nodes: { delete: [nodeId] }, links: { delete: mapLinksToDelete.map(l => l.id) } },
      }
    );
  }

  async deleteLink({ mapId, linkId }: DeleteLinkRequestDto) {
    await this.prisma.mapLink.delete({
      where: { id: linkId },
    });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { links: { delete: [linkId] } } }
    );
  }

  async moveNode({ workspaceId, mapId, nodeId, offsetX, offsetY }: MoveNodeRequestDto & { workspaceId: number }) {
    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        offsetW: offsetX,
        offsetH: offsetY,
      },
    });

    const mapNodes = await this.mapRepository.align({ mapId });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id).filter(el => el !== workspaceId),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: mapNodes } } }
    );
  }

  async updateNode({ workspaceId, mapId, node }: UpdateNodeRequestDto & { workspaceId: number }) {
    await this.prisma.mapNode.update({
      where: { id: node.id },
      data: node,
    });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id).filter(el => el !== workspaceId),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [node] } } }
    );
  }

  async executeMapUploadFile({ mapId, nodeId, file }: { mapId: number; nodeId: number; file: Express.Multer.File }) {
    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    const [activeNode, inactiveNodes] = await this.mapRepository.setProcessing({ mapId, nodeId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [activeNode, ...inactiveNodes] } } }
    );

    const fileHash = await this.mapNodeFileService.upload(file);

    const mapNode = await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { fileName: file.originalname, fileHash: fileHash ?? '', isProcessing: false },
      select: { id: true, isProcessing: true },
    });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [mapNode] } } }
    );
  }

  async executeMap({ mapId }: { mapId: number }) {
    const map = await this.mapRepository.getMapWithGraphStructure({ mapId });

    const mapNodes = await this.mapRepository.clearResults({ mapId });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: mapNodes } } }
    );

    const topologicalSort = getTopologicalSort({ n: map.MapNodes, l: map.MapLinks });
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    for (const nodeId of topologicalSort) {
      const ni = map.MapNodes.find(ni => ni.id === nodeId)!;

      const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

      const [activeNode, inactiveNodes] = await this.mapRepository.setProcessing({ mapId, nodeId });

      await this.distributionService.publish(
        workspacesOfMap.map(el => el.id),
        { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [activeNode, ...inactiveNodes] } } }
      );

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
            const mapNode = await this.mapNodeLlmService.execute({ mapId, nodeId });

            await this.distributionService.publish(
              workspacesOfMap.map(el => el.id),
              { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [mapNode] } } }
            );
            break;
          }
          case ControlType.VISUALIZER: {
            const mapNode = await this.mapNodeVisualizerService.execute({ mapId, nodeId });

            await this.distributionService.publish(
              workspacesOfMap.map(el => el.id),
              { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: [mapNode] } } }
            );
            break;
          }
        }
      } catch (e) {
        console.error(ni.controlType + 'error', e);

        const mapNodes = await this.mapRepository.clearProcessing({ mapId });

        await this.distributionService.publish(
          workspacesOfMap.map(el => el.id),
          { type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH, payload: { nodes: { update: mapNodes } } }
        );

        break;
      }
    }
  }

  async deleteMap({ userId, mapId }: { userId: number; mapId: number }) {
    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({ mapId });

    await this.workspaceRepository.removeMapFromWorkspaces({ mapId });

    await this.tabRepository.removeMapFromTab({ userId, mapId });

    await this.prisma.share.deleteMany({ where: { mapId } });

    await this.prisma.mapLink.deleteMany({ where: { mapId } });

    await this.prisma.mapNode.deleteMany({ where: { mapId } });

    await this.prisma.map.delete({ where: { id: mapId } });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_WORKSPACE_MAP_TAB_SHARE, payload: { mapId } }
    );
  }

  async clearProcessingAll() {
    await this.mapRepository.clearProcessingAll();
  }
}
