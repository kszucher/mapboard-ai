import { JsonObject } from '@prisma/client/runtime/library';
import { ColorMode, UserInfoDefaultState } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(
    private prisma: PrismaClient,
  ) {
  }

  private createNewMapData() {
    return {
      [global.crypto.randomUUID().slice(-8)]: { path: ['g'] },
      [global.crypto.randomUUID().slice(-8)]: { path: ['r', 0] },
    };
  }

  async signIn({ userSub }: { userSub: string }): Promise<number> {
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
          mapData: this.createNewMapData(),
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

    return workspace.id;
  }

  async readUser({ workspaceId }: { workspaceId: number }): Promise<UserInfoDefaultState> {
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
