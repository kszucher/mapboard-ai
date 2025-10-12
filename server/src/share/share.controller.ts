import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  AcceptShareRequestDto,
  CreateShareRequestDto,
  GetShareInfoQueryResponseDto,
  ModifyShareAccessRequestDto,
  RejectShareRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types-share';
import { checkJwt, getWorkspaceId } from '../middleware';
import { ShareService } from './share.service';

@injectable()
export class ShareController {
  public router: Router;

  constructor(private shareService: ShareService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-share-info', checkJwt, getWorkspaceId, this.getShareInfo.bind(this));
    this.router.post('/create-share', checkJwt, getWorkspaceId, this.createShare.bind(this));
    this.router.post('/accept-share', checkJwt, getWorkspaceId, this.acceptShare.bind(this));
    this.router.post('/withdraw-share', checkJwt, getWorkspaceId, this.withdrawShare.bind(this));
    this.router.post('/reject-share', checkJwt, getWorkspaceId, this.rejectShare.bind(this));
    this.router.post('/modify-share-access', checkJwt, getWorkspaceId, this.modifyShareAccess.bind(this));
  }

  private async getShareInfo(req: Request, res: Response) {
    const response: GetShareInfoQueryResponseDto = await this.shareService.getShareInfo({
      sub: req.auth?.payload.sub ?? '',
    });
    res.json(response);
  }

  private async createShare(req: Request, res: Response) {
    const { mapId, shareEmail, shareAccess }: CreateShareRequestDto = req.body;
    await this.shareService.createShare({
      sub: req.auth?.payload.sub ?? '',
      mapId,
      shareEmail,
      shareAccess,
    });
    res.json();
  }

  private async acceptShare(req: Request, res: Response) {
    const { shareId }: AcceptShareRequestDto = req.body;
    await this.shareService.acceptShare({ shareId });
    res.json();
  }

  private async withdrawShare(req: Request, res: Response) {
    const { shareId }: WithdrawShareRequestDto = req.body;
    await this.shareService.withdrawShare({ shareId });
    res.json();
  }

  private async rejectShare(req: Request, res: Response) {
    const { shareId }: RejectShareRequestDto = req.body;
    await this.shareService.rejectShare({ shareId });
    res.json();
  }

  private async modifyShareAccess(req: Request, res: Response) {
    const { shareId, shareAccess }: ModifyShareAccessRequestDto = req.body;
    await this.shareService.modifyShareAccess({ shareId, shareAccess });
    res.json();
  }
}
