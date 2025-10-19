import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  CreateMapEdgeConfigRequestDto,
  GetMapConfigInfoQueryResponseDto,
} from '../../../shared/src/api/api-types-map-config';
import { checkJwt, getWorkspaceId } from '../middleware';
import { MapConfigService } from './map-config.service';

@injectable()
export class MapConfigController {
  public router: Router;

  constructor(private mapConfigService: MapConfigService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-map-config-info', checkJwt, getWorkspaceId, this.getMapConfigInfo.bind(this));
    this.router.post('/create-map-edge-config', checkJwt, getWorkspaceId, this.createEdgeConfig.bind(this));
  }

  private async getMapConfigInfo(req: Request, res: Response) {
    const response: GetMapConfigInfoQueryResponseDto = await this.mapConfigService.getMapConfig();
    res.json(response);
  }

  private async createEdgeConfig(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: CreateMapEdgeConfigRequestDto = req.body;
    await this.mapConfigService.createMapEdgeConfig({ ...params });
    res.json();
  }
}
