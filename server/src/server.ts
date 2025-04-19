import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import { PrismaClient } from './generated/client';
import { MapService } from './map-service/map.service';
import { PgFunctionsService } from './pg-functions/pg.functions.service';
import { ShareService } from './share-service/share.service';
import { UserService } from './user-service/user.service';

const prismaClient = new PrismaClient();
const pgFunctionsService = new PgFunctionsService(prismaClient);

const mapService = new MapService(prismaClient);
const userService = new UserService(prismaClient);
const shareService = new ShareService(prismaClient);

(async () => {
  await pgFunctionsService.setupFunctions();
})();

const checkJwt = auth({
  audience: process.env.NODE_ENV
    ? process.env.AUTH0_REMOTE_URL
    : process.env.AUTH0_LOCAL_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

const app = express();

app.use(cors());

app.use(express.json());

app.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  // console.log(req.auth?.payload.sub);
  const mapInfo = await userService.signIn({ userSub: req.auth?.payload.sub ?? '' });
  res.json();
});

app.get('/get-map-info', checkJwt, async (req: Request, res: Response) => {
  const userId = 1;
  const workspaceId = 1;
  const mapInfo = await mapService.readMap({ userId, workspaceId });
  res.json(mapInfo);
});

app.post('/create-map-in-tab-mutation', checkJwt, async (req: Request, res: Response) => {
  const { mapData, mapName } = req.body;
  const userId = 1;
  await mapService.createMapInTab({ userId, mapData, mapName });
  res.json();
});

app.post('/save-map-mutation', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = 1;
  const mapId = 1;
  const mapData = {};
  await mapService.updateMapByClient({ workspaceId, mapId, mapData });

});

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
