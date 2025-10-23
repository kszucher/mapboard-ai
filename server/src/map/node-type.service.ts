import { injectable } from 'tsyringe';
import { NodeTypeRepository } from './node-type.repository';

@injectable()
export class NodeTypeService {
  constructor(private nodeTypeRepository: NodeTypeRepository) {}

  async getNodeType() {
    return this.nodeTypeRepository.getNodeType();
  }

  async createNodeType() {
    return this.nodeTypeRepository.createNodeType();
  }

  async removeNodeType() {
    return this.nodeTypeRepository.removeNodeType();
  }
}
