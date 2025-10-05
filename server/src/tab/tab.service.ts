import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { MapRepository } from '../map/map.repository';
import { TabRepository } from './tab.repository';

@injectable()
export class TabService {
  constructor(
    private tabRepository: TabRepository,
    private mapRepository: MapRepository,
    private distributionService: DistributionService
  ) {}

  async getOrderedMapsOfTab({ userId }: { userId: number }) {
    const tab = await this.tabRepository.getTabByUser({ userId });

    const maps = await this.mapRepository.getMapsById({ mapIds: tab.mapIds });

    const idToMap = new Map(maps.map(map => [map.id, map]));

    return tab.mapIds.map(id => {
      const map = idToMap.get(id);
      if (!map) {
        throw new Error(`Map with id ${id} not found`);
      }
      return map;
    });
  }

  async moveUpMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.tabRepository.moveUpMapInTab({ userId, mapId });

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_TAB, payload: { userId } });
  }

  async moveDownMapInTab({ userId, mapId }: { userId: number; mapId: number }) {
    await this.tabRepository.moveDownMapInTab({ userId, mapId });

    await this.distributionService.publish({ type: SSE_EVENT_TYPE.INVALIDATE_TAB, payload: { userId } });
  }
}
