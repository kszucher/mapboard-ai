import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { GetUserInfoQueryResponseDto } from '../../../shared/src/api/api-types-user';
import { checkJwt, getWorkspaceId } from '../middleware';
import { UserService } from './user.service';

@injectable()
export class UserController {
  public router: Router;

  constructor(private userService: UserService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-user-info', checkJwt, getWorkspaceId, this.getUserInfo.bind(this));
    // TODO: toggleColorMode
    // TODO: deleteAccount
  }

  private async getUserInfo(req: Request, res: Response) {
    const user = await this.userService.getUserBySub({ sub: req.auth?.payload.sub ?? '' });

    const response: GetUserInfoQueryResponseDto = { userInfo: user };
    res.json(response);
  }
}
