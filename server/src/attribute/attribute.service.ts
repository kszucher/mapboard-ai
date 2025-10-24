import { injectable } from 'tsyringe';
import { AttributeRepository } from './attribute.repository';

@injectable()
export class AttributeService {
  constructor(private attributeRepository: AttributeRepository) {}

  async insertAttribute({ nodeId }: { nodeId: number }) {}

  async deleteAttribute({ attributeId }: { attributeId: number }) {}
}
