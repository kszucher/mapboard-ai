import { Request, Response, Router } from 'express';
import { GetUserInfoQueryResponseDto } from '../../../shared/src/api/api-types-user';
import { checkJwt, getUserIdAndWorkspaceId, userService } from '../server';

const router = Router();

router.post('/get-user-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const user = await userService.readUser({ userId });
  const response: GetUserInfoQueryResponseDto = { userInfo: user };
  res.json(response);
});

// TODO toggleColorMode

// TODO deleteAccount

export default router;
