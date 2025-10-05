import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeIngestionService {
  constructor(
    private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository
  ) {}

  async execute({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    const [inputFileNode, node] = await Promise.all([
      this.mapNodeService.getInputFileNode({ mapId, nodeId }),
      this.mapNodeService.getNode({ mapId, nodeId }),
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

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        workspaceId,
        ingestionOutputJson: {}, // TODO
      },
    });
  }
}
