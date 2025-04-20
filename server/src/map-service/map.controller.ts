import { Router, Request, Response } from 'express';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { MapService } from './map.service';

const router = Router();
const mapService = new MapService(prismaClient);

router.post('/get-map-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const mapInfo = await mapService.readMap({ workspaceId });
  res.json(mapInfo);
});

router.post('/create-map-in-tab-mutation', checkJwt, async (req: Request, res: Response) => {
  const { mapData, mapName } = req.body;
  const userId = 1;
  await mapService.createMapInTab({ userId, mapData, mapName });
  res.json();
});

router.post('/save-map-mutation', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });
});

export default router;
