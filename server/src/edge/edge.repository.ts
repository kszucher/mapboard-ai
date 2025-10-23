import { injectable } from 'tsyringe';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class EdgeRepository {
  constructor(private prisma: PrismaClient) {}

  private edgeInclude = (<T extends Prisma.EdgeInclude>(obj: T) => obj)({
    FromNode: {
      select: {
        id: true,
        offsetX: true,
        offsetY: true,
        NodeType: {
          select: {
            id: true,
          },
        },
      },
    },
    ToNode: {
      select: {
        id: true,
        offsetX: true,
        offsetY: true,
        NodeType: {
          select: {
            id: true,
          },
        },
      },
    },
  });

  async getEdges({ mapId }: { mapId: number }) {
    return this.prisma.edge.findMany({
      where: { mapId },
      include: this.edgeInclude,
      omit: { createdAt: true },
    });
  }

  async getEdgesForSorting({ mapId }: { mapId: number }) {
    return this.prisma.edge.findMany({
      where: { mapId },
      select: { fromNodeId: true, toNodeId: true },
    });
  }

  async getEdgesOfNode({ nodeId }: { nodeId: number }) {
    return this.prisma.edge.findMany({
      where: { OR: [{ fromNodeId: nodeId }, { toNodeId: nodeId }] },
      select: { id: true, workspaceId: true, updatedAt: true },
    });
  }

  async copyEdges({ mapId }: { mapId: number }) {
    return this.prisma.edge.findMany({
      where: { mapId },
      omit: {
        mapId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createEdge({
    mapId,
    fromNodeId,
    toNodeId,
    edgeTypeId,
  }: {
    mapId: number;
    fromNodeId: number;
    toNodeId: number;
    edgeTypeId: number;
  }) {
    return this.prisma.edge.create({
      data: { mapId, fromNodeId, toNodeId, edgeTypeId },
      include: this.edgeInclude,
      omit: { createdAt: true },
    });
  }

  async createEdges({ mapId, edges }: { mapId: number; edges: Prisma.EdgeUncheckedCreateInput[] }) {
    return this.prisma.edge.createManyAndReturn({
      data: edges.map(e => ({
        ...e,
        mapId,
      })),
      select: { id: true },
    });
  }

  async deleteEdge({ edgeId }: { edgeId: number }) {
    await this.prisma.edge.delete({
      where: { id: edgeId },
    });
  }

  async deleteEdges({ edgeIds }: { edgeIds: number[] }) {
    await this.prisma.edge.deleteMany({
      where: { id: { in: edgeIds } },
    });
  }

  async deleteEdgesOfMap({ mapId }: { mapId: number }) {
    await this.prisma.edge.deleteMany({ where: { mapId } });
  }
}
