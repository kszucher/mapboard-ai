import { Request, Response, Router } from 'express';
import {
  CreateShareRequestDto,
  GetShareInfoQueryResponseDto,
  RejectShareRequestDto,
  UpdateShareAccessRequestDto,
  UpdateShareStatusAcceptedRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types-share';
import { shareService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();

router.post('/get-share-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const shareInfo = await shareService.getShareInfo({ userId });
  const response: GetShareInfoQueryResponseDto = { shareInfo };
  res.json(response);
});

router.post('/create-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapId, shareEmail, shareAccess }: CreateShareRequestDto = req.body;
  await shareService.createShare({ userId, mapId, shareEmail, shareAccess });
  res.json();
});

router.post('/update-share-access', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId, shareAccess }: UpdateShareAccessRequestDto = req.body;
  await shareService.updateShareAccess({ shareId, shareAccess });
  res.json();
});

router.post('/update-share-status-accepted', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { shareId }: UpdateShareStatusAcceptedRequestDto = req.body;
  await shareService.updateShareStatusAccepted({ shareId });
  res.json();
});

router.post('/withdraw-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: WithdrawShareRequestDto = req.body;
  // TODO
  res.json();
});

router.post('/reject-share', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { shareId }: RejectShareRequestDto = req.body;
  // TODO
  res.json();
});

export default router;
