import { Request, Response, Router } from 'express';
import { CreateMapInTabResponseDto, RenameMapResponseDto } from '../../../shared/types/api-state-types';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { tabService } from '../tab/tab.controller';
import { MapService } from './map.service';

const router = Router();
export const mapService = new MapService(prismaClient, tabService);

router.post('/create-map-in-tab', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const mapInfo = await mapService.createMapInTab({ userId, mapName: 'New Map In Tab' });
  const tabInfo = await tabService.readTab({ userId });
  res.json({ mapInfo, tabInfo } as CreateMapInTabResponseDto);
});

router.post('/rename-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { mapId, mapName } = req.body;
  const mapInfo = await mapService.renameMap({ mapId, mapName });
  res.json({ mapInfo } as RenameMapResponseDto);
});

router.post('/save-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });
});

export default router;
