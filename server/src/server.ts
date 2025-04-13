import { PrismaClient } from './generated/client'

import express, { Request, Response } from 'express';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  // const user = await prisma.user.create({
  //   data: { name, email },
  // });
  // res.json(user);
});


app.post('/create-map-in-tab-mutation', async (req: Request, res: Response) => {
  const {} = req.body;

  const userId = 1;
  const mapData = {};
  const mapName = '';

  const x = 5 as number

  const user = await prisma.map.create({
    data: {
      mapData,
      name: mapName,
      OwnerUser: {
        connect: { id: userId },
      },
    },
  });
  res.json(user);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
