import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { DistributionService } from './distribution.service';

@injectable()
export class DistributionController {
  public router: Router;

  constructor(private distributionService: DistributionService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/workspace_events/:workspaceId', (req: Request, res: Response) => {
      const workspaceId = Number(req.params.workspaceId);
      this.distributionService.addClient(req, res, workspaceId);
    });
  }
}
