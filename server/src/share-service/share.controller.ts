import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { ShareService } from './share.service';

const router = Router();
export const shareService = new ShareService(prismaClient);

router.post('create-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  // TODO
  res.json();
});

router.post('update-share-access', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  // TODO
  res.json();
});

router.post('update-share-status-accepted', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  // TODO
  res.json();
});

router.post('withdraw-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  // TODO
  res.json();
});

router.post('reject-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  // TODO
  res.json();
});

export default router;
