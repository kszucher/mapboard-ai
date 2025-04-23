import { PrismaClient } from '../generated/client';

export class TabService {
  constructor(
    private prisma: PrismaClient,
  ) {
  }

  async readTab({ userId }: { userId: number }) {
    const tab = await this.prisma.tab.findFirstOrThrow({
      where: { User: { id: userId } },
      select: {
        mapIds: true,
      },
    });

    return this.prisma.map.findMany({
      where: { id: { in: tab.mapIds } },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async addMapToTab({ userId, mapId }: { userId: number, mapId: number }) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        Tab: {
          update: {
            mapIds: {
              push: mapId,
            },
          },
        },
      },
    });
  }
}
