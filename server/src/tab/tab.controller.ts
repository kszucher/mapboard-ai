import { Request, Response, Router } from 'express';
import { GetTabInfoQueryResponseDto } from '../../../shared/src/api/api-types-tab';
import { checkJwt, getUserIdAndWorkspaceId, tabService } from '../server';

const router = Router();

router.post('/get-tab-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const tabInfo = await tabService.readTab({ userId });
  const response: GetTabInfoQueryResponseDto = { tabInfo };
  res.json(response);
});

// TODO moveUpMapInTab

// TODO moveDownMapInTab

export default router;
