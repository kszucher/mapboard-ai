import { ColorMode, UserInfo } from '../../../shared/types/api-state-types';
import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(
    private prisma: PrismaClient) {
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

    return {
      userName: workspace.User.name,
      colorMode: workspace.User.colorMode as ColorMode,
    };
  }
}
