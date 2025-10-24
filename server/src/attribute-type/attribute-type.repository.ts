import { injectable } from 'tsyringe';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class AttributeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async getAttributeTypes() {
    return this.prisma.attributeType.findMany({
      select: {
        id: true,
        nodeTypeId: true,
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

  async insertAttributeType(attributeType: Prisma.AttributeTypeUncheckedCreateInput) {
    return this.prisma.attributeType.create({
      data: attributeType,
    });
  }

  async deleteAttributeType({ attributeTypeId }: { attributeTypeId: number }) {}
}
