import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import {
  AcceptShareEvent,
  CreateShareEvent,
  ModifyShareAccessEvent,
  RejectShareEvent,
  WithdrawShareEvent,
} from '../../../shared/src/api/api-types-share';
import { DistributionService } from '../distribution/distribution.service';
import { $Enums, PrismaClient } from '../generated/client';
import { WorkspaceService } from '../workspace/workspace.service';
import ShareAccess = $Enums.ShareAccess;
import ShareStatus = $Enums.ShareStatus;

export class ShareService {
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

  async getShareInfo({ userId }: { userId: number }) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        SharesByMe: {
          select: {
            id: true,
            mapId: true,
            access: true,
            status: true,
            Map: {
              select: {
                name: true,
              },
            },
            ShareUser: {
              select: {
                email: true,
              },
            },
          },
        },
        SharesWithMe: {
          select: {
            id: true,
            mapId: true,
            access: true,
            status: true,
            Map: {
              select: {
                name: true,
              },
            },
            OwnerUser: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getAccess({ workspaceId }: { workspaceId: number }) {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId, Map: { isNot: null } },
      select: {
        userId: true,
        Map: {
          select: {
            id: true,
            userId: true,
            Shares: {
              where: { status: ShareStatus.ACCEPTED },
              select: {
                mapId: true,
                shareUserId: true,
                access: true,
              },
            },
          },
        },
      },
    });

    if (workspace.userId === workspace.Map!.userId) {
      return ShareAccess.EDIT;
    }

    const userShare = workspace.Map!.Shares.find(
      el => el.mapId === workspace.Map!.id && el.shareUserId === workspace.userId,
    );

    if (userShare) {
      return userShare.access;
    }

    return ShareAccess.UNAUTHORIZED;
  }

  async createShare({ userId, mapId, shareEmail, shareAccess }: {
    userId: number
    mapId: number,
    shareEmail: string,
    shareAccess: ShareAccess
  }) {
    const shareUser = await this.prisma.user.findUniqueOrThrow({
      where: { email: shareEmail },
      select: { id: true },
    });

    const existingShare = await this.prisma.share.findFirst({
      where: {
        mapId,
        ownerUserId: userId,
        shareUserId: shareUser.id,
      },
    });

    if (existingShare) {
      throw new Error('Share already exists');
    }

    const share = await this.prisma.share.create({
      data: {
        mapId,
        ownerUserId: userId,
        shareUserId: shareUser.id,
        access: shareAccess,
        status: ShareStatus.WAITING,
      },
      select: {
        ownerUserId: true,
        shareUserId: true,
        OwnerUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });
    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.CREATE_SHARE,
      payload: share as CreateShareEvent,
    });
  }

  async acceptShare({ shareId }: { shareId: number }) {
    const share = await this.prisma.share.update({
      where: { id: shareId },
      data: { status: ShareStatus.ACCEPTED },
      select: {
        ownerUserId: true,
        shareUserId: true,
        ShareUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });
    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.ACCEPT_SHARE,
      payload: share as AcceptShareEvent,
    });
  }

  async withdrawShare({ shareId }: { shareId: number }) {
    const share = await this.prisma.share.findFirstOrThrow({
      where: { id: shareId },
      select: {
        ownerUserId: true,
        shareUserId: true,
        mapId: true,
        OwnerUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    await this.prisma.share.delete({ where: { id: shareId } });

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });
    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.WITHDRAW_SHARE,
      payload: share as WithdrawShareEvent,
    });
  }

  async rejectShare({ shareId }: { shareId: number }) {
    const share = await this.prisma.share.findFirstOrThrow({
      where: { id: shareId },
      select: {
        ownerUserId: true,
        shareUserId: true,
        mapId: true,
        ShareUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    await this.prisma.share.delete({ where: { id: shareId } });

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });
    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.REJECT_SHARE,
      payload: share as RejectShareEvent,
    });
  }

  async modifyShareAccess({ shareId, shareAccess }: { shareId: number, shareAccess: ShareAccess }) {
    const share = await this.prisma.share.update({
      where: { id: shareId },
      data: { access: shareAccess },
      select: {
        ownerUserId: true,
        shareUserId: true,
        access: true,
        OwnerUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    const workspaceIdsOfUsers = await this.workspaceService.getWorkspaceIdsOfUsers({
      userIds: [share.ownerUserId, share.shareUserId],
    });
    await this.distributionService.publish(workspaceIdsOfUsers, {
      type: WORKSPACE_EVENT.MODIFY_SHARE_ACCESS,
      payload: share as ModifyShareAccessEvent,
    });
  }
}
