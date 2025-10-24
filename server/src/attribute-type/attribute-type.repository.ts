import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class AttributeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async getAttributeTypes() {
    return this.prisma.attributeType.findMany({
      select: {
        id: true,
        label: true,
        isInput: true,
        isString: true,
        isNumber: true,
        isEnum: true,
        defaultString: true,
        defaultNumber: true,
        defaultEnum: true,
      },
    });
  }

  async insertAttributeType({ nodeId }: { nodeId: number }) {}

  async deleteAttributeType({ attributeTypeId }: { attributeTypeId: number }) {}
}
