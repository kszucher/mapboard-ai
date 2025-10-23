import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteMapRequestDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  RenameMapRequestDto,
} from '../../../shared/src/api/api-types-map';
import { checkJwt, getWorkspaceId } from '../middleware';
import { MapService } from './map.service';

@injectable()
export class MapController {
  public router: Router;

  constructor(private mapService: MapService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-map-info', checkJwt, getWorkspaceId, this.getMapInfo.bind(this));
    this.router.post('/create-map-in-tab', checkJwt, getWorkspaceId, this.createMapInTab.bind(this));
    this.router.post('/create-map-in-tab-duplicate', checkJwt, getWorkspaceId, this.createMapInTabDuplicate.bind(this));
    this.router.post('/rename-map', checkJwt, getWorkspaceId, this.renameMap.bind(this));
    this.router.post('/execute-map', checkJwt, getWorkspaceId, this.executeMap.bind(this));
    this.router.post('/delete-map', checkJwt, getWorkspaceId, this.deleteMap.bind(this));
  }

  private async getMapInfo(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const response: GetMapInfoQueryResponseDto = await this.mapService.getWorkspaceMapInfo({ workspaceId });
    res.json(response);
  }

  private async createMapInTab(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: CreateMapInTabRequestDto = req.body;
    await this.mapService.createMapInTabNew({ sub: req.auth?.payload.sub ?? '', workspaceId, ...params });
    res.json();
  }

  private async createMapInTabDuplicate(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: CreateMapInTabDuplicateRequestDto = req.body;
    await this.mapService.createMapInTabDuplicate({ sub: req.auth?.payload.sub ?? '', workspaceId, ...params });
    res.json();
  }

  private async renameMap(req: Request, res: Response) {
    const params: RenameMapRequestDto = req.body;
    await this.mapService.renameMap(params);
    res.json();
  }

  private async executeMap(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: ExecuteMapRequestDto = req.body;
    await this.mapService.executeMap({ workspaceId, ...params });
    res.json();
  }

  private async deleteMap(req: Request, res: Response) {
    const params: DeleteMapRequestDto = req.body;
    await this.mapService.deleteMap({ sub: req.auth?.payload.sub ?? '', ...params });
    res.json();
  }
}
