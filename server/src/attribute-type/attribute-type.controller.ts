import { Request, Response, Router } from 'express';
import { injectable } from 'tsyringe';
import {
  DeleteAttributeTypeRequestDto,
  GetAttributeTypeInfoQueryResponseDto,
  InsertAttributeTypeRequestDto,
} from '../../../shared/src/api/api-types-attribute-type';
import { checkJwt, getWorkspaceId } from '../middleware';
import { AttributeTypeService } from './attribute-type.service';

@injectable()
export class AttributeTypeController {
  public router: Router;

  constructor(private attributeTypeService: AttributeTypeService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/get-attribute-type-info', checkJwt, getWorkspaceId, this.getAttributeTypeInfo.bind(this));
    this.router.post('/insert-attribute-type', checkJwt, getWorkspaceId, this.insertAttributeType.bind(this));
    this.router.post('/delete-attribute-type', checkJwt, getWorkspaceId, this.deleteAttributeType.bind(this));
  }

  private async getAttributeTypeInfo(req: Request, res: Response) {
    const response: GetAttributeTypeInfoQueryResponseDto = await this.attributeTypeService.getAttributeTypeInfo();
    res.json(response);
  }

  private async insertAttributeType(req: Request, res: Response) {
    const params: InsertAttributeTypeRequestDto = req.body;
    await this.attributeTypeService.insertAttributeType(params);
    res.json();
  }

  private async deleteAttributeType(req: Request, res: Response) {
    const params: DeleteAttributeTypeRequestDto = req.body;
    await this.attributeTypeService.deleteAttributeType(params);
    res.json();
  }
}
