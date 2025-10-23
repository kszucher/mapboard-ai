import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

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
