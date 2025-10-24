import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class AttributeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async insertAttributeType({ nodeId }: { nodeId: number }) {}

  async deleteAttributeType({ attributeTypeId }: { attributeTypeId: number }) {}
}
