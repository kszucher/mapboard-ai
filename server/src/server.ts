import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/client';

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  // const user = await prismaClient.user.create({
  //   data: { name, email },
  // });
  // res.json(user);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
