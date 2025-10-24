import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  DeleteAttributeRequestDto,
  GetAttributeInfoQueryResponseDto,
  InsertAttributeRequestDto,
} from '../../../shared/src/api/api-types-attribute';
import { checkJwt, getWorkspaceId } from '../middleware';
import { AttributeService } from './attribute.service';

@injectable()
export class AttributeController {
  public router: Router;

  constructor(private attributeService: AttributeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-attribute-info', checkJwt, getWorkspaceId, this.getAttributeInfo.bind(this));
    this.router.post('/insert-attribute', checkJwt, getWorkspaceId, this.insertAttribute.bind(this));
    this.router.post('/delete-attribute', checkJwt, getWorkspaceId, this.deleteAttribute.bind(this));
  }

  private async getAttributeInfo(req: Request, res: Response) {
    const response: GetAttributeInfoQueryResponseDto = await this.attributeService.getAttributeInfo();
    res.json(response);
  }

  private async insertAttribute(req: Request, res: Response) {
    const params: InsertAttributeRequestDto = req.body;
    await this.attributeService.insertAttribute(params);
    res.json();
  }

  private async deleteAttribute(req: Request, res: Response) {
    const params: DeleteAttributeRequestDto = req.body;
    await this.attributeService.deleteAttribute(params);
    res.json();
  }
}
