import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { ShareService } from './share.service';

const router = Router();
const shareService = new ShareService(prismaClient);

router.post('/get-shares-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const shareInfo = await shareService.getShareInfo({ userId });
  res.json(shareInfo);
});


export default router;
