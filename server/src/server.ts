import cors from 'cors';
import express, { Request, Response } from 'express';
import { prismaClient } from './startup';
import { PgFunctionsService } from './pg-functions/pg.functions.service';
import mapController from './map-service/map.controller';
import shareController from './share-service/share.controller';
import userController from './user-service/user.controller';

const pgFunctionsService = new PgFunctionsService(prismaClient);

(async () => {
  await pgFunctionsService.setupFunctions();
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userController);
app.use(mapController);
app.use(shareController);

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
