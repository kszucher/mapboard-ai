import { Request, Response, Router } from 'express';
import { ReadMapResponseDto, RenameMapResponseDto } from '../../../shared/types/api-state-types';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { MapService } from './map.service';

const router = Router();
export const mapService = new MapService(prismaClient);

router.post('/create-map-in-tab', checkJwt, async (req: Request, res: Response) => {
  const { userId } = (req as any);
  const mapInfo = await mapService.createMapInTab({ userId, mapName: 'New Map In Tab' });
  res.json(mapInfo);
});

router.post('/rename-map', checkJwt, async (req: Request, res: Response) => {
  const { mapId, mapName } = req.body;
  const mapInfo = await mapService.renameMap({ mapId, mapName });
  res.json({ mapInfo } as RenameMapResponseDto);
});

router.post('/read-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const mapInfo = await mapService.readMap({ workspaceId });
  res.json({ mapInfo } as ReadMapResponseDto);
});

router.post('/save-map', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });
});

export default router;
