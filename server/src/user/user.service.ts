import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(
    private prisma: PrismaClient) {
  }

  async readUser({ workspaceId }: { workspaceId: number }) {
    return this.prisma.user.findFirstOrThrow({
      where: { Workspaces: { some: { id: workspaceId } } },
      select: {
        name: true,
        colorMode: true,
      },
    });
  }
}
