import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/client';
import { MapService } from './map/map.service';

const app = express();
const prismaClient = new PrismaClient();

const mapService = new MapService(prismaClient);


app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
});

app.post('/create-map-in-tab-mutation', async (req: Request, res: Response) => {
  const {} = req.body;

  const userId = 1;
  const mapData = {};
  const mapName = '';

  await mapService.createMapInTab({
    userId,
    mapData,
    mapName,
  });

  res.json();
});

app.post('/save-map-mutation', async (req: Request, res: Response) => {
  const workspaceId = '1';
  const mapId = '1';
  const mapData = {};

  await prismaClient.$executeRawUnsafe(`
      UPDATE "Map"
      SET data = jsonb_merge_recurse(
              $1::jsonb,
              jsonb_diff_recurse(
                      "Map".data, (SELECT "map_data"
                                   FROM "Workspace"
                                   WHERE id = $2)))
      WHERE id = $3
  `, JSON.stringify(mapData), workspaceId, mapId);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
