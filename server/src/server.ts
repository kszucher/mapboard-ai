import cors from 'cors';
import express, { Request, Response } from 'express';
import { AiService } from './ai/ai.service';
import distributionController from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';
import { FileService } from './file/file.service';
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
export const aiService: AiService = new AiService(
  process.env.NODE_PY_SECRET!,
  process.env.PYTHON_URL!,
);
export const userService: UserService = new UserService(
  prismaClient,
  () => workspaceService,
  () => distributionService,
);
export const mapService: MapService = new MapService(
  prismaClient,
  () => tabService,
  () => workspaceService,
  () => distributionService,
  () => fileService,
  () => aiService,
);
export const fileService: FileService = new FileService(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!,
);
export const tabService: TabService = new TabService(
  prismaClient,
  () => workspaceService,
  () => distributionService,
);
export const shareService: ShareService = new ShareService(
  prismaClient,
  () => workspaceService,
  () => distributionService,
);
export const workspaceService: WorkspaceService = new WorkspaceService(
  prismaClient,
  () => userService,
  () => mapService,
);
export const distributionService: DistributionService = new DistributionService(
  () => workspaceService,
  process.env.REDIS_MAIN!,
);

(async () => {
  await workspaceService.deleteWorkspaces();
  await mapService.terminateProcesses();
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


const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
