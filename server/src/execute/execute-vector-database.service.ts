import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { NodeRepository } from '../map/node.repository';

@injectable()
export class ExecuteVectorDatabaseService {
  constructor(
    private prisma: PrismaClient,
    private nodeRepository: NodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    const [inputIngestionNodes, inputContextNode, inputQuestionNode, node] = await Promise.all([
      this.nodeRepository.getInputIngestionNodes({ mapId, nodeId }),
      this.nodeRepository.getInputContextNode({ mapId, nodeId }),
      this.nodeRepository.getInputQuestionNode({ mapId, nodeId }),
      this.nodeRepository.getNode({ mapId, nodeId }),
    ]);

    if (node.vectorDatabaseId) {
      throw new Error(node.fileName + ' already processed vector database');
    }

    // TODO

    await this.prisma.node.update({
      where: { id: nodeId },
      data: {
        workspaceId,
        vectorDatabaseId: undefined, // TODO
        vectorDatabaseOutputText: undefined, // TODO
      },
    });
  }
}
