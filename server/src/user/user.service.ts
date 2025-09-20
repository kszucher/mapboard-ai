import { PrismaClient } from '../generated/client';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(
    private prisma: PrismaClient,
    private getUserRepository: () => UserRepository
  ) {}

  get userRepository(): UserRepository {
    return this.getUserRepository();
  }

  async getUser({ userId }: { userId: number }) {
    return this.userRepository.getUser({ userId });
  }
}
