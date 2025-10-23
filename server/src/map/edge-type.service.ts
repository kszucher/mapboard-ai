import { injectable } from 'tsyringe';
import { EdgeTypeRepository } from './edge-type.repository';

@injectable()
export class EdgeTypeService {
  constructor(private edgeTypeRepository: EdgeTypeRepository) {}

  async getEdgeType() {
    return this.edgeTypeRepository.getEdgeType();
  }

  async createEdgeType({ fromNodeConfigId, toNodeConfigId }: { fromNodeConfigId: number; toNodeConfigId: number }) {
    return this.edgeTypeRepository.createEdgeType({ fromNodeConfigId, toNodeConfigId });
  }

  async removeEdgeType() {
    return this.edgeTypeRepository.removeEdgeType();
  }
}
