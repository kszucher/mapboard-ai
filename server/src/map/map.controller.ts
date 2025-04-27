import { Request, Response, Router } from 'express';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabDuplicateResponseDto,
  CreateMapInTabRequestDto,
  CreateMapInTabResponseDto,
  RenameMapRequestDto,
  RenameMapResponseDto,
} from '../../../shared/src/api/api-types';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { tabService } from '../tab/tab.controller';
import { MapService } from './map.service';

const router = Router();
export const mapService = new MapService(prismaClient, tabService);

router.post('/create-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapName }: CreateMapInTabRequestDto = req.body;
  const mapInfo = await mapService.createMapInTab({ userId, mapName });
  const tabMapInfo = await tabService.readTab({ userId });
  const response: CreateMapInTabResponseDto = { mapInfo, tabMapInfo };
  res.json(response);
});

router.post('/create-map-in-tab-duplicate', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapId }: CreateMapInTabDuplicateRequestDto = req.body;
  const mapInfo = await mapService.createMapInTabDuplicate({ userId, mapId });
  const tabMapInfo = await tabService.readTab({ userId });
  const response: CreateMapInTabDuplicateResponseDto = { mapInfo, tabMapInfo };
  res.json(response);
});

router.post('/rename-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { mapId, mapName }: RenameMapRequestDto = req.body;
  const response: RenameMapResponseDto = { mapInfo: await mapService.renameMap({ mapId, mapName }) };
  res.json(response);
});

router.post('/save-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const { mapId, mapData } = req.body;

  await mapService.updateMapByClient({ workspaceId, mapId, mapData });
  res.json();
});

// TODO executeUploadFile

// TODO executeIngestion

// TODO executeExtraction

// TODO executeTextOutput

// TODO deleteMap

export default router;
