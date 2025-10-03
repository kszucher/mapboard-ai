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
          omit: { createdAt: true, updatedAt: true },
        },
        MapLinks: {
          omit: { createdAt: true, updatedAt: true },
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
      select: { name: true },
    });

    const originalMapNodes = await this.prisma.mapNode.findMany({ where: { mapId } });
    const originalMapLinks = await this.prisma.mapLink.findMany({ where: { mapId } });

    const newMap = await this.prisma.map.create({
      data: {
        name: originalMap.name + ' (Copy)',
        userId,
      },
      select: { id: true },
    });

    const newMapNodes = await this.prisma.mapNode.createManyAndReturn({
      data: originalMapNodes.map(({ id, mapId, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        mapId: newMap.id,
        ingestionOutputJson: rest.ingestionOutputJson ?? Prisma.JsonNull,
        dataFrameOutputJson: rest.dataFrameOutputJson ?? Prisma.JsonNull,
        llmOutputJson: rest.llmOutputJson ?? Prisma.JsonNull,
      })),
      select: {
        id: true,
      },
    });

    const idMap = new Map(originalMapNodes.map((n, i) => [n.id, newMapNodes[i].id]));

    await this.prisma.mapLink.createMany({
      data: originalMapLinks.map(({ id, mapId, fromNodeId, toNodeId, createdAt, updatedAt, ...rest }) => ({
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

  async setProcessing({ mapId, nodeId }: { mapId: number; nodeId: number }) {
    return this.prisma.$transaction([
      this.prisma.mapNode.update({
        where: { id: nodeId },
        data: { isProcessing: true },
        select: { id: true, isProcessing: true },
      }),
      this.prisma.mapNode.updateManyAndReturn({
        where: { id: { not: nodeId }, mapId },
        data: { isProcessing: false },
        select: { id: true, isProcessing: true },
      }),
    ]);
  }

  async clearProcessing({ mapId }: { mapId: number }) {
    return this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: { isProcessing: false },
      select: { id: true, isProcessing: true },
    });
  }

  async clearResults({ mapId }: { mapId: number }) {
    return this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: {
        ingestionOutputJson: Prisma.JsonNull,
        vectorDatabaseId: null,
        vectorDatabaseOutputText: null,
        dataFrameOutputJson: Prisma.JsonNull,
        llmOutputJson: Prisma.JsonNull,
        visualizerOutputText: null,
      },
      select: {
        id: true,
        ingestionOutputJson: true,
        vectorDatabaseId: true,
        vectorDatabaseOutputText: true,
        dataFrameOutputJson: true,
        llmOutputJson: true,
        visualizerOutputText: true,
      },
    });
  }

  async align({ mapId }: { mapId: number }) {
    const mapNodes = await this.prisma.mapNode.findMany({
      where: { mapId },
      select: { offsetX: true, offsetY: true },
    });

    return this.prisma.mapNode.updateManyAndReturn({
      where: { mapId },
      data: {
        offsetX: { decrement: Math.min(...mapNodes.map(node => node.offsetX)) },
        offsetY: { decrement: Math.min(...mapNodes.map(node => node.offsetY)) },
      },
      select: {
        id: true,
        offsetX: true,
        offsetY: true,
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
    await this.prisma.mapNode.updateMany({ data: { isProcessing: false } });
  }
}
