import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { WorkspaceService } from '../workspace/workspace.service';

export class TabService {
  constructor(
    private prisma: PrismaClient,
    private getWorkspaceService: () => WorkspaceService,
    private getDistributionService: () => DistributionService,
  ) {
  }

  get workspaceService() {
    return this.getWorkspaceService();
  }

  get distributionService() {
    return this.getDistributionService();
  }

  async getMapsOfTab({ userId }: { userId: number }) {
    const tab = await this.prisma.tab.findFirstOrThrow({
      where: { User: { id: userId } },
      select: {
        mapIds: true,
      },
    });

    const maps = await this.prisma.map.findMany({
      where: { id: { in: tab.mapIds } },
      select: {
        id: true,
        name: true,
      },
    });

    const idToMap = new Map(maps.map(map => [map.id, map]));

    return tab.mapIds.map(id => {
      const map = idToMap.get(id);
      if (!map) {
        throw new Error(`Map with id ${id} not found`);
      }
      return map;
    });
  }

  async moveUpMapInTab({ userId, mapId }: { userId: number, mapId: number }) {
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

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser, {
      type: WORKSPACE_EVENT.TAB_UPDATED,
      payload: {},
    });
  }

  async moveDownMapInTab({ userId, mapId }: { userId: number, mapId: number }) {
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

    const workspaceIdsOfUser = await this.workspaceService.getWorkspaceIdOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser, {
      type: WORKSPACE_EVENT.TAB_UPDATED,
      payload: {},
    });
  }

  async addTabToUserIfNotAdded({ userId }: { userId: number }) {
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

  async addMapToTabIfNotAdded({ userId, mapId }: { userId: number, mapId: number }) {
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

  async removeMapFromTab({ userId, mapId }: { userId: number, mapId: number }) {
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
