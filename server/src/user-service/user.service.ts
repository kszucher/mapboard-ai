import { JsonObject } from '@prisma/client/runtime/library';
import { ColorMode, UserInfoDefaultState } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(private prisma: PrismaClient) {
  }

  async signIn({ userSub }: { userSub: string }): Promise<void> {
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

    const lastAvailableMap = await this.prisma.map.findFirst({
      where: { id: user.id },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, mapData: true },
    });

    if (lastAvailableMap) {
      await this.prisma.workspace.create({
          data: {
            User: { connect: { id: user.id } },
            Map: { connect: { id: lastAvailableMap.id } },
            mapData: lastAvailableMap.mapData as JsonObject,
          },
        },
      );
    } else {
      console.log('no map exists, we will have to create one');
    }


  }

  async getUserInfo({ workspaceId }: { workspaceId: number }): Promise<UserInfoDefaultState> {
    const workspace = await this.prisma.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        User: {
          select: {
            name: true,
            colorMode: true,
            Tab: {
              select: {
                mapIds: true,
              },
            },
          },
        },
      },
    });

    const tabMaps = await this.prisma.map.findMany({
      where: { id: { in: workspace.User.Tab.mapIds } },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      userName: workspace.User.name,
      colorMode: workspace.User.colorMode as ColorMode,
      tabMapIdList: tabMaps.map(el => el.id.toString()),
      tabMapNameList: tabMaps.map(el => el.name),
    };
  }
}
