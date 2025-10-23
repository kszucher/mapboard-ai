import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { M } from '../../../shared/src/api/api-types-map';
import { NodeUpdateUp } from '../../../shared/src/api/api-types-node';
import { ShareAccess } from '../../../shared/src/api/api-types-share';
import { getTopologicalSort } from '../../../shared/src/map/map-getters';
import { DistributionService } from '../distribution/distribution.service';
import { ShareRepository } from '../share/share.repository';
import { TabRepository } from '../tab/tab.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { EdgeTypeRepository } from './edge-type.repository';
import { EdgeRepository } from './edge.repository';
import { NodeRepository } from './node.repository';
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

    const nodes = await this.nodeRepository.getNodes({ mapId: workspace.mapId! });

    const edges = await this.edgeRepository.getEdges({ mapId: workspace.mapId! });

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
    private nodeRepository: NodeRepository,
    private edgeRepository: EdgeRepository,
    private edgeTypeRepository: EdgeTypeRepository,
    private tabRepository: TabRepository,
    private shareRepository: ShareRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService
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

    const copyNodes = await this.nodeRepository.copyNodes({ mapId });

    const copyEdges = await this.edgeRepository.copyEdges({ mapId });

    const newMap = await this.mapRepository.createMap({ userId: user.id, mapName: originalMap.name + ' (Copy)' });

    const newNodes = await this.nodeRepository.createNodes({
      mapId: newMap.id,
      nodes: copyNodes.map(({ id, ...rest }) => ({ ...rest, mapId: newMap.id })),
    });

    const nodeIdMap = new Map(copyNodes.map((n, i) => [n.id, newNodes[i].id]));

    await this.edgeRepository.createEdges({
      mapId: newMap.id,
      edges: copyEdges.map(({ id, fromNodeId, toNodeId, schema, ...rest }) => ({
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

  async insertNode({ mapId, nodeTypeId }: { mapId: number; nodeTypeId: number }) {
    const node = await this.nodeRepository.createNode({ mapId, nodeTypeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { insert: [node] } },
    });
  }

  async insertEdge({ mapId, fromNodeId, toNodeId }: { mapId: number; fromNodeId: number; toNodeId: number }) {
    const nodeFrom = await this.nodeRepository.getNodeMapConfig({ nodeId: fromNodeId });

    const nodeTo = await this.nodeRepository.getNodeMapConfig({ nodeId: toNodeId });

    const edgeType = await this.edgeTypeRepository.getEdgeTypeFromNodeTypes({
      fromNodeTypeId: nodeFrom.nodeTypeId,
      toNodeTypeId: nodeTo.nodeTypeId,
    });

    const edge = await this.edgeRepository.createEdge({
      mapId,
      fromNodeId,
      toNodeId,
      edgeTypeId: edgeType.id,
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, edges: { insert: [edge] } },
    });
  }

  async deleteNode({ workspaceId, mapId, nodeId }: { mapId: number; nodeId: number; workspaceId: number }) {
    const edgesOfNode = await this.edgeRepository.getEdgesOfNode({ nodeId });

    await this.edgeRepository.deleteEdges({ edgeIds: edgesOfNode.map(e => e.id) });

    await this.nodeRepository.deleteNode({ nodeId });

    const nodes = await this.nodeRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: {
        mapId,
        nodes: { update: nodes, delete: [nodeId] },
        edges: { delete: edgesOfNode.map(e => e.id) },
      },
    });
  }

  async deleteEdge({ mapId, edgeId }: { mapId: number; edgeId: number }) {
    await this.edgeRepository.deleteEdge({ edgeId });

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
    await this.nodeRepository.updateNode({
      nodeId,
      workspaceId,
      params: { offsetX, offsetY },
    });

    const nodes = await this.nodeRepository.align({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: nodes } },
    });
  }

  async updateNode({
    workspaceId,
    mapId,
    nodeId,
    nodeData,
  }: {
    workspaceId: number;
    mapId: number;
    nodeId: number;
    nodeData: NodeUpdateUp;
  }) {
    const node = await this.nodeRepository.updateNode({
      nodeId,
      workspaceId,
      params: { ...nodeData },
    });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: [node] } },
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
    const [activeNode, inactiveNodes] = await this.nodeRepository.setProcessing({ workspaceId, mapId, nodeId });

    // await this.distributionService.publish({
    //   type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
    //   payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
    // });
    //
    // const fileHash = await this.executeFileService.upload(file);
    //
    // const node = await this.nodeRepository.updateNode({
    //   nodeId,
    //   workspaceId,
    //   params: { fileName: file.originalname, fileHash: fileHash ?? '', isProcessing: false },
    // });
    //
    // await this.distributionService.publish({
    //   type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
    //   payload: { mapId, nodes: { update: [node] } },
    // });
  }

  async executeMap({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    const nodesForSorting = await this.nodeRepository.getNodesForSorting({ mapId });

    const edgesForSorting = await this.edgeRepository.getEdgesForSorting({ mapId });

    const topologicalSort = getTopologicalSort({ n: nodesForSorting, e: edgesForSorting });
    if (!topologicalSort) {
      throw new Error('topological sort error');
    }

    const nodes = await this.nodeRepository.clearResults({ workspaceId, mapId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { update: nodes } },
    });

    for (const nodeId of topologicalSort) {
      const ni = nodesForSorting.find(ni => ni.id === nodeId)!;

      const [activeNode, inactiveNodes] = await this.nodeRepository.setProcessing({ workspaceId, mapId, nodeId });

      await this.distributionService.publish({
        type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        payload: { mapId, nodes: { update: [activeNode, ...inactiveNodes] } },
      });

      try {
        // switch (ni.NodeType.type) {
        //   case 'FILE': {
        //     await new Promise(el => setTimeout(el, 2000));
        //     await this.executeFileService.execute({ mapId, nodeId });
        //     break;
        //   }
        //   case 'INGESTION': {
        //     await this.executeIngestionService.execute({ workspaceId, mapId, nodeId });
        //     break;
        //   }
        //   case 'CONTEXT': {
        //     await new Promise(el => setTimeout(el, 2000));
        //     await this.executeContextService.execute({ mapId, nodeId });
        //     break;
        //   }
        //   case 'QUESTION': {
        //     await new Promise(el => setTimeout(el, 2000));
        //     await this.executeQuestionService.execute({ mapId, nodeId });
        //     break;
        //   }
        //   case 'VECTOR_DATABASE': {
        //     await this.executeVectorDatabaseService.execute({ workspaceId, mapId, nodeId });
        //     break;
        //   }
        //   case 'DATA_FRAME': {
        //     await this.executeDataFrameService.execute({ workspaceId, mapId, nodeId });
        //     break;
        //   }
        //   case 'LLM': {
        //     const node = await this.executeLlmService.execute({ workspaceId, mapId, nodeId });
        //
        //     await this.distributionService.publish({
        //       type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        //       payload: { mapId, nodes: { update: [node] } },
        //     });
        //     break;
        //   }
        //   case 'VISUALIZER': {
        //     const node = await this.executeVisualizerService.execute({ workspaceId, mapId, nodeId });
        //
        //     await this.distributionService.publish({
        //       type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
        //       payload: { mapId, nodes: { update: [node] } },
        //     });
        //     break;
        //   }
        // }
      } catch (e) {
        // console.error(ni.NodeType.type + 'error', e);

        const nodes = await this.nodeRepository.clearProcessing({ workspaceId, mapId });

        await this.distributionService.publish({
          type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
          payload: { mapId, nodes: { update: nodes } },
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

    await this.edgeRepository.deleteEdgesOfMap({ mapId });

    await this.nodeRepository.deleteNodesOfMap({ mapId });

    await this.mapRepository.deleteMap({ mapId });

    await this.workspaceRepository.removeMapFromWorkspaces({ mapId });

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_WORKSPACE, payload: {} });
  }

  async clearProcessingAll() {
    await this.nodeRepository.clearProcessingAll();
  }
}
