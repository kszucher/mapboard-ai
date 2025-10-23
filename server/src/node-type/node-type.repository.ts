import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class NodeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async getNodeType() {
    return this.prisma.nodeType.findMany({
      select: {
        id: true,
        w: true,
        h: true,
        color: true,
        label: true,
        AttributeTypes: {
          select: {
            id: true,
            label: true,
            defaultString: true,
            defaultNumber: true,
            defaultEnum: true,
          },
        },
      },
    });
  }

  async createNodeType() {
    // TODO
  }

  async removeNodeType() {}
}
