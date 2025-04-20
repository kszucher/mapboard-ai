import { JsonObject } from '@prisma/client/runtime/library';
import { SignInResponseDto } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';
import { MapService } from '../map-service/map.service';
import { ShareService } from '../share-service/share.service';
import { UserService } from '../user-service/user.service';

export class SignInService {
  constructor(
    private prisma: PrismaClient,
    private mapService: MapService,
    private userService: UserService,
    private shareService: ShareService,
  ) {
  }


  async signIn({ userSub }: { userSub: string }): Promise<SignInResponseDto> {
    const user = await this.prisma.user.update({
      where: { sub: userSub },
      data: {
        signInCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
      },
    });

    let lastAvailableMap = await this.prisma.map.findFirst({
      where: { userId: user.id },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, mapData: true },
    });

    if (!lastAvailableMap) {
      lastAvailableMap = await this.prisma.map.create({
        data: {
          name: 'New Map',
          mapData: this.mapService.createNewMapData(),
          User: { connect: { id: user.id } },
        },
      });

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          Tab: {
            update: {
              mapIds: {
                push: lastAvailableMap.id,
              },
            },
          },
        },
      });
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        User: { connect: { id: user.id } },
        Map: { connect: { id: lastAvailableMap.id } },
        mapData: lastAvailableMap.mapData as JsonObject,
      },
      select: {
        id: true,
      },
    });

    const userInfo = await this.userService.readUser({ workspaceId: workspace.id });
    const mapInfo = await this.mapService.readMap({ workspaceId: workspace.id });
    const shareInfo = await this.shareService.getShareInfo({ userId: user.id });


    return {
      workspaceId: workspace.id,
      userInfo,
      mapInfo,
      shareInfo,
    };
  }
}
