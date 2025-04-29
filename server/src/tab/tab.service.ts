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

  async addTabToUser({ userId }: { userId: number }) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        Tab: {
          connectOrCreate: {
            where: { userId },
            create: {
              mapIds: [],
            },
          },
        },
      },
    });
  }

  async addMapToTab({ userId, mapId }: { userId: number, mapId: number }) {
    await this.prisma.tab.updateMany({
      where: {
        userId: userId,
        NOT: {
          mapIds: {
            has: mapId,
          },
        },
      },
      data: {
        mapIds: {
          push: mapId,
        },
      },
    });
  }

  async deleteMapFromTab({ userId, mapId }: { userId: number, mapId: number }) {
    const tab = await this.prisma.tab.findUnique({
      where: { userId },
      select: { mapIds: true },
    });

    if (!tab) {
      throw new Error(`Tab not found for userId: ${userId}`);
    }

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
