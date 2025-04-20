import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { UserService } from './user.service';

const router = Router();
export const userService = new UserService(prismaClient);

router.post('/get-user-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const userInfo = await userService.readUser({ workspaceId });
  res.json(userInfo);
});

export default router;
