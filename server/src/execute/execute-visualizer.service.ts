import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { NodeRepository } from '../map/node.repository';

@injectable()
export class ExecuteVisualizerService {
  constructor(
    private prisma: PrismaClient,
    private nodeRepository: NodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    const [inputLlmNode, inputDataFrameNode, node] = await Promise.all([
      this.nodeRepository.getInputLlmNode({ mapId, nodeId }),
      this.nodeRepository.getInputDataFrameNode({ mapId, nodeId }),
      this.nodeRepository.getNode({ mapId, nodeId }),
    ]);

    let visualizerOutputText = '';
    if (inputLlmNode && inputLlmNode.llmOutputJson) {
      visualizerOutputText = JSON.stringify(inputLlmNode.llmOutputJson);
    }
    if (inputDataFrameNode && inputDataFrameNode.dataFrameOutputJson) {
      visualizerOutputText = JSON.stringify(inputDataFrameNode.dataFrameOutputJson);
    }

    return this.prisma.node.update({
      where: { id: nodeId },
      data: { workspaceId, visualizerOutputText },
      select: { id: true, workspaceId: true, visualizerOutputText: true, updatedAt: true },
    });
  }
}
