import { PrismaClient } from '../generated/client';
import { MapNodeService } from './map-node.service';

export class MapNodeQuestionService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.getMapNodeService().getNode({ mapId, nodeId });

    if (!node.questionOutputText) {
      throw new Error('no question');
    }
  }
}
