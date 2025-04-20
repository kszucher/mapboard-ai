import { Request, Response, Router } from 'express';
import { SignInResponseDto } from '../../../shared/types/api-state-types';
import { mapService } from '../map-service/map.controller';
import { shareService } from '../share-service/share.controller';
import { checkJwt, prismaClient } from '../startup';
import { userService } from '../user-service/user.controller';
import { SignInService } from './sign-in.service';

const router = Router();
const signInService = new SignInService(prismaClient, mapService);

router.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  const { userId, workspaceId } = await signInService.signIn({ userSub: req.auth?.payload.sub ?? '' });
  const userInfo = await userService.readUser({ workspaceId });
  const mapInfo = await mapService.readMap({ workspaceId });
  const shareInfo = await shareService.getShareInfo({ userId });
  res.json({ workspaceId, userInfo, mapInfo, shareInfo } as SignInResponseDto);
});

export default router;
