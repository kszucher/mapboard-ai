import { injectable } from 'tsyringe';
import { EdgeTypeRepository } from './edge-type.repository';

@injectable()
export class EdgeTypeService {
  constructor(private edgeTypeRepository: EdgeTypeRepository) {}

  async getEdgeType() {
    return this.edgeTypeRepository.getEdgeType();
  }

  async createEdgeType({ fromNodeTypeId, toNodeTypeId }: { fromNodeTypeId: number; toNodeTypeId: number }) {
    return this.edgeTypeRepository.createEdgeType({ fromNodeTypeId, toNodeTypeId });
  }

  async removeEdgeType() {
    return this.edgeTypeRepository.removeEdgeType();
  }
}
