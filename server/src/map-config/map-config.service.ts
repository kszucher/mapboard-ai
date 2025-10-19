import { injectable } from 'tsyringe';
import { MapConfigRepository } from './map-config.repository';

@injectable()
export class MapConfigService {
  constructor(private mapConfigRepository: MapConfigRepository) {}

  async getMapConfig() {
    return {
      mapNodeConfigs: await this.mapConfigRepository.getMapNodeConfig(),
      mapLinkConfigs: await this.mapConfigRepository.getMapLinkConfig(),
    };
  }

  async createMapNodeConfig() {
    return this.mapConfigRepository.createMapNodeConfig();
  }

  async createMapLinkConfig({
    fromNodeConfigId,
    toNodeConfigId,
  }: {
    fromNodeConfigId: number;
    toNodeConfigId: number;
  }) {
    return this.mapConfigRepository.createMapLinkConfig({ fromNodeConfigId, toNodeConfigId });
  }

  async removeMapNodeConfig() {
    return this.mapConfigRepository.removeMapNodeConfig();
  }

  async removeMapLinkConfig() {
    return this.mapConfigRepository.removeMapLinkConfig();
  }
}
