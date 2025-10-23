import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class MapEdgeConfigRepository {
  constructor(private prisma: PrismaClient) {}

  async getEdgeConfigFromNodeConfigs({
    fromNodeConfigId,
    toNodeConfigId,
  }: {
    fromNodeConfigId: number;
    toNodeConfigId: number;
  }) {
    return this.prisma.mapEdgeConfig.findFirstOrThrow({
      where: {
        fromNodeConfigId,
        toNodeConfigId,
      },
      select: { id: true },
    });
  }
}
