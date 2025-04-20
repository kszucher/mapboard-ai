import cors from 'cors';
import express, { Request, Response } from 'express';
import { prismaClient } from './startup';
import { PgFunctionsService } from './pg-functions/pg.functions.service';
import userController from './user/user.controller';
import mapController from './map/map.controller';
import tabController from './tab/tab.controller';
import shareController from './share/share.controller';
import workspaceController from './workspace/workspace.controller';
import signInController from './sign-in/sign-in.controller';
import { Client as PgClient } from 'pg';

const pgFunctionsService = new PgFunctionsService(prismaClient);

(async () => {
  await pgFunctionsService.setupFunctions();
})();

export const pgClient = new PgClient({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(userController);
app.use(mapController);
app.use(tabController);
app.use(shareController);
app.use(workspaceController);
app.use(signInController);

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});


const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
