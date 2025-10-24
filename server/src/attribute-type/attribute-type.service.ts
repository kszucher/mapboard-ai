import { injectable } from 'tsyringe';
import { AttributeTypeRepository } from './attribute-type.repository';

@injectable()
export class AttributeTypeService {
  constructor(private attributeTypeRepository: AttributeTypeRepository) {}

  async insertAttributeType({ nodeId }: { nodeId: number }) {}

  async deleteAttributeType({ attributeTypeId }: { attributeTypeId: number }) {}
}
