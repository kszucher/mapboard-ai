import { JsonObject } from '@prisma/client/runtime/library';
import { ColorMode, UserInfoDefaultState } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(private prisma: PrismaClient) {
  }

  async signIn(): Promise<void> {

    const userId = 1;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        signInCount: {
          increment: 1,
        },
      },
    });

    const lastAvailableMap = await this.prisma.map.findFirstOrThrow({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, mapData: true },
    });

    await this.prisma.workspace.create({
        data: {
          User: { connect: { id: userId } },
          Map: { connect: { id: lastAvailableMap.id } },
          mapData: lastAvailableMap.mapData as JsonObject,
        },
      },
    );
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
