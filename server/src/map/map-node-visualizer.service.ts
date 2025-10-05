import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeVisualizerService {
  constructor(
    private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
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

    return this.prisma.mapNode.update({
      where: { id: nodeId },
      data: { workspaceId, visualizerOutputText },
      select: { id: true, workspaceId: true, visualizerOutputText: true, updatedAt: true },
    });
  }
}
