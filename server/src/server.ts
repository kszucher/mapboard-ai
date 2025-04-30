import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import distributionController from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';
import { PrismaClient } from './generated/client';
import mapController from './map/map.controller';
import { MapService } from './map/map.service';
import shareController from './share/share.controller';
import { ShareService } from './share/share.service';
import tabController from './tab/tab.controller';
import { TabService } from './tab/tab.service';
import userController from './user/user.controller';
import { UserService } from './user/user.service';
import workspaceController from './workspace/workspace.controller';
import { WorkspaceService } from './workspace/workspace.service';


export const prismaClient = new PrismaClient();
export const userService: UserService = new UserService(prismaClient);
export const mapService: MapService = new MapService(prismaClient, () => tabService, () => workspaceService, () => distributionService);
export const tabService: TabService = new TabService(prismaClient);
export const shareService: ShareService = new ShareService(prismaClient);
export const workspaceService: WorkspaceService = new WorkspaceService(prismaClient, () => userService, () => mapService, () => tabService);
export const distributionService: DistributionService = new DistributionService(process.env.REDIS_MAIN!);

(async () => {
  await distributionService.connectAndSubscribe();
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userController);
app.use(mapController);
app.use(tabController);
app.use(shareController);
app.use(workspaceController);
app.use(distributionController);

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

export const checkJwt = auth({
  audience: process.env.NODE_ENV
    ? process.env.AUTH0_REMOTE_URL
    : process.env.AUTH0_LOCAL_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export const getUserIdAndWorkspaceId = async (
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

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
