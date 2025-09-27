import { injectable } from 'tsyringe';
import { MapRepository } from '../map/map.repository';
import { TabRepository } from '../tab/tab.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';

@injectable()
export class WorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private userRepository: UserRepository,
    private mapRepository: MapRepository,
    private tabRepository: TabRepository
  ) {}

  async createWorkspace({ userId }: { userId: number }) {
    let map = await this.mapRepository.getLastMapOfUser({ userId });
    if (!map) {
      map = await this.mapRepository.createMap({ userId, mapName: 'New Map' });
      await this.tabRepository.addMapToTab({ userId, mapId: map.id });
    }

    await this.userRepository.incrementSignInCount({ userId });

    return await this.workspaceRepository.createWorkspace({ userId, mapId: map.id });
  }

  async updateWorkspaceMap({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    await this.workspaceRepository.addMapToWorkspace({ workspaceId, mapId });
  }

  async deleteWorkspaces() {
    await this.workspaceRepository.deleteWorkspacesAll();
  }
}
