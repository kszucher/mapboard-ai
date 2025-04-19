import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/client';
import { MapService } from './map-service/map.service';
import { PgFunctionsService } from './pg-functions/pg.functions.service';
import { ShareService } from './share-service/share.service';
import { UserService } from './user-service/user.service';

const app = express();
const prismaClient = new PrismaClient();

const pgFunctionsService = new PgFunctionsService(prismaClient);
const mapService = new MapService(prismaClient);
const userService = new UserService(prismaClient);
const shareService = new ShareService(prismaClient);

(async () => {
  await pgFunctionsService.setupFunctions();
})();

app.use(express.json());

app.get('/get-map-info', async (req: Request, res: Response) => {
  const userId = 1;
  const workspaceId = 1;
  const mapInfo = await mapService.readMap({ userId, workspaceId });
  res.json(mapInfo);
});

app.post('/create-map-in-tab-mutation', async (req: Request, res: Response) => {
  const { mapData, mapName } = req.body;
  const userId = 1;
  await mapService.createMapInTab({ userId, mapData, mapName });
  res.json();
});

app.post('/save-map-mutation', async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
