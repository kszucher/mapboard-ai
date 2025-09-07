import { PrismaClient } from '../generated/client';
import { MapNodeService } from './map-node.service';

export class MapNodeVectorDatabaseService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  get mapNodeService(): MapNodeService {
    return this.getMapNodeService();
  }

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const [inputIngestionNodes, inputContextNode, inputQuestionNode, node] = await Promise.all([
      this.mapNodeService.getInputIngestionNodes({ mapId, nodeId }),
      this.mapNodeService.getInputContextNode({ mapId, nodeId }),
      this.mapNodeService.getInputQuestionNode({ mapId, nodeId }),
      this.mapNodeService.getNode({ mapId, nodeId }),
    ]);

    if (node.vectorDatabaseId) {
      throw new Error(node.fileName + ' already processed vector database');
    }

    // TODO

    await this.prisma.mapNode.update({
      where: { id: nodeId },
      data: {
        vectorDatabaseId: undefined, // TODO
        vectorDatabaseOutputText: undefined, // TODO
      },
    });
  }
}
