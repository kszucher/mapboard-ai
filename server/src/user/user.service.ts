import { injectable } from 'tsyringe';
import { UserRepository } from './user.repository';

@injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserBySub({ sub }: { sub: string }) {
    return this.userRepository.getUserBySub({ sub });
  }
}
