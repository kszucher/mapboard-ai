import { Request, Response, Router } from 'express';
import { SignInResponseDto } from '../../../shared/types/api-state-types';
import { mapService } from '../map/map.controller';
import { tabService } from '../tab/tab.controller';
import { shareService } from '../share/share.controller';
import { checkJwt } from '../startup';
import { userService } from '../user/user.controller';
import { workspaceService } from '../workspace/workspace.controller';

const router = Router();

router.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  const { userId, workspaceId } = await workspaceService.createWorkspace({ userSub: req.auth?.payload.sub ?? '' });
  const userInfo = await userService.readUser({ workspaceId });
  const mapInfo = await mapService.readMap({ workspaceId });
  const tabMapInfo = await tabService.readTab({ userId });
  const shareInfo = await shareService.getShareInfo({ userId });
  const response: SignInResponseDto = { workspaceId, userInfo, mapInfo, tabMapInfo, shareInfo };
  res.json(response);
});

export default router;
