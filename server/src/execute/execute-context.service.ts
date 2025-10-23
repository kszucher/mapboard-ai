import { injectable } from 'tsyringe';
import { NodeRepository } from '../map/node.repository';

@injectable()
export class ExecuteContextService {
  constructor(private nodeRepository: NodeRepository) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.nodeRepository.getNode({ mapId, nodeId });

    if (!node.contextOutputText) {
      throw new Error('no context');
    }
  }
}
