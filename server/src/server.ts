import express, { Request, Response, NextFunction } from 'express';
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

const getUserIdAndWorkspaceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: { sub: req.auth?.payload.sub ?? '' },
      select: { id: true },
    });

    const workspaceId = parseInt(req.headers['workspace-id'] as string);

    (req as any).userId = user.id;
    (req as any).workspaceId = workspaceId;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); // no need to return
  }
};

const app = express();

app.use(cors());

app.use(express.json());

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

app.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  const workspaceId = await userService.signIn({ userSub: req.auth?.payload.sub ?? '' });
  res.json({ workspaceId });
});

app.post('/get-user-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const userInfo = await userService.readUser({ workspaceId });
  res.json(userInfo);
});

app.post('/get-map-info', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { userId, workspaceId } = (req as any);
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

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
