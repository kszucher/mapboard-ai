import { inject, injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeContextService {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
    private mapNodeService: MapNodeRepository
  ) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.mapNodeService.getNode({ mapId, nodeId });

    if (!node.contextOutputText) {
      throw new Error('no context');
    }
  }
}
