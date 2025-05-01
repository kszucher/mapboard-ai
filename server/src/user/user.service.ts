import { PrismaClient } from '../generated/client';

export class UserService {
  constructor(
    private prisma: PrismaClient) {
  }

  async getUser({ userId }: { userId: number }) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        name: true,
        colorMode: true,
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
