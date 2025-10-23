import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { M } from '../../../shared/src/api/api-types-map';
import { NodeUpdateUp } from '../../../shared/src/api/api-types-map-node';
import { ShareAccess } from '../../../shared/src/api/api-types-share';
import { getTopologicalSort } from '../../../shared/src/map/map-getters';
import { DistributionService } from '../distribution/distribution.service';
import { ShareRepository } from '../share/share.repository';
import { TabRepository } from '../tab/tab.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { MapEdgeConfigRepository } from './map-edge-config.repository';
import { MapEdgeRepository } from './map-edge.repository';
import { MapNodeContextService } from './map-node-context.service';
import { MapNodeDataFrameService } from './map-node-data-frame.service';
import { MapNodeFileService } from './map-node-file.service';
import { MapNodeIngestionService } from './map-node-ingestion.service';
import { MapNodeLlmService } from './map-node-llm.service';
import { MapNodeQuestionService } from './map-node-question.service';
import { MapNodeVectorDatabaseService } from './map-node-vector-database.service';
import { MapNodeVisualizerService } from './map-node-visualizer.service';
import { MapNodeRepository } from './map-node.repository';
import { MapRepository } from './map.repository';

@injectable()
export class MapService {
  async getWorkspaceMapInfo({ workspaceId }: { workspaceId: number }): Promise<{
    id: number;
    name: string;
    data: M;
    shareAccess: ShareAccess;
  }> {
    const workspace = await this.workspaceRepository.getWorkspaceById({ workspaceId });

    const map = await this.mapRepository.getMap({ mapId: workspace.mapId! });

    const nodes = await this.mapNodeRepository.getNodes({ mapId: workspace.mapId! });

    const edges = await this.mapEdgeRepository.getEdges({ mapId: workspace.mapId! });

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
      data: { n: nodes, e: edges },
      shareAccess,
    };
  }

  constructor(
    private userRepository: UserRepository,
    private mapRepository: MapRepository,
    private mapNodeRepository: MapNodeRepository,
    private mapEdgeRepository: MapEdgeRepository,
    private mapEdgeConfigRepository: MapEdgeConfigRepository,
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

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_TAB, payload: { tabId: tab.id } });
  }

  async createMapInTabNew({ sub, workspaceId, mapName }: { sub: string; workspaceId: number; mapName: string }) {
    const user = await this.userRepository.getUserBySub({ sub });

    const newMap = await this.mapRepository.createMap({ userId: user.id, mapName });

    await this.createMapCommon({ userId: user.id, workspaceId, mapId: newMap.id });
  }

  async createMapInTabDuplicate({ sub, workspaceId, mapId }: { sub: string; workspaceId: number; mapId: number }) {
    const user = await this.userRepository.getUserBySub({ sub });

    const originalMap = await this.mapRepository.getMapName({ mapId });

    const copyNodes = await this.mapNodeRepository.copyNodes({ mapId });

    const copyEdges = await this.mapEdgeRepository.copyEdges({ mapId });

    const newMap = await this.mapRepository.createMap({ userId: user.id, mapName: originalMap.name + ' (Copy)' });

    const newNodes = await this.mapNodeRepository.createNodes({
      mapId: newMap.id,
      nodes: copyNodes.map(({ id, ...rest }) => ({ ...rest, mapId: newMap.id })),
    });

    const nodeIdMap = new Map(copyNodes.map((n, i) => [n.id, newNodes[i].id]));

    await this.mapEdgeRepository.createEdges({
      mapId: newMap.id,
      edges: copyEdges.map(({ id, fromNodeId, toNodeId, ...rest }) => ({
        ...rest,
        mapId: newMap.id,
        fromNodeId: nodeIdMap.get(fromNodeId)!,
        toNodeId: nodeIdMap.get(toNodeId)!,
      })),
    });

    await this.createMapCommon({ userId: user.id, workspaceId, mapId: newMap.id });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.mapRepository.renameMap({ mapId, mapName });

    const tabs = await this.tabRepository.getTabsOfMap({ mapId });

    for (const tab of tabs) {
      await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_TAB, payload: { tabId: tab.id } });
    }

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_MAP, payload: { mapId } });

    const shares = await this.shareRepository.getSharesOfMap({ mapId });

    for (const share of shares) {
      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_SHARE,
        payload: { shareId: share.id },
      });
    }
  }

  async insertNode({ mapId, mapNodeConfigId }: { mapId: number; mapNodeConfigId: number }) {
    const mapNode = await this.mapNodeRepository.createNode({ mapId, mapNodeConfigId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { insert: [mapNode] } },
    });
  }

  async insertEdge({ mapId, fromNodeId, toNodeId }: { mapId: number; fromNodeId: number; toNodeId: number }) {
    const mapNodeFrom = await this.mapNodeRepository.getNodeMapConfig({ nodeId: fromNodeId });

    const mapNodeTo = await this.mapNodeRepository.getNodeMapConfig({ nodeId: toNodeId });

    const mapEdgeConfig = await this.mapEdgeConfigRepository.getEdgeConfigFromNodeConfigs({
      fromNodeConfigId: mapNodeFrom.MapNodeConfig.id,
      toNodeConfigId: mapNodeTo.MapNodeConfig.id,
    });

    const mapEdge = await this.mapEdgeRepository.createEdge({
      mapId,
      fromNodeId,
      toNodeId,
      mapEdgeConfigId: mapEdgeConfig.id,
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, edges: { insert: [mapEdge] } },
    });
  }

  async deleteNode({ workspaceId, mapId, nodeId }: { mapId: number; nodeId: number; workspaceId: number }) {
    const edgesOfNode = await this.mapEdgeRepository.getEdgesOfNode({ nodeId });

    await this.mapEdgeRepository.deleteEdges({ edgeIds: edgesOfNode.map(e => e.id) });

    await this.mapNodeRepository.deleteNode({ nodeId });

    const mapNodes = await this.mapNodeRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: {
        mapId,
        nodes: { update: mapNodes, delete: [nodeId] },
        edges: { delete: edgesOfNode.map(e => e.id) },
      },
    });
  }

  async deleteEdge({ mapId, edgeId }: { mapId: number; edgeId: number }) {
    await this.mapEdgeRepository.deleteEdge({ edgeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, edges: { delete: [edgeId] } },
    });
  }

  async moveNode({
    workspaceId,
    mapId,
    nodeId,
    offsetX,
    offsetY,
  }: {
    mapId: number;
    nodeId: number;
    offsetX: number;
    offsetY: number;
    workspaceId: number;
  }) {
    await this.mapNodeRepository.updateNode({
      nodeId,
      workspaceId,
      params: { offsetX, offsetY },
    });

    const mapNodes = await this.mapNodeRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: mapNodes } },
    });
  }

  async updateNode({
    workspaceId,
    mapId,
    nodeId,
    node,
  }: {
    workspaceId: number;
    mapId: number;
    nodeId: number;
    node: NodeUpdateUp;
  }) {
    const mapNode = await this.mapNodeRepository.updateNode({
      nodeId,
      workspaceId,
      params: { ...node },
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
    const [activeNode, inactiveNodes] = await this.mapNodeRepository.setProcessing({ workspaceId, mapId, nodeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
    });

    const fileHash = await this.mapNodeFileService.upload(file);

    const mapNode = await this.mapNodeRepository.updateNode({
      nodeId,
      workspaceId,
      params: { fileName: file.originalname, fileHash: fileHash ?? '', isProcessing: false },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [mapNode] } },
    });
  }

  async executeMap({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    const nodesForSorting = await this.mapNodeRepository.getNodesForSorting({ mapId });

    const edgesForSorting = await this.mapEdgeRepository.getEdgesForSorting({ mapId });

    const topologicalSort = getTopologicalSort({ n: nodesForSorting, e: edgesForSorting });
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    const mapNodes = await this.mapNodeRepository.clearResults({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: mapNodes } },
    });

    for (const nodeId of topologicalSort) {
      const ni = nodesForSorting.find(ni => ni.id === nodeId)!;

      const [activeNode, inactiveNodes] = await this.mapNodeRepository.setProcessing({ workspaceId, mapId, nodeId });

      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
      });

      try {
        switch (ni.MapNodeConfig.type) {
          case 'FILE': {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeFileService.execute({ mapId, nodeId });
            break;
          }
          case 'INGESTION': {
            await this.mapNodeIngestionService.execute({ workspaceId, mapId, nodeId });
            break;
          }
          case 'CONTEXT': {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeContextService.execute({ mapId, nodeId });
            break;
          }
          case 'QUESTION': {
            await new Promise(el => setTimeout(el, 2000));
            await this.mapNodeQuestionService.execute({ mapId, nodeId });
            break;
          }
          case 'VECTOR_DATABASE': {
            await this.mapNodeVectorDatabaseService.execute({ workspaceId, mapId, nodeId });
            break;
          }
          case 'DATA_FRAME': {
            await this.mapNodeDataFrameService.execute({ workspaceId, mapId, nodeId });
            break;
          }
          case 'LLM': {
            const mapNode = await this.mapNodeLlmService.execute({ workspaceId, mapId, nodeId });

            await this.distributionService.publish({
              type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
              payload: { mapId, nodes: { update: [mapNode] } },
            });
            break;
          }
          case 'VISUALIZER': {
            const mapNode = await this.mapNodeVisualizerService.execute({ workspaceId, mapId, nodeId });

            await this.distributionService.publish({
              type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
              payload: { mapId, nodes: { update: [mapNode] } },
            });
            break;
          }
        }
      } catch (e) {
        console.error(ni.MapNodeConfig.type + 'error', e);

        const mapNodes = await this.mapNodeRepository.clearProcessing({ workspaceId, mapId });

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

    await this.mapEdgeRepository.deleteMapEdges({ mapId });

    await this.mapNodeRepository.deleteMapNodes({ mapId });

    await this.mapRepository.deleteMap({ mapId });

    await this.workspaceRepository.removeMapFromWorkspaces({ mapId });

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_WORKSPACE, payload: {} });
  }

  async clearProcessingAll() {
    await this.mapNodeRepository.clearProcessingAll();
  }
}
