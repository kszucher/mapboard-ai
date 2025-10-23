import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { CreateEdgeTypeRequestDto, GetEdgeTypeQueryResponseDto } from '../../../shared/src/api/api-types-edge-type';
import { checkJwt, getWorkspaceId } from '../middleware';
import { EdgeTypeService } from './edge-type.service';

@injectable()
export class EdgeTypeController {
  public router: Router;

  constructor(private edgeTypeService: EdgeTypeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-edge-type-info', checkJwt, getWorkspaceId, this.getEdgeTypeInfo.bind(this));
    this.router.post('/create-edge-type', checkJwt, getWorkspaceId, this.createEdgeType.bind(this));
  }

  private async getEdgeTypeInfo(req: Request, res: Response) {
    const response: GetEdgeTypeQueryResponseDto = await this.edgeTypeService.getEdgeType();
    res.json(response);
  }

  private async createEdgeType(req: Request, res: Response) {
    const params: CreateEdgeTypeRequestDto = req.body;
    await this.edgeTypeService.createEdgeType({ ...params });
    res.json();
  }
}
