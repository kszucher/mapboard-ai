import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import { CreateNodeTypeRequestDto, GetNodeTypeQueryResponseDto } from '../../../shared/src/api/api-types-node-type';
import { checkJwt, getWorkspaceId } from '../middleware';
import { NodeTypeService } from './node-type.service';

@injectable()
export class NodeTypeController {
  public router: Router;

  constructor(private nodeTypeService: NodeTypeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-node-type-info', checkJwt, getWorkspaceId, this.getNodeTypeInfo.bind(this));
    this.router.post('/create-node-type', checkJwt, getWorkspaceId, this.createNodeType.bind(this));
  }

  private async getNodeTypeInfo(req: Request, res: Response) {
    const response: GetNodeTypeQueryResponseDto = await this.nodeTypeService.getNodeType();
    res.json(response);
  }

  private async createNodeType(req: Request, res: Response) {
    const params: CreateNodeTypeRequestDto = req.body;
    await this.nodeTypeService.createNodeType();
    res.json();
  }
}
