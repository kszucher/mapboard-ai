import { injectable } from 'tsyringe';
import { MapNodeRepository } from './map-node.repository';

@injectable()
export class MapNodeQuestionService {
  constructor(private mapNodeService: MapNodeRepository) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.mapNodeService.getNode({ mapId, nodeId });

    if (!node.questionOutputText) {
      throw new Error('no question');
    }
  }
}
