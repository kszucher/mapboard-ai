import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { CreateWorkspaceResponseDto, UpdateWorkspaceMapRequestDto } from '../../../shared/src/api/api-types-workspace';
import { checkJwt, getWorkspaceId } from '../middleware';
import { WorkspaceService } from './workspace.service';

@injectable()
export class WorkspaceController {
  public router: Router;

  constructor(private workspaceService: WorkspaceService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/create-workspace', checkJwt, this.createWorkspace.bind(this));
    this.router.post('/update-workspace-map', checkJwt, getWorkspaceId, this.updateWorkspaceMap.bind(this));
  }

  private async createWorkspace(req: Request, res: Response) {
    const workspace = await this.workspaceService.createWorkspace({ sub: req.auth?.payload.sub ?? '' });
    const response: CreateWorkspaceResponseDto = { workspaceId: workspace.id };
    res.json(response);
  }

  private async updateWorkspaceMap(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const { mapId }: UpdateWorkspaceMapRequestDto = req.body;
    await this.workspaceService.updateWorkspaceMap({ workspaceId, mapId });
    res.json();
  }
}
