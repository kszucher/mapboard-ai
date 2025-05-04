import { PrismaClient } from '../generated/client';
import { MapService } from '../map/map.service';
import { TabService } from '../tab/tab.service';
import { UserService } from '../user/user.service';

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private getUserService: () => UserService,
    private getMapService: () => MapService,
    private getTabService: () => TabService,
  ) {
  }

  get userService(): UserService {
    return this.getUserService();
  }

  get mapService(): MapService {
    return this.getMapService();
  }

  get tabService(): TabService {
    return this.getTabService();
  }

  async getWorkspaceIdsOfUser({ userId }: { userId: number }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { User: { id: userId } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async getWorkspaceIdsOfMap({ mapId }: { mapId: number }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { Map: { id: mapId } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async getWorkspaceIdsOfUserAndMap({ userId, mapId }: { userId: number, mapId: number }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { User: { id: userId }, Map: { id: mapId } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async createWorkspace({ userId }: { userId: number }) {
    await this.userService.incrementSignInCount({ userId });

    await this.tabService.addTabToUserIfNotAdded({ userId });

    let map;
    const lastMap = await this.mapService.getLastMap({ userId });
    if (lastMap) {
      map = lastMap;
    } else {
      map = await this.mapService.createMap({ userId, mapName: 'New Map' });
    }

    await this.mapService.updateOpenCount({ mapId: map.id });

    await this.tabService.addMapToTabIfNotAdded({ userId, mapId: map.id });

    return this.prisma.workspace.create({
      data: {
        User: { connect: { id: userId } },
        Map: { connect: { id: map.id } },
      },
      select: {
        id: true,
      },
    });
  }

  async updateWorkspaceMap({ workspaceId, userId, mapId }: {
    workspaceId: number,
    userId: number,
    mapId: number | null
  }): Promise<void> {
    let map;
    if (mapId) {
      map = await this.prisma.map.findFirstOrThrow({
        where: { id: mapId },
        select: { id: true, data: true },
      });
    } else {
      const lastMap = await this.mapService.getLastMap({ userId });
      if (lastMap) {
        map = lastMap;
      } else {
        map = await this.mapService.createMap({ userId, mapName: 'New Map' });
      }
    }

    await this.mapService.updateOpenCount({ mapId: map.id });

    await this.tabService.addMapToTabIfNotAdded({ userId, mapId: map.id });

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        Map: { connect: { id: map.id } },
      },
    });
  }

  async removeMapFromWorkspaces({ mapId }: { mapId: number }): Promise<void> {
    await this.prisma.workspace.updateMany({
      where: { mapId },
      data: {
        mapId: undefined,
      },
    });
  }

  async deleteWorkspace({ workspaceId }: { workspaceId: number }) {
    try {
      await this.prisma.workspace.delete({ where: { id: workspaceId } });
    } catch (e) {
      console.error('delete workspace error');
    }
  }
}
