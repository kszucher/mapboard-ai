import { TabInfo } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class TabService {
  constructor(
    private prisma: PrismaClient,
  ) {
  }

  async readTab({ userId }: { userId: number }): Promise<TabInfo> {
    const tab = await this.prisma.tab.findFirstOrThrow({
      where: { User: { id: userId } },
      select: {
        mapIds: true,
      },
    });

    const tabMaps = await this.prisma.map.findMany({
      where: { id: { in: tab.mapIds } },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      tabMapIdList: tabMaps.map(el => el.id),
      tabMapNameList: tabMaps.map(el => el.name),
    };
  }

  async addMapToTab({ userId, mapId }: { userId: number, mapId: number }): Promise<void> {
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
      select: {
        id: true,
      },
    });
  }
}
