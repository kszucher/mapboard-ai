import { injectable } from 'tsyringe';
import { NodeUpdateUp } from '../../../shared/src/api/api-types-node';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class NodeRepository {
  constructor(private prisma: PrismaClient) {}

  private nodeInclude = (<T extends Prisma.NodeInclude>(obj: T) => obj)({
    FromEdges: { select: { ToNode: { select: { NodeType: { select: { id: true, color: true } } } } } },
    ToEdges: { select: { FromNode: { select: { NodeType: { select: { id: true, color: true } } } } } },
    NodeType: {
      include: {
        MapEdgeConfigFrom: { select: { ToNodeType: { select: { id: true, color: true } } } },
        MapEdgeConfigTo: { select: { FromNodeType: { select: { id: true, color: true } } } },
      },
    },
  });

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
      include: this.nodeInclude,
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
            type: true,
          },
        },
      },
    });
  }

  async getNodeMapConfig({ nodeId }: { nodeId: number }) {
    return this.prisma.node.findFirstOrThrow({
      where: { id: nodeId },
      select: { NodeType: { select: { id: true } } },
    });
  }

  async copyNodes({ mapId }: { mapId: number }) {
    return this.prisma.node.findMany({
      where: { mapId },
      omit: {
        mapId: true,
        ingestionOutputJson: true,
        dataFrameOutputJson: true,
        llmOutputJson: true,
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
        ingestionOutputJson: Prisma.JsonNull,
        vectorDatabaseId: null,
        vectorDatabaseOutputText: null,
        dataFrameOutputJson: Prisma.JsonNull,
        llmOutputJson: Prisma.JsonNull,
        visualizerOutputText: null,
      },
      select: {
        id: true,
        workspaceId: true,
        ingestionOutputJson: true,
        vectorDatabaseId: true,
        vectorDatabaseOutputText: true,
        dataFrameOutputJson: true,
        llmOutputJson: true,
        visualizerOutputText: true,
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
      include: this.nodeInclude,
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

  // the following will be deprecated!!!
  async getInputFileNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'FILE' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        fileHash: true,
        fileName: true,
      },
    });
  }

  async getInputIngestionNodes({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findMany({
      where: {
        mapId,
        NodeType: { type: 'INGESTION' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        ingestionOutputJson: true,
      },
    });
  }

  async getInputContextNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'CONTEXT' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        contextOutputText: true,
      },
    });
  }

  async getInputQuestionNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'QUESTION' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        questionOutputText: true,
      },
    });
  }

  async getInputVectorDatabaseNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'VECTOR_DATABASE' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        vectorDatabaseId: true,
        vectorDatabaseOutputText: true,
      },
    });
  }

  async getInputDataFrameNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'DATA_FRAME' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        dataFrameOutputJson: true,
      },
    });
  }

  async getInputLlmNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.node.findFirst({
      where: {
        mapId,
        NodeType: { type: 'LLM' },
        FromEdges: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        iid: true,
        llmInstructions: true,
        llmOutputSchema: true,
        llmOutputJson: true,
      },
    });
  }
}
