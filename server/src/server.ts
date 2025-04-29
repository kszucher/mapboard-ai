import cors from 'cors';
import express, { Request, Response } from 'express';
import { PgCdcService } from './db-utils/pg.cdc.service';
import { PgFunctionsService } from './db-utils/pg.functions.service';
import mapController from './map/map.controller';
import { MapService } from './map/map.service';
import shareController from './share/share.controller';
import { ShareService } from './share/share.service';
import { pgClient, prismaClient } from './startup';
import tabController from './tab/tab.controller';
import { TabService } from './tab/tab.service';
import userController from './user/user.controller';
import { UserService } from './user/user.service';
import workspaceController from './workspace/workspace.controller';
import { WorkspaceService } from './workspace/workspace.service';

const pgFunctionsService = new PgFunctionsService(prismaClient);
const pgCdcService = new PgCdcService(pgClient, prismaClient);
export const userService: UserService = new UserService(prismaClient);
export const mapService: MapService = new MapService(prismaClient, () => tabService, () => workspaceService);
export const tabService: TabService = new TabService(prismaClient);
export const shareService: ShareService = new ShareService(prismaClient);
export const workspaceService: WorkspaceService = new WorkspaceService(prismaClient, () => userService, () => mapService, () => tabService);

(async () => {
  await pgFunctionsService.setupFunctions();
  await pgCdcService.setupListenNotify();
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userController);
app.use(mapController);
app.use(tabController);
app.use(shareController);
app.use(workspaceController);

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

app.get('/map_events/:map_id', async (req, res) => {

  const mapId = parseInt(req.params.map_id);

  console.log('runs... on mapId: ', mapId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const client = { mapId, res };
  pgCdcService.addClient(client);

  req.on('close', async () => {
    console.log('...stops');
    pgCdcService.deleteClient(client);
    res.end();
  });
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
