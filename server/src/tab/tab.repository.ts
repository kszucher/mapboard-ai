import { inject, injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class TabRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async addMapToTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.prisma.tab.update({
      where: {
        userId,
      },
      data: {
        mapIds: {
          push: mapId,
        },
      },
    });
  }

  async moveUpMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    const { id, mapIds } = await this.prisma.tab.findFirstOrThrow({
      where: { User: { id: userId } },
      select: { id: true, mapIds: true },
    });

    const i = mapIds.indexOf(mapId);
    if (i <= 0) return;

    [mapIds[i], mapIds[i - 1]] = [mapIds[i - 1], mapIds[i]];

    await this.prisma.tab.update({
      where: { id },
      data: { mapIds },
    });
  }

  async moveDownMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    const { id, mapIds } = await this.prisma.tab.findFirstOrThrow({
      where: { User: { id: userId } },
      select: { id: true, mapIds: true },
    });

    const i = mapIds.indexOf(mapId);
    if (i === -1 || i === mapIds.length - 1) return;

    [mapIds[i], mapIds[i + 1]] = [mapIds[i + 1], mapIds[i]];

    await this.prisma.tab.update({
      where: { id },
      data: { mapIds },
    });
  }

  async removeMapFromTab({ userId, mapId }: { userId: number; mapId: number }) {
    const tab = await this.prisma.tab.findUniqueOrThrow({
      where: { userId },
      select: { mapIds: true },
    });

    const updatedMapIds = tab.mapIds.filter(id => id !== mapId);

    await this.prisma.tab.update({
      where: { userId },
      data: {
        mapIds: {
          set: updatedMapIds,
        },
      },
    });
  }
}
