import { Request, Response, Router } from 'express';
import multer from 'multer';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteMapRequestDto,
  ExecuteMapFileUploadDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  RenameMapRequestDto,
} from '../../../shared/src/api/api-types-map';

import { mapService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/get-map-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const map = await mapService.getWorkspaceMapInfo({ workspaceId });
  const response: GetMapInfoQueryResponseDto = { mapInfo: map };
  res.json(response);
});

router.post('/create-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId, workspaceId } = (req as any);
  const { mapName }: CreateMapInTabRequestDto = req.body;
  await mapService.createMapInTabNew({ userId, workspaceId, mapName });
  res.json();
});

router.post('/create-map-in-tab-duplicate', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId, workspaceId } = (req as any);
  const { mapId }: CreateMapInTabDuplicateRequestDto = req.body;
  await mapService.createMapInTabDuplicate({ userId, workspaceId, mapId });
  res.json();
});

router.post('/rename-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { mapId, mapName }: RenameMapRequestDto = req.body;
  await mapService.renameMap({ mapId, mapName });
  res.json();
});

router.post('/save-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const { mapId, mapData } = req.body;
  await mapService.saveMap({ workspaceId, mapId, mapData });
  res.json();
});

router.post('/execute-map-upload-file', checkJwt, getUserIdAndWorkspaceId, upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  const { mapId, nodeId }: ExecuteMapFileUploadDto = req.body;
  await mapService.executeMapUploadFile(parseInt(mapId), nodeId, file);
  res.json();
});

router.post('/execute-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { mapId }: ExecuteMapRequestDto = req.body;
  await mapService.executeMap({ mapId });
  res.json();
});

router.post('/delete-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapId }: DeleteMapRequestDto = req.body;
  await mapService.deleteMap({ userId, mapId });
  res.json();
});

export default router;
