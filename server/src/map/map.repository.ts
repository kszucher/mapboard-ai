import { injectable } from 'tsyringe';
import { MapInfo } from '../../../shared/src/api/api-types-map';
import { Prisma, PrismaClient } from '../generated/client';

@injectable()
export class MapRepository {
  constructor(private prisma: PrismaClient) {}

  async getMapinfo({ mapId }: { mapId: number }): Promise<MapInfo> {
    const map = await this.prisma.map.findUniqueOrThrow({
      where: { id: mapId },
      select: {
        id: true,
        name: true,
        MapLinks: true,
        MapNodes: true,
      },
    });

    const [mapNodes, mapLinks] = await Promise.all([
      this.prisma.mapNode.findMany({ where: { mapId: mapId }, omit: { createdAt: true, updatedAt: true } }),
      this.prisma.mapLink.findMany({ where: { mapId: mapId }, omit: { createdAt: true, updatedAt: true } }),
    ]);

    return {
      id: map.id,
      name: map.name,
      data: { n: mapNodes, l: mapLinks },
    };
  }

  async getLastMapOfUser({ userId }: { userId: number }): Promise<{ id: number }> {
    return this.prisma.map.findFirstOrThrow({
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
      select: { offsetW: true, offsetH: true },
    });

    await this.prisma.mapNode.updateMany({
      where: { mapId },
      data: {
        offsetW: { decrement: Math.min(...mapNodes.map(node => node.offsetW)) },
        offsetH: { decrement: Math.min(...mapNodes.map(node => node.offsetH)) },
      },
    });
  }

  async renameMap({ mapId, mapName }: { mapId: number; mapName: string }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: { name: mapName },
    });
  }

  async updateOpenCount({ mapId }: { mapId: number }) {
    await this.prisma.map.update({
      where: { id: mapId },
      data: {
        openCount: {
          increment: 1,
        },
      },
    });
  }

  async terminateProcesses() {
    await this.prisma.mapNode.updateMany({ data: { isProcessing: false } });
  }
}
