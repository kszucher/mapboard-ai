import { $Enums, PrismaClient } from '../generated/client';
import ShareAccess = $Enums.ShareAccess;
import ShareStatus = $Enums.ShareStatus;

export class ShareService {
  constructor(private prisma: PrismaClient) {
  }

  async createShare({ userId, mapId, shareEmail, shareAccess }: {
    userId: number
    mapId: number,
    shareEmail: string,
    shareAccess: ShareAccess
  }) {
    const shareUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: shareEmail,
      },
      select: { id: true },
    });

    return this.prisma.share.create({
      data: {
        mapId,
        ownerUserId: userId,
        shareUserId: shareUser.id,
        access: shareAccess,
        status: ShareStatus.WAITING,
      },
    });
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
      where: { id: workspaceId },
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

    if (workspace.userId === workspace.Map.userId) {
      return ShareAccess.EDIT;
    }

    const userShare = workspace.Map.Shares.find(
      el => el.mapId === workspace.Map.id && el.shareUserId === workspace.userId,
    );

    if (userShare) {
      return userShare.access;
    }

    return ShareAccess.UNAUTHORIZED;
  }

  async updateShareAccess({ shareId, shareAccess }: { shareId: number, shareAccess: ShareAccess }) {
    return this.prisma.share.update({
      where: { id: shareId },
      data: { access: shareAccess },
    });
  }

  async updateShareStatusAccepted({ shareId }: { shareId: number }) {
    return this.prisma.share.update({
      where: { id: shareId },
      data: { status: ShareStatus.ACCEPTED },
    });
  }

  async withdrawShare({ shareId }: { shareId: number }) {


  }
}
