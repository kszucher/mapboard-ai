import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';
import { UserRepository } from './user.repository';

@injectable()
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private userRepository: UserRepository
  ) {}

  async getUser({ userId }: { userId: number }) {
    return this.userRepository.getUser({ userId });
  }
}
