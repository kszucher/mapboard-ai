import { injectable } from 'tsyringe';
import { ControlType } from '../../../shared/src/api/api-types-map-node';
import { PrismaClient } from '../generated/client';

@injectable()
export class MapNodeRepository {
  constructor(private prisma: PrismaClient) {}

  async getNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirstOrThrow({
      where: {
        mapId,
        id: nodeId,
      },
    });
  }

  async getInputFileNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.FILE,
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
    return this.prisma.mapNode.findMany({
      where: {
        mapId,
        controlType: ControlType.INGESTION,
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
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.CONTEXT,
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
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.QUESTION,
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
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.VECTOR_DATABASE,
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
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.DATA_FRAME,
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
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.LLM,
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
