import { inject, injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class UserRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

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

  async registerUser({ name, sub, email }: { name: string; sub: string; email: string }) {
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
