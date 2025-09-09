import { PrismaClient } from '../generated/client';
import { MapNodeService } from './map-node.service';

export class MapNodeVisualizerService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  get mapNodeService(): MapNodeService {
    return this.getMapNodeService();
  }

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
    
    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { visualizerOutputText },
    });
  }
}
