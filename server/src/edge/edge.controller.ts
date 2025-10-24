import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { DeleteEdgeRequestDto, InsertEdgeRequestDto } from '../../../shared/src/api/api-types-edge';
import { checkJwt, getWorkspaceId } from '../middleware';
import { EdgeService } from './edge.service';

@injectable()
export class EdgeController {
  public router: Router;

  constructor(private edgeService: EdgeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/insert-edge', checkJwt, getWorkspaceId, this.insertEdge.bind(this));
    this.router.post('/delete-edge', checkJwt, getWorkspaceId, this.deleteEdge.bind(this));
  }

  private async insertEdge(req: Request, res: Response) {
    const params: InsertEdgeRequestDto = req.body;
    await this.edgeService.insertEdge(params);
    res.json();
  }

  private async deleteEdge(req: Request, res: Response) {
    const params: DeleteEdgeRequestDto = req.body;
    await this.edgeService.deleteEdge(params);
    res.json();
  }
}
