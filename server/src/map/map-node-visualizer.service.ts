import { PrismaClient } from '../generated/client';
import { MapNodeService } from './map-node.service';

export class MapNodeVisualizerService {
  constructor(
    private prisma: PrismaClient,
    private getMapNodeService: () => MapNodeService
  ) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    // TODO save the result!
  }
}
