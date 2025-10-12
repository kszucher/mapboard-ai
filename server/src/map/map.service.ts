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
import { UserRepository } from '../user/user.repository';
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
    private userRepository: UserRepository,
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
    const tab = await this.tabRepository.addMapToTab({ userId, mapId });

    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_TAB,
      payload: { tabId: tab.id },
    });
  }

  async createMapInTabNew({ sub, workspaceId, mapName }: { sub: string; workspaceId: number; mapName: string }) {
    const user = await this.userRepository.getUserBySub({ sub });

    const newMap = await this.mapRepository.createMap({ userId: user.id, mapName });

    await this.createMapCommon({ userId: user.id, workspaceId, mapId: newMap.id });
  }

  async createMapInTabDuplicate({ sub, workspaceId, mapId }: { sub: string; workspaceId: number; mapId: number }) {
    const user = await this.userRepository.getUserBySub({ sub });

    const newMap = await this.mapRepository.createMapDuplicate({ userId: user.id, mapId });

    await this.createMapCommon({ userId: user.id, workspaceId, mapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.mapRepository.renameMap({ mapId, mapName });

    const tabs = await this.tabRepository.getTabsOfMap({ mapId });

    for (const tab of tabs) {
      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_TAB,
        payload: { tabId: tab.id },
      });
    }

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP,
      payload: { mapId },
    });

    const shares = await this.shareRepository.getSharesOfMap({ mapId });

    for (const share of shares) {
      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_SHARE,
        payload: { shareId: share.id },
      });
    }
  }

  async insertNode({ mapId, controlType }: InsertNodeRequestDto) {
    const mapNode = await this.mapRepository.insertNode({ mapId, controlType });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { insert: [mapNode] } },
    });
  }

  async insertLink({ mapId, fromNodeId, toNodeId }: InsertLinkRequestDto) {
    const mapLink = await this.prisma.mapLink.create({
      data: { mapId, fromNodeId, toNodeId },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, links: { insert: [mapLink] } },
    });
  }

  async deleteNode({ workspaceId, mapId, nodeId }: DeleteNodeRequestDto & { workspaceId: number }) {
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

    const mapNodes = await this.mapRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: {
        mapId,
        nodes: { update: mapNodes, delete: [nodeId] },
        links: { delete: mapLinksToDelete.map(l => l.id) },
      },
    });
  }

  async deleteLink({ mapId, linkId }: DeleteLinkRequestDto) {
    await this.prisma.mapLink.delete({
      where: { id: linkId },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, links: { delete: [linkId] } },
    });
  }

  async moveNode({ workspaceId, mapId, nodeId, offsetX, offsetY }: MoveNodeRequestDto & { workspaceId: number }) {
    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { workspaceId, offsetX, offsetY },
    });

    const mapNodes = await this.mapRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: mapNodes } },
    });
  }

  async updateNode({ workspaceId, mapId, node }: UpdateNodeRequestDto & { workspaceId: number }) {
    const mapNode = await this.prisma.mapNode.update({
      where: { id: node.id },
      data: { ...node, workspaceId },
      omit: { createdAt: true },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [mapNode] } },
    });
  }

  async executeMapUploadFile({
    workspaceId,
    mapId,
    nodeId,
    file,
  }: {
    workspaceId: number;
    mapId: number;
    nodeId: number;
    file: Express.Multer.File;
  }) {
    const [activeNode, inactiveNodes] = await this.mapRepository.setProcessing({ workspaceId, mapId, nodeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
    });

    const fileHash = await this.mapNodeFileService.upload(file);

    const mapNode = await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { workspaceId, fileName: file.originalname, fileHash: fileHash ?? '', isProcessing: false },
      select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [mapNode] } },
    });
  }

  async executeMap({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    const map = await this.mapRepository.getMapWithGraphStructure({ mapId });

    const mapNodes = await this.mapRepository.clearResults({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: mapNodes } },
    });

    const topologicalSort = getTopologicalSort({ n: map.MapNodes, l: map.MapLinks });
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    for (const nodeId of topologicalSort) {
      const ni = map.MapNodes.find(ni => ni.id === nodeId)!;

      const [activeNode, inactiveNodes] = await this.mapRepository.setProcessing({ workspaceId, mapId, nodeId });

      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
      });

      try {
        switch (ni.controlType) {
          case ControlType.FILE: {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeFileService.execute({ mapId, nodeId });
            break;
          }
          case ControlType.INGESTION: {
            await this.mapNodeIngestionService.execute({ workspaceId, mapId, nodeId });
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
            await this.mapNodeVectorDatabaseService.execute({ workspaceId, mapId, nodeId });
            break;
          }
          case ControlType.DATA_FRAME: {
            await this.mapNodeDataFrameService.execute({ workspaceId, mapId, nodeId });
            break;
          }
          case ControlType.LLM: {
            const mapNode = await this.mapNodeLlmService.execute({ workspaceId, mapId, nodeId });

            await this.distributionService.publish({
              type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
              payload: { mapId, nodes: { update: [mapNode] } },
            });
            break;
          }
          case ControlType.VISUALIZER: {
            const mapNode = await this.mapNodeVisualizerService.execute({ workspaceId, mapId, nodeId });

            await this.distributionService.publish({
              type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
              payload: { mapId, nodes: { update: [mapNode] } },
            });
            break;
          }
        }
      } catch (e) {
        console.error(ni.controlType + 'error', e);

        const mapNodes = await this.mapRepository.clearProcessing({ workspaceId, mapId });

        await this.distributionService.publish({
          type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
          payload: { mapId, nodes: { update: mapNodes } },
        });

        break;
      }
    }
  }

  async deleteMap({ sub, mapId }: { sub: string; mapId: number }) {
    const user = await this.userRepository.getUserBySub({ sub });

    const shares = await this.shareRepository.getSharesOfMap({ mapId });

    for (const share of shares) {
      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_SHARE,
        payload: { shareId: share.id },
      });
    }

    await this.shareRepository.deleteSharesOfMap({ mapId });

    const tab = await this.tabRepository.removeMapFromTab({ userId: user.id, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_TAB,
      payload: { tabId: tab.id },
    });

    await this.mapRepository.deleteMap({ mapId });

    await this.workspaceRepository.removeMapFromWorkspaces({ mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_WORKSPACE,
      payload: {},
    });
  }

  async clearProcessingAll() {
    await this.mapRepository.clearProcessingAll();
  }
}
