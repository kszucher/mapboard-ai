import { injectable } from 'tsyringe';
import { NodeUpdateUp } from '../../../shared/src/api/api-types-node';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class NodeRepository {
  constructor(private prisma: PrismaClient) {}

  async getNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirstOrThrow({
      where: {
        mapId,
        id: nodeId,
      },
    });
  }

  async getNodes({ mapId }: { mapId: number }) {
    return this.prisma.node.findMany({
      where: { mapId },
      omit: { createdAt: true },
    });
  }

  async getNodesForSorting({ mapId }: { mapId: number }) {
    return this.prisma.node.findMany({
      where: { mapId },
      include: {
        NodeType: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async getNodeMapConfig({ nodeId }: { nodeId: number }) {
    return this.prisma.node.findFirstOrThrow({
      where: { id: nodeId },
      select: { nodeTypeId: true },
    });
  }

  async copyNodes({ mapId }: { mapId: number }) {
    return this.prisma.node.findMany({
      where: { mapId },
      omit: {
        mapId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateNode({ nodeId, workspaceId, params }: { nodeId: number; workspaceId: number; params: NodeUpdateUp }) {
    return this.prisma.node.update({
      where: { id: nodeId },
      data: { ...params, workspaceId },
    });
  }

  async setProcessing({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    return this.prisma.$transaction([
      this.prisma.node.update({
        where: { id: nodeId },
        data: { workspaceId, isProcessing: true },
        select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
      }),
      this.prisma.node.updateManyAndReturn({
        where: { id: { not: nodeId }, mapId },
        data: { workspaceId, isProcessing: false },
        select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
      }),
    ]);
  }

  async clearProcessing({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    return this.prisma.node.updateManyAndReturn({
      where: { mapId },
      data: { workspaceId, isProcessing: false },
      select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
    });
  }

  async clearProcessingAll() {
    await this.prisma.node.updateMany({ data: { workspaceId: null, isProcessing: false } });
  }

  async clearResults({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    return this.prisma.node.updateManyAndReturn({
      where: { mapId },
      data: {
        workspaceId,
      },
      select: {
        id: true,
        workspaceId: true,
        updatedAt: true,
      },
    });
  }

  async align({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    const nodes = await this.prisma.node.findMany({
      where: { mapId },
      select: { offsetX: true, offsetY: true },
    });

    return this.prisma.node.updateManyAndReturn({
      where: { mapId },
      data: {
        workspaceId,
        offsetX: { decrement: Math.min(...nodes.map(node => node.offsetX)) },
        offsetY: { decrement: Math.min(...nodes.map(node => node.offsetY)) },
      },
      select: {
        id: true,
        workspaceId: true,
        offsetX: true,
        offsetY: true,
        updatedAt: true,
      },
    });
  }

  async createNode({ mapId, nodeTypeId }: { mapId: number; nodeTypeId: number }) {
    const result = await this.prisma.node.aggregate({
      where: { mapId },
      _max: {
        iid: true,
        offsetX: true,
        offsetY: true,
      },
    });

    return this.prisma.node.create({
      data: {
        mapId,
        nodeTypeId,
        iid: (result._max.iid || 0) + 1,
        offsetX: (result._max.offsetX || 0) + 200,
        offsetY: (result._max.offsetY || 0) + 200,
      },
      omit: { createdAt: true },
    });
  }

  async createNodes({ mapId, nodes }: { mapId: number; nodes: Prisma.NodeUncheckedCreateInput[] }) {
    return this.prisma.node.createManyAndReturn({
      data: nodes.map(n => ({
        ...n,
        mapId,
      })),
      select: { id: true },
    });
  }

  async deleteNode({ nodeId }: { nodeId: number }) {
    await this.prisma.node.delete({
      where: { id: nodeId },
    });
  }

  async deleteNodesOfMap({ mapId }: { mapId: number }) {
    await this.prisma.node.deleteMany({ where: { mapId } });
  }
}
