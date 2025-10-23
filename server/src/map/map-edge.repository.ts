import { injectable } from 'tsyringe';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class MapEdgeRepository {
  constructor(private prisma: PrismaClient) {}

  private mapEdgeInclude = (<T extends Prisma.MapEdgeInclude>(obj: T) => obj)({
    FromNode: {
      select: {
        id: true,
        offsetX: true,
        offsetY: true,
        MapNodeConfig: {
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
        MapNodeConfig: {
          select: {
            id: true,
          },
        },
      },
    },
  });

  async getEdges({ mapId }: { mapId: number }) {
    return this.prisma.mapEdge.findMany({
      where: { mapId },
      include: this.mapEdgeInclude,
      omit: { createdAt: true },
    });
  }

  async getEdgesForSorting({ mapId }: { mapId: number }) {
    return this.prisma.mapEdge.findMany({
      where: { mapId },
      select: { fromNodeId: true, toNodeId: true },
    });
  }

  async getEdgesOfNode({ nodeId }: { nodeId: number }) {
    return this.prisma.mapEdge.findMany({
      where: { OR: [{ fromNodeId: nodeId }, { toNodeId: nodeId }] },
      select: { id: true, workspaceId: true, updatedAt: true },
    });
  }

  async copyEdges({ mapId }: { mapId: number }) {
    return this.prisma.mapEdge.findMany({
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
    mapEdgeConfigId,
  }: {
    mapId: number;
    fromNodeId: number;
    toNodeId: number;
    mapEdgeConfigId: number;
  }) {
    return this.prisma.mapEdge.create({
      data: { mapId, fromNodeId, toNodeId, mapEdgeConfigId },
      include: this.mapEdgeInclude,
      omit: { createdAt: true },
    });
  }

  async createEdges({ mapId, edges }: { mapId: number; edges: Prisma.MapEdgeUncheckedCreateInput[] }) {
    return this.prisma.mapEdge.createManyAndReturn({
      data: edges.map(e => ({
        ...e,
        mapId,
      })),
      select: { id: true },
    });
  }

  async deleteEdge({ edgeId }: { edgeId: number }) {
    await this.prisma.mapEdge.delete({
      where: { id: edgeId },
    });
  }

  async deleteEdges({ edgeIds }: { edgeIds: number[] }) {
    await this.prisma.mapEdge.deleteMany({
      where: {
        id: { in: edgeIds },
      },
    });
  }

  async deleteMapEdges({ mapId }: { mapId: number }) {
    await this.prisma.mapEdge.deleteMany({ where: { mapId } });
  }
}
