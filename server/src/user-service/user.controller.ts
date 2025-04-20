import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { UserService } from './user.service';

const router = Router();
const userService = new UserService(prismaClient);

router.post('/get-user-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const userInfo = await userService.readUser({ workspaceId });
  res.json(userInfo);
});

router.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = await userService.signIn({ userSub: req.auth?.payload.sub ?? '' });
  res.json({ workspaceId });
});

export default router;
