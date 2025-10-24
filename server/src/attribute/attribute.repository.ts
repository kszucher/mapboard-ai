import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class AttributeRepository {
  constructor(private prisma: PrismaClient) {}

  async getAttributes() {
    return this.prisma.attribute.findMany({
      select: {
        id: true,
        value: true,
      },
    });
  }

  async insertAttribute({ nodeId }: { nodeId: number }) {}

  async deleteAttribute({ attributeId }: { attributeId: number }) {}
}
