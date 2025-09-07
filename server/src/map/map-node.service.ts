import { ControlType } from '../../../shared/src/map/state/map-consts-and-types';
import { PrismaClient } from '../generated/client';

export class MapNodeService {
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
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
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
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        ingestionOutputJson: true,
      },
    });
  }

  async getInputContextNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.CONTEXT,
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        contextOutputText: true,
      },
    });
  }

  async getInputQuestionNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.QUESTION,
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        questionOutputText: true,
      },
    });
  }

  async getInputVectorDatabaseNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.VECTOR_DATABASE,
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
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
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        dataFrameOutputText: true,
      },
    });
  }

  async getInputLlmNode({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.mapNode.findFirst({
      where: {
        mapId,
        controlType: ControlType.LLM,
        FromLinks: {
          some: {
            toNodeId: nodeId,
          },
        },
      },
      select: {
        llmInstructions: true,
        llmOutputSchema: true,
        llmOutputJson: true,
      },
    });
  }
}
