import { injectable } from 'tsyringe';
import { ControlType, LlmOutputSchema } from '../../../shared/src/api/api-types-map-node';
import { getLastIndexN, getMapSelfH, getMapSelfW } from '../../../shared/src/map/map-getters';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class MapRepository {
  constructor(private prisma: PrismaClient) {}

  async getMapsById({ mapIds }: { mapIds: number[] }) {
    return this.prisma.map.findMany({
      where: { id: { in: mapIds } },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getMapWithGraph({ mapId }: { mapId: number }) {
    return this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: {
        id: true,
        userId: true,
        name: true,
        MapNodes: {
          omit: { createdAt: true },
        },
        MapLinks: {
          omit: { createdAt: true },
        },
      },
    });
  }

  async getMapWithGraphStructure({ mapId }: { mapId: number }) {
    return this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: {
        id: true,
        MapNodes: {
          select: { id: true, controlType: true },
        },
        MapLinks: {
          select: { id: true, fromNodeId: true, toNodeId: true },
        },
      },
    });
  }

  async getLastMapOfUser({ userId }: { userId: number }) {
    return this.prisma.map.findFirst({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true },
    });
  }

  async createMap({ userId, mapName }: { userId: number; mapName: string }) {
    return this.prisma.map.create({
      data: {
        userId,
        name: mapName,
      },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    });
  }

  async createMapDuplicate({ userId, mapId }: { userId: number; mapId: number }) {
    const originalMap = await this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: {
        name: true,
        MapNodes: {
          omit: {
            mapId: true,
            ingestionOutputJson: true,
            dataFrameOutputJson: true,
            llmOutputJson: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        MapLinks: {
          omit: {
            mapId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const newMap = await this.prisma.map.create({
      data: { name: originalMap.name + ' (Copy)', userId },
      select: { id: true },
    });

    const newMapNodes = await this.prisma.mapNode.createManyAndReturn({
      data: originalMap.MapNodes.map(({ id, ...rest }) => ({ ...rest, mapId: newMap.id })),
      select: { id: true },
    });

    const idMap = new Map(originalMap.MapNodes.map((n, i) => [n.id, newMapNodes[i].id]));

    await this.prisma.mapLink.createMany({
      data: originalMap.MapLinks.map(({ id, fromNodeId, toNodeId, ...rest }) => ({
        ...rest,
        mapId: newMap.id,
        fromNodeId: idMap.get(fromNodeId)!,
        toNodeId: idMap.get(toNodeId)!,
      })),
    });

    return newMap;
  }

  async insertNode({ mapId, controlType }: { mapId: number; controlType: ControlType }) {
    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({
        where: { mapId },
        select: { iid: true, controlType: true, offsetX: true, offsetY: true },
      }),
      this.prisma.mapLink.findMany({
        where: { mapId },
        select: { id: true, fromNodeId: true, toNodeId: true },
      }),
    ]);

    const m = { n: mapNodes, l: mapLinks };

    return this.prisma.mapNode.create({
      data: {
        mapId,
        iid: getLastIndexN(m) + 1,
        controlType,
        ...(controlType === ControlType.LLM && { llmOutputSchema: LlmOutputSchema.TEXT }),
        offsetX: getMapSelfW(m),
        offsetY: getMapSelfH(m),
      },
    });
  }

  async setProcessing({ workspaceId, mapId, nodeId }: { workspaceId: number; mapId: number; nodeId: number }) {
    return this.prisma.$transaction([
      this.prisma.mapNode.update({
        where: { id: nodeId },
        data: { workspaceId, isProcessing: true },
        select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
      }),
      this.prisma.mapNode.updateManyAndReturn({
        where: { id: { not: nodeId }, mapId },
        data: { workspaceId, isProcessing: false },
        select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
      }),
    ]);
  }

  async clearProcessing({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    return this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: { workspaceId, isProcessing: false },
      select: { id: true, workspaceId: true, isProcessing: true, updatedAt: true },
    });
  }

  async clearResults({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    return this.prisma.mapNode.updateManyAndReturn({
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
    const mapNodes = await this.prisma.mapNode.findMany({
      where: { mapId },
      select: { offsetX: true, offsetY: true },
    });

    return this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: {
        workspaceId,
        offsetX: { decrement: Math.min(...mapNodes.map(node => node.offsetX)) },
        offsetY: { decrement: Math.min(...mapNodes.map(node => node.offsetY)) },
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

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
    });
  }

  async incrementOpenCount({ mapId }: { mapId: number }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: {
        openCount: {
          increment: 1,
        },
      },
    });
  }

  async clearProcessingAll() {
    await this.prisma.mapNode.updateMany({ data: { workspaceId: null, isProcessing: false } });
  }

  async deleteMap({ mapId }: { mapId: number }) {
    await this.prisma.mapLink.deleteMany({ where: { mapId } });
    await this.prisma.mapNode.deleteMany({ where: { mapId } });
    await this.prisma.map.delete({ where: { id: mapId } });
  }
}
