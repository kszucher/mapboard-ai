import { Request, Response, Router } from 'express';
import {
  GetTabInfoQueryResponseDto,
  MoveDownMapInTabRequestDto,
  MoveUpMapInTabRequestDto,
} from '../../../shared/src/api/api-types-tab';
import { tabService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();

router.post('/get-tab-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const tabInfo = await tabService.getMapsOfTab({ userId });
  const response: GetTabInfoQueryResponseDto = { tabInfo };
  res.json(response);
});

router.post('/move-up-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId, userId } = (req as any);
  const { mapId }: MoveUpMapInTabRequestDto = req.body;
  await tabService.moveUpMapInTab({ workspaceId, userId, mapId });
  res.json();
});

router.post('/move-down-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId, userId } = (req as any);
  const { mapId }: MoveDownMapInTabRequestDto = req.body;
  await tabService.moveDownMapInTab({ workspaceId, userId, mapId });
  res.json();
});

export default router;
