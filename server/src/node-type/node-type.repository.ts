import { injectable } from 'tsyringe';
import { PrismaClient } from 'prisma-client-6fdbe46ec273ecc1c71dc3adefa9f5de2d6423216469e46986ca6034cc2c56f0';

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
            type: true,
            label: true,
            selectOptions: true,
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
