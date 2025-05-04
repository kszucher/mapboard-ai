import { DistributionService } from '../distribution/distribution.service';
import { PrismaClient } from '../generated/client';
import { WorkspaceService } from '../workspace/workspace.service';

export class UserService {
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

  async getUser({ userId }: { userId: number }) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        colorMode: true,
      },
    });
  }

  async registerUser({ name, sub, email }: { name: string, sub: string, email: string }) {
    await this.prisma.user.create({
      data: {
        name,
        sub,
        email,
        Tab: {
          create: {
            mapIds: [],
          },
        },
      },
    });
  }

  async incrementSignInCount({ userId }: { userId: number }) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        signInCount: {
          increment: 1,
        },
      },
    });
  }
}
