import { Request, Response, Router } from 'express';
import {
  AcceptShareRequestDto,
  CreateShareRequestDto,
  GetShareInfoQueryResponseDto,
  ModifyShareAccessRequestDto,
  RejectShareRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types-share';
import { shareService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();

router.post('/get-share-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = req as any;
  const response: GetShareInfoQueryResponseDto = await shareService.getShareInfo({ userId });
  res.json(response);
});

router.post('/create-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = req as any;
  const { mapId, shareEmail, shareAccess }: CreateShareRequestDto = req.body;
  await shareService.createShare({ userId, mapId, shareEmail, shareAccess });
  res.json();
});

router.post('/accept-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId }: AcceptShareRequestDto = req.body;
  await shareService.acceptShare({ shareId });
  res.json();
});

router.post('/withdraw-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId }: WithdrawShareRequestDto = req.body;
  await shareService.withdrawShare({ shareId });
  res.json();
});

router.post('/reject-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId }: RejectShareRequestDto = req.body;
  await shareService.rejectShare({ shareId });
  res.json();
});

router.post('/modify-share-access', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId, shareAccess }: ModifyShareAccessRequestDto = req.body;
  await shareService.modifyShareAccess({ shareId, shareAccess });
  res.json();
});

export default router;
