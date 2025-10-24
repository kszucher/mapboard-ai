import { injectable } from 'tsyringe';
import { AttributeTypeRepository } from './attribute-type.repository';
import { Prisma } from '../generated/client';

@injectable()
export class AttributeTypeService {
  constructor(private attributeTypeRepository: AttributeTypeRepository) {}

  async getAttributeTypeInfo() {
    return this.attributeTypeRepository.getAttributeTypes();
  }

  async insertAttributeType(attributeType: Prisma.AttributeTypeUncheckedCreateInput) {
    console.log('to create:');
    console.log(attributeType);
  }

  async deleteAttributeType({ attributeTypeId }: { attributeTypeId: number }) {}
}
