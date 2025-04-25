import cors from 'cors';
import express, { Request, Response } from 'express';
import { PgCdcService } from './db-utils/pg.cdc.service';
import { PgFunctionsService } from './db-utils/pg.functions.service';
import mapController from './map/map.controller';
import shareController from './share/share.controller';
import { pgClient, prismaClient } from './startup';
import tabController from './tab/tab.controller';
import userController from './user/user.controller';
import workspaceController from './workspace/workspace.controller';

const pgFunctionsService = new PgFunctionsService(prismaClient);
const pgCdcService = new PgCdcService(pgClient, prismaClient);

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

  console.log('runs...');

  const mapId = parseInt(req.params.map_id);

  console.log(mapId);

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
