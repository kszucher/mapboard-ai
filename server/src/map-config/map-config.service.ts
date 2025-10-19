import { injectable } from 'tsyringe';
import { MapConfigRepository } from './map-config.repository';

@injectable()
export class MapConfigService {
  constructor(private mapConfigRepository: MapConfigRepository) {}

  async getMapConfig() {
    return {
      mapNodeConfigs: await this.mapConfigRepository.getMapNodeConfig(),
      mapEdgeConfigs: await this.mapConfigRepository.getMapEdgeConfig(),
    };
  }

  async createMapNodeConfig() {
    return this.mapConfigRepository.createMapNodeConfig();
  }

  async createMapEdgeConfig({
    fromNodeConfigId,
    toNodeConfigId,
  }: {
    fromNodeConfigId: number;
    toNodeConfigId: number;
  }) {
    return this.mapConfigRepository.createMapEdgeConfig({ fromNodeConfigId, toNodeConfigId });
  }

  async removeMapNodeConfig() {
    return this.mapConfigRepository.removeMapNodeConfig();
  }

  async removeMapEdgeConfig() {
    return this.mapConfigRepository.removeMapEdgeConfig();
  }
}
