import { ColorMode, UserInfo } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(
    private prisma: PrismaClient,
  ) {
  }

  async readUser({ workspaceId }: { workspaceId: number }): Promise<UserInfo> {
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
      tabMapIdList: tabMaps.map(el => el.id),
      tabMapNameList: tabMaps.map(el => el.name),
    };
  }
}
