import { injectable } from 'tsyringe';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeContextService {
  constructor(private mapNodeService: MapNodeRepository) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.mapNodeService.getNode({ mapId, nodeId });

    if (!node.contextOutputText) {
      throw new Error('no context');
    }
  }
}
