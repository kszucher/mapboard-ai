import { injectable } from 'tsyringe';
import { UserRepository } from './user.repository';

@injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser({ userId }: { userId: number }) {
    return this.userRepository.getUser({ userId });
  }
}
