import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { NodeRepository } from '../map/node.repository';

@injectable()
export class ExecuteIngestionService {
  constructor(
    private prisma: PrismaClient,
    private nodeRepository: NodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    const [inputFileNode, node] = await Promise.all([
      this.nodeRepository.getInputFileNode({ mapId, nodeId }),
      this.nodeRepository.getNode({ mapId, nodeId }),
    ]);

    if (node.ingestionOutputJson) {
      console.log(node.fileName + ' already processed ingestion');
      return;
    }

    if (!inputFileNode || !inputFileNode.fileHash) {
      throw new Error('no input file hash');
    }

    // TODO load file from file hash

    const ingestionOutputJson = {}; // TODO use MASTRA document parser

    if (!ingestionOutputJson) {
      throw new Error('failed to ingest file');
    }

    await this.prisma.node.update({
      where: { id: nodeId },
      data: {
        workspaceId,
        ingestionOutputJson: {}, // TODO
      },
    });
  }
}
