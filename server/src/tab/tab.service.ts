import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { TabRepository } from './tab.repository';

@injectable()
export class TabService {
  constructor(
    private prisma: PrismaClient,
    private tabRepository: TabRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService
  ) {}

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

  async addMapToTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.tabRepository.addMapToTab({ userId, mapId });

    const workspaceIdsOfUser = await this.workspaceRepository.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser, { type: SSE_EVENT_TYPE.UPDATE_TAB, payload: {} });
  }

  async moveUpMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.tabRepository.moveUpMapInTab({ userId, mapId });

    const workspaceIdsOfUser = await this.workspaceRepository.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser, { type: SSE_EVENT_TYPE.UPDATE_TAB, payload: {} });
  }

  async moveDownMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.tabRepository.moveDownMapInTab({ userId, mapId });

    const workspaceIdsOfUser = await this.workspaceRepository.getWorkspaceIdsOfUser({ userId });

    await this.distributionService.publish(workspaceIdsOfUser, { type: SSE_EVENT_TYPE.UPDATE_TAB, payload: {} });
  }
}
