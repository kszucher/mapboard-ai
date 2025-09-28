import { injectable } from 'tsyringe';
import { SSE_EVENT_TYPE } from '../../../shared/src/api/api-types-distribution';
import {
  AcceptShareRequestDto,
  CreateShareRequestDto,
  ModifyShareAccessRequestDto,
  RejectShareRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types-share';
import { DistributionService } from '../distribution/distribution.service';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { ShareRepository } from './share.repository';

@injectable()
export class ShareService {
  constructor(
    private shareRepository: ShareRepository,
    private workspaceRepository: WorkspaceRepository,
    private distributionService: DistributionService
  ) {}

  async getShareInfo({ userId }: { userId: number }) {
    return this.shareRepository.getShareInfo({ userId });
  }

  async createShare({ userId, mapId, shareEmail, shareAccess }: CreateShareRequestDto & { userId: number }) {
    const share = await this.shareRepository.createShare({ userId, mapId, shareEmail, shareAccess });

    const workspacesOfUsers = await this.workspaceRepository.getWorkspacesOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });

    await this.distributionService.publish(
      workspacesOfUsers.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_SHARE, payload: {} }
    );
  }

  async acceptShare({ shareId }: AcceptShareRequestDto) {
    await this.shareRepository.acceptShare({ shareId });

    const share = await this.shareRepository.getShare({ shareId });

    const workspacesOfUsers = await this.workspaceRepository.getWorkspacesOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });

    await this.distributionService.publish(
      workspacesOfUsers.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_SHARE, payload: {} }
    );
  }

  async modifyShareAccess({ shareId, shareAccess }: ModifyShareAccessRequestDto) {
    await this.shareRepository.modifyShareAccess({ shareId, shareAccess });

    const share = await this.shareRepository.getShare({ shareId });

    const workspacesOfUsers = await this.workspaceRepository.getWorkspacesOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });

    await this.distributionService.publish(
      workspacesOfUsers.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_SHARE, payload: {} }
    );
  }

  private async deleteShare({ shareId }: { shareId: number }) {
    const share = await this.shareRepository.getShare({ shareId });

    await this.shareRepository.deleteShare({ shareId });

    const workspacesOfMap = await this.workspaceRepository.getWorkspacesOfMap({
      mapId: share.mapId,
    });

    await this.distributionService.publish(
      workspacesOfMap.map(el => el.id),
      { type: SSE_EVENT_TYPE.INVALIDATE_WORKSPACE_MAP_TAB_SHARE, payload: {} }
    );
  }

  async withdrawShare({ shareId }: WithdrawShareRequestDto) {
    await this.deleteShare({ shareId });
  }

  async rejectShare({ shareId }: RejectShareRequestDto) {
    await this.deleteShare({ shareId });
  }
}
