import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { MapService } from './map.service';

const router = Router();
export const mapService = new MapService(prismaClient);

router.post('/get-map-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const mapInfo = await mapService.readMap({ workspaceId });
  res.json(mapInfo);
});

router.post('/create-map-in-tab', checkJwt, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const { mapData, mapName } = req.body;
  await mapService.createMapInTab({ userId, mapData, mapName });
  res.json();
});

router.post('/rename-map', checkJwt, async (req: Request, res: Response) => {
  const { mapId, mapName } = req.body;
  const mapRenameResponseDto = await mapService.renameMap({ mapId, mapName });
  res.json(mapRenameResponseDto);
});

router.post('/save-map', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });
});

export default router;
