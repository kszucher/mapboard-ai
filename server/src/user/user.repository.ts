import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserBySub({ sub }: { sub: string }) {
    return this.prisma.user.findFirstOrThrow({
      where: { sub },
      select: { id: true, name: true, colorMode: true },
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
