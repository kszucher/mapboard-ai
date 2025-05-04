import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { DistributionService } from '../distribution/distribution.service';
import { $Enums, PrismaClient, Share } from '../generated/client';
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
      select: { ownerUserId: true, shareUserId: true },
    });

    const workspaceIdsOfShareUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId: share.shareUserId });
    await this.distributionService.publish(workspaceIdsOfShareUser, {
      type: WORKSPACE_EVENT.SHARE_CREATED,
      payload: share,
    });
  }

  async acceptShare({ shareId }: { shareId: number }) {
    const share = await this.prisma.share.update({
      where: { id: shareId },
      data: { status: ShareStatus.ACCEPTED },
      select: { ownerUserId: true, shareUserId: true },
    });

    const workspaceIdsOfOwnerUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId: share.ownerUserId });
    await this.distributionService.publish(workspaceIdsOfOwnerUser, {
      type: WORKSPACE_EVENT.SHARE_ACCEPTED,
      payload: share,
    });
  }

  async withdrawShare({ shareId }: { shareId: number }) {
    const share = await this.prisma.share.findFirstOrThrow({
      where: { id: shareId },
      select: {
        shareUserId: true,
        mapId: true,
        OwnerUser: { select: { name: true } },
        Map: { select: { name: true } },
      },
    });

    await this.prisma.share.delete({ where: { id: shareId } });

    const workspaceIdsOfShareUserAndMap = await this.workspaceService.getWorkspaceIdsOfUserAndMap({
      userId: share.shareUserId,
      mapId: share.mapId,
    });
    await this.distributionService.publish(workspaceIdsOfShareUserAndMap, {
      type: WORKSPACE_EVENT.MAP_DELETED,
      payload: {},
    });

    const workspaceIdsOfShareUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId: share.shareUserId });
    await this.distributionService.publish(workspaceIdsOfShareUser, {
      type: WORKSPACE_EVENT.SHARE_WITHDREW,
      payload: { message: `${share.OwnerUser.name} withdrew share of map ${share.Map.name}` },
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

    const workspaceIdsOfShareUserAndMap = await this.workspaceService.getWorkspaceIdsOfUserAndMap({
      userId: share.shareUserId,
      mapId: share.mapId,
    });
    await this.distributionService.publish(workspaceIdsOfShareUserAndMap, {
      type: WORKSPACE_EVENT.MAP_DELETED,
      payload: {},
    });

    const workspaceIdsOfOwnerUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId: share.ownerUserId });
    await this.distributionService.publish(workspaceIdsOfOwnerUser, {
      type: WORKSPACE_EVENT.SHARE_REJECTED,
      payload: { message: `${share.ShareUser.name} rejected share of map ${share.Map.name}` },
    });
  }

  async modifyShareAccess({ shareId, shareAccess }: { shareId: number, shareAccess: ShareAccess }) {
    const share = await this.prisma.share.update({
      where: { id: shareId },
      data: { access: shareAccess },
      select: {
        shareUserId: true,
        OwnerUser: { select: { name: true } },
        Map: { select: { name: true } },
        access: true,
      },
    });

    const workspaceIdsOfShareUser = await this.workspaceService.getWorkspaceIdsOfUser({ userId: share.shareUserId });
    await this.distributionService.publish(workspaceIdsOfShareUser, {
      type: WORKSPACE_EVENT.SHARE_ACCESS_MODIFIED,
      payload: { message: `${share.OwnerUser.name} changed access of map ${share.Map.name} to ${share.access}` },
    });
  }
}
