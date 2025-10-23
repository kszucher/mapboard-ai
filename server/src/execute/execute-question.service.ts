import { injectable } from 'tsyringe';
import { NodeRepository } from '../map/node.repository';

@injectable()
export class ExecuteQuestionService {
  constructor(private nodeRepository: NodeRepository) {}

  async execute({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    const node = await this.nodeRepository.getNode({ mapId, nodeId });

    if (!node.questionOutputText) {
      throw new Error('no question');
    }
  }
}
