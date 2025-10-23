import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { EdgeTypeRepository } from '../edge-type/edge-type.repository';
import { NodeRepository } from '../node/node.repository';
import { EdgeRepository } from './edge.repository';

@injectable()
export class EdgeService {
  constructor(
    private nodeRepository: NodeRepository,
    private edgeRepository: EdgeRepository,
    private edgeTypeRepository: EdgeTypeRepository,
    private distributionService: DistributionService
  ) {}

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

  async deleteEdge({ mapId, edgeId }: { mapId: number; edgeId: number }) {
    await this.edgeRepository.deleteEdge({ edgeId });

    await this.distributionService.publish({
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { mapId, edges: { delete: [edgeId] } },
    });
  }
}
