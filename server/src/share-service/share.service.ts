import { SharesInfoDefaultState } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class ShareService {
  constructor(private prisma: PrismaClient) {
  }

  async getShareInfo({ userId }: { userId: number }): Promise<SharesInfoDefaultState> {
    const user = await this.prisma.user.findFirstOrThrow({
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

    return {
      sharesByUser: user.SharesByMe.map(el => ({
        id: el.id.toString(),
        sharedMapName: el.Map.name,
        shareUserEmail: el.ShareUser.email,
        access: el.access,
        status: el.status,
      })),
      sharesWithUser: user.SharesWithMe.map(el => ({
        id: el.id.toString(),
        sharedMapName: el.Map.name,
        ownerUserEmail: el.OwnerUser.email,
        access: el.access,
        status: el.status,
      })),
    };
  }
}
