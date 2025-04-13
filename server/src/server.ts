import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/client';

const app = express();
const prismaClient = new PrismaClient();

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

  const map = await prismaClient.map.create({
    data: {
      mapData,
      name: mapName,
      OwnerUser: { connect: { id: userId } },
    },
    select: { id: true },
  });

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      Tab: {
        update: {
          mapIds: {
            push: map.id,
          },
        },
      },
    },
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
