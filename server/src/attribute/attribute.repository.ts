import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class AttributeRepository {
  constructor(private prisma: PrismaClient) {}

  async insertAttribute({ nodeId }: { nodeId: number }) {}

  async deleteAttribute({ attributeId }: { attributeId: number }) {}
}
