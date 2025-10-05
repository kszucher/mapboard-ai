import { Request, Response, Router } from 'express';
import multer from 'multer';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteLinkRequestDto,
  DeleteMapRequestDto,
  DeleteNodeRequestDto,
  ExecuteMapFileUploadDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  InsertLinkRequestDto,
  InsertNodeRequestDto,
  MoveNodeRequestDto,
  RenameMapRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map';

import { mapService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/get-map-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const response: GetMapInfoQueryResponseDto = await mapService.getWorkspaceMapInfo({ workspaceId });
  res.json(response);
});

router.post('/create-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId, workspaceId } = req as any;
  const params: CreateMapInTabRequestDto = req.body;
  await mapService.createMapInTabNew({ userId, workspaceId, ...params });
  res.json();
});

router.post('/create-map-in-tab-duplicate', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId, workspaceId } = req as any;
  const params: CreateMapInTabDuplicateRequestDto = req.body;
  await mapService.createMapInTabDuplicate({ userId, workspaceId, ...params });
  res.json();
});

router.post('/rename-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const params: RenameMapRequestDto = req.body;
  await mapService.renameMap(params);
  res.json();
});

router.post('/insert-node', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const params: InsertNodeRequestDto = req.body;
  await mapService.insertNode(params);
  res.json();
});

router.post('/insert-link', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const params: InsertLinkRequestDto = req.body;
  await mapService.insertLink(params);
  res.json();
});

router.post('/delete-node', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const params: DeleteNodeRequestDto = req.body;
  await mapService.deleteNode({ workspaceId, ...params });
  res.json();
});

router.post('/delete-link', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const params: DeleteLinkRequestDto = req.body;
  await mapService.deleteLink(params);
  res.json();
});

router.post('/move-node', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const params: MoveNodeRequestDto = req.body;
  await mapService.moveNode({ workspaceId, ...params });
  res.json();
});

router.post('/update-node', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const params: UpdateNodeRequestDto = req.body;
  await mapService.updateNode({ workspaceId, ...params });
  res.json();
});

router.post(
  '/execute-map-upload-file',
  checkJwt,
  getUserIdAndWorkspaceId,
  upload.single('file'),
  async (req: Request, res: Response) => {
    const { workspaceId } = req as any;
    const file = req.file as Express.Multer.File;
    const { mapId, nodeId }: ExecuteMapFileUploadDto = req.body;
    await mapService.executeMapUploadFile({ workspaceId, mapId: Number(mapId), nodeId: Number(nodeId), file });
    res.json();
  }
);

router.post('/execute-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const params: ExecuteMapRequestDto = req.body;
  await mapService.executeMap({ workspaceId, ...params });
  res.json();
});

router.post('/delete-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = req as any;
  const params: DeleteMapRequestDto = req.body;
  await mapService.deleteMap({ userId, ...params });
  res.json();
});

export default router;
