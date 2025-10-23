import { injectable } from 'tsyringe';
import { PrismaClient } from 'prisma-client-6fdbe46ec273ecc1c71dc3adefa9f5de2d6423216469e46986ca6034cc2c56f0';

@injectable()
export class EdgeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async getEdgeType() {
    return this.prisma.edgeType.findMany({
      select: {
        id: true,
        fromNodeTypeId: true,
        toNodeTypeId: true,
      },
    });
  }

  async getEdgeTypeFromNodeTypes({ fromNodeTypeId, toNodeTypeId }: { fromNodeTypeId: number; toNodeTypeId: number }) {
    return this.prisma.edgeType.findFirstOrThrow({
      where: { fromNodeTypeId, toNodeTypeId },
      select: { id: true },
    });
  }

  async createEdgeType({ fromNodeTypeId, toNodeTypeId }: { fromNodeTypeId: number; toNodeTypeId: number }) {
    return this.prisma.edgeType.create({
      data: { fromNodeTypeId, toNodeTypeId },
    });
  }

  async removeEdgeType() {}
}
