import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class MapConfigRepository {
  constructor(private prisma: PrismaClient) {}

  async getMapNodeConfig() {
    return this.prisma.mapNodeConfig.findMany({
      select: {
        id: true,
        w: true,
        h: true,
        type: true,
        color: true,
        label: true,
        mapNodeFields: true,
      },
    });
  }

  async getMapEdgeConfig() {
    return this.prisma.mapEdgeConfig.findMany({
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

  async createMapNodeConfig() {}

  async createMapEdgeConfig({
    fromNodeConfigId,
    toNodeConfigId,
  }: {
    fromNodeConfigId: number;
    toNodeConfigId: number;
  }) {
    return this.prisma.mapEdgeConfig.create({
      data: {
        fromNodeConfigId,
        toNodeConfigId,
      },
    });
  }

  async removeMapNodeConfig() {}

  async removeMapEdgeConfig() {}
}
