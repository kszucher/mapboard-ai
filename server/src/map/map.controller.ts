import { injectable } from 'tsyringe';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteEdgeRequestDto,
  DeleteMapRequestDto,
  DeleteNodeRequestDto,
  ExecuteMapFileUploadDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  InsertEdgeRequestDto,
  InsertNodeRequestDto,
  MoveNodeRequestDto,
  RenameMapRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map';
import { MapService } from './map.service';
import { checkJwt, getWorkspaceId } from '../middleware';

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    this.router.post('/insert-node', checkJwt, getWorkspaceId, this.insertNode.bind(this));
    this.router.post('/insert-edge', checkJwt, getWorkspaceId, this.insertEdge.bind(this));
    this.router.post('/delete-node', checkJwt, getWorkspaceId, this.deleteNode.bind(this));
    this.router.post('/delete-edge', checkJwt, getWorkspaceId, this.deleteEdge.bind(this));
    this.router.post('/move-node', checkJwt, getWorkspaceId, this.moveNode.bind(this));
    this.router.post('/update-node', checkJwt, getWorkspaceId, this.updateNode.bind(this));
    this.router.post(
      '/execute-map-upload-file',
      checkJwt,
      getWorkspaceId,
      upload.single('file'),
      this.executeMapUploadFile.bind(this)
    );
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

  private async insertNode(req: Request, res: Response) {
    const params: InsertNodeRequestDto = req.body;
    await this.mapService.insertNode(params);
    res.json();
  }

  private async insertEdge(req: Request, res: Response) {
    const params: InsertEdgeRequestDto = req.body;
    await this.mapService.insertEdge(params);
    res.json();
  }

  private async deleteNode(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: DeleteNodeRequestDto = req.body;
    await this.mapService.deleteNode({ workspaceId, ...params });
    res.json();
  }

  private async deleteEdge(req: Request, res: Response) {
    const params: DeleteEdgeRequestDto = req.body;
    await this.mapService.deleteEdge(params);
    res.json();
  }

  private async moveNode(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: MoveNodeRequestDto = req.body;
    await this.mapService.moveNode({ workspaceId, ...params });
    res.json();
  }

  private async updateNode(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const params: UpdateNodeRequestDto = req.body;
    await this.mapService.updateNode({ workspaceId, ...params });
    res.json();
  }

  private async executeMapUploadFile(req: Request, res: Response) {
    const { workspaceId } = req as any;
    const file = req.file as Express.Multer.File;
    const { mapId, nodeId }: ExecuteMapFileUploadDto = req.body;
    await this.mapService.executeMapUploadFile({
      workspaceId,
      mapId: Number(mapId),
      nodeId: Number(nodeId),
      file,
    });
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
