import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { NodeUpdateUp } from '../../../shared/src/api/api-types-node';
import { DistributionService } from '../distribution/distribution.service';
import { EdgeRepository } from '../edge/edge.repository';
import { NodeRepository } from './node.repository';

@injectable()
export class NodeService {
  constructor(
    private nodeRepository: NodeRepository,
    private edgeRepository: EdgeRepository,
    private distributionService: DistributionService
  ) {}

  async insertNode({ mapId, nodeTypeId }: { mapId: number; nodeTypeId: number }) {
    const node = await this.nodeRepository.createNode({ mapId, nodeTypeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, nodes: { insert: [node] } },
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

  async clearProcessingAll() {
    await this.nodeRepository.clearProcessingAll();
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
}
