import { PrismaClient } from '../generated/client';
import { MapRepository } from '../map/map.repository';
import { TabRepository } from '../tab/tab.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private getWorkspaceRepository: () => WorkspaceRepository,
    private getUserRepository: () => UserRepository,
    private getMapRepository: () => MapRepository,
    private getTabRepository: () => TabRepository
  ) {}

  get workspaceRepository(): WorkspaceRepository {
    return this.getWorkspaceRepository();
  }

  get userRepository(): UserRepository {
    return this.getUserRepository();
  }

  get mapRepository(): MapRepository {
    return this.getMapRepository();
  }

  get tabRepository(): TabRepository {
    return this.getTabRepository();
  }

  async createWorkspace({ userId }: { userId: number }) {
    await this.userRepository.incrementSignInCount({ userId });

    const newWorkspace = await this.prisma.workspace.create({
      data: { userId },
      select: { id: true },
    });

    let map;
    let lastMap;
    try {
      lastMap = await this.mapRepository.getLastMapOfUser({ userId });
    } catch {
      lastMap = null;
    }
    if (lastMap) {
      map = lastMap;
    } else {
      map = await this.mapRepository.createMap({ userId, mapName: 'New Map' });

      await this.tabRepository.addMapToTab({ userId, mapId: map.id });

      // TODO distribute
    }

    await this.workspaceRepository.addMapToWorkspace({ workspaceId: newWorkspace.id, mapId: map.id });

    await this.mapRepository.updateOpenCount({ mapId: map.id });

    return newWorkspace;
  }

  async updateWorkspaceMap({
    workspaceId,
    userId,
    mapId,
  }: {
    workspaceId: number;
    userId: number;
    mapId: number | null;
  }): Promise<void> {
    let map;
    if (mapId) {
      map = await this.prisma.map.findFirstOrThrow({
        where: { id: mapId },
        select: { id: true },
      });
    } else {
      let lastMap;
      try {
        lastMap = await this.mapRepository.getLastMapOfUser({ userId });
      } catch {
        lastMap = null;
      }
      if (lastMap) {
        map = lastMap;
      } else {
        map = await this.mapRepository.createMap({ userId, mapName: 'New Map' });

        await this.tabRepository.addMapToTab({ userId, mapId: map.id });

        // TODO distribute
      }
    }

    await this.mapRepository.updateOpenCount({ mapId: map.id });

    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId: map.id });
  }
}
