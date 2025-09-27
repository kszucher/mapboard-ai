import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeVisualizerService {
  constructor(
    private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService
  ) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const [inputLlmNode, inputDataFrameNode, node] = await Promise.all([
      this.mapNodeService.getInputLlmNode({ mapId, nodeId }),
      this.mapNodeService.getInputDataFrameNode({ mapId, nodeId }),
      this.mapNodeService.getNode({ mapId, nodeId }),
    ]);

    let visualizerOutputText = '';
    if (inputLlmNode && inputLlmNode.llmOutputJson) {
      visualizerOutputText = JSON.stringify(inputLlmNode.llmOutputJson);
    }
    if (inputDataFrameNode && inputDataFrameNode.dataFrameOutputJson) {
      visualizerOutputText = JSON.stringify(inputDataFrameNode.dataFrameOutputJson);
    }

    const mapNode = await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { visualizerOutputText },
      select: { id: true, visualizerOutputText: true },
    });

    const workspaceIdsOfMap = await this.workspaceRepository.getWorkspaceIdsOfMap({ mapId });
    await this.distributionService.publish(workspaceIdsOfMap, {
      type: SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH,
      payload: { nodes: { update: [mapNode] } },
    });
  }
}
