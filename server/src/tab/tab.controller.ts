import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  GetTabInfoQueryResponseDto,
  MoveDownMapInTabRequestDto,
  MoveUpMapInTabRequestDto,
} from '../../../shared/src/api/api-types-tab';
import { checkJwt, getWorkspaceId } from '../middleware';
import { TabService } from './tab.service';

@injectable()
export class TabController {
  public router: Router;

  constructor(private tabService: TabService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-tab-info', checkJwt, getWorkspaceId, this.getTabInfo.bind(this));
    this.router.post('/move-up-map-in-tab', checkJwt, getWorkspaceId, this.moveUpMap.bind(this));
    this.router.post('/move-down-map-in-tab', checkJwt, getWorkspaceId, this.moveDownMap.bind(this));
  }

  private async getTabInfo(req: Request, res: Response) {
    const response: GetTabInfoQueryResponseDto = await this.tabService.getOrderedMapsOfTab({
      sub: req.auth?.payload.sub ?? '',
    });
    res.json(response);
  }

  private async moveUpMap(req: Request, res: Response) {
    const { mapId }: MoveUpMapInTabRequestDto = req.body;
    await this.tabService.moveUpMapInTab({ sub: req.auth?.payload.sub ?? '', mapId });
    res.json();
  }

  private async moveDownMap(req: Request, res: Response) {
    const { mapId }: MoveDownMapInTabRequestDto = req.body;
    await this.tabService.moveDownMapInTab({ sub: req.auth?.payload.sub ?? '', mapId });
    res.json();
  }
}
