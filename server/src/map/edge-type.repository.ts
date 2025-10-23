import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class EdgeTypeRepository {
  constructor(private prisma: PrismaClient) {}

  async getEdgeType() {
    return this.prisma.edgeType.findMany({
      select: {
        id: true,
        FromNodeConfig: {
          select: {
            id: true,
            type: true,
          },
        },
        ToNodeConfig: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });
  }

  async getEdgeTypeFromNodeTypes({
    fromNodeConfigId,
    toNodeConfigId,
  }: {
    fromNodeConfigId: number;
    toNodeConfigId: number;
  }) {
    return this.prisma.edgeType.findFirstOrThrow({
      where: { fromNodeConfigId, toNodeConfigId },
      select: { id: true },
    });
  }

  async createEdgeType({ fromNodeConfigId, toNodeConfigId }: { fromNodeConfigId: number; toNodeConfigId: number }) {
    return this.prisma.edgeType.create({
      data: { fromNodeConfigId, toNodeConfigId },
    });
  }

  async removeEdgeType() {}
}
