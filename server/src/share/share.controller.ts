import { Request, Response, Router } from 'express';
import {
  CreateShareRequestDto,
  RejectShareRequestDto,
  UpdateShareAccessRequestDto,
  UpdateShareStatusAcceptedRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { ShareService } from './share.service';

const router = Router();
export const shareService = new ShareService(prismaClient);

router.post('create-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapId, shareEmail, shareAccess }: CreateShareRequestDto = req.body;
  await shareService.createShare({ userId, mapId, shareEmail, shareAccess });
  res.json();
});

router.post('update-share-access', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: UpdateShareAccessRequestDto = req.body;

  res.json();
});

router.post('update-share-status-accepted', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: UpdateShareStatusAcceptedRequestDto = req.body;
  // TODO
  res.json();
});

router.post('withdraw-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: WithdrawShareRequestDto = req.body;
  // TODO
  res.json();
});

router.post('reject-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: RejectShareRequestDto = req.body;
  // TODO
  res.json();
});

export default router;
