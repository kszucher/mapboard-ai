import { JsonObject } from '@prisma/client/runtime/library';
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

  async getWorkspacesOfUser({ userId }: { userId: number }) {
    return this.prisma.workspace.findMany({
      where: { User: { id: userId } },
      select: { id: true },
    });
  }

  async getWorkspacesOfMap({ mapId }: { mapId: number }) {
    return this.prisma.workspace.findMany({
      where: { Map: { id: mapId } },
      select: { id: true },
    });
  }

  async createWorkspace({ userId }: { userId: number }) {
    const lastMap = await this.mapService.readLastMap({ userId });

    if (lastMap) {
      await this.mapService.updateOpenCount({ mapId: lastMap.id });
    }

    const map = lastMap ?? await this.mapService.createMap({ userId, mapName: 'New Map' });

    await this.tabService.addTabToUser({ userId });

    await this.tabService.addMapToTab({ userId, mapId: map.id });

    await this.userService.incrementSignInCount({ userId });

    return this.prisma.workspace.create({
      data: {
        User: { connect: { id: userId } },
        Map: { connect: { id: map.id } },
        mapData: map.data as JsonObject,
      },
      select: {
        id: true,
      },
    });
  }

  async updateWorkspaceMap({ workspaceId, mapId }: { workspaceId: number, mapId: number }): Promise<void> {
    const map = await this.prisma.map.findFirstOrThrow({
      where: { id: mapId },
      select: { id: true, data: true },
    });

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        mapId: map.id,
        mapData: map.data as JsonObject,
      },
    });

    await this.mapService.updateOpenCount({ mapId });
  }

  async removeMapFromWorkspaces({ mapId }: { mapId: number }): Promise<void> {
    await this.prisma.workspace.updateMany({
      where: { mapId },
      data: {
        mapId: undefined,
        mapData: undefined,
      },
    });
  }
}
