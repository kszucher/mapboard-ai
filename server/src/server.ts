import cors from 'cors';
import express, { Request, Response } from 'express';
import distributionController from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';
import { PrismaClient } from './generated/client';
import { MapExecuteDataFrameService } from './map/map-execute-data-frame.service';
import { MapExecuteFileService } from './map/map-execute-file.service';
import { MapExecuteIngestionService } from './map/map-execute-ingestion.service';
import { MapExecuteLlmService } from './map/map-execute-llm.service';
import { MapExecuteVectorDatabaseService } from './map/map-execute-vector-database.service';
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

export const distributionService: DistributionService = new DistributionService(
  () => workspaceService,
  process.env.REDIS_MAIN!
);

export const mapService: MapService = new MapService(
  prismaClient,
  () => tabService,
  () => workspaceService,
  () => distributionService,
  () => mapExecuteFileService,
  () => mapExecuteIngestionService,
  () => mapExecuteVectorDatabaseService,
  () => mapExecuteDataFrameService,
  () => mapExecuteLlmService
);

export const mapExecuteDataFrameService: MapExecuteDataFrameService = new MapExecuteDataFrameService();

export const mapExecuteFileService: MapExecuteFileService = new MapExecuteFileService(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!
);

export const mapExecuteIngestionService: MapExecuteIngestionService = new MapExecuteIngestionService();

export const mapExecuteLlmService: MapExecuteLlmService = new MapExecuteLlmService();

export const mapExecuteVectorDatabaseService: MapExecuteVectorDatabaseService = new MapExecuteVectorDatabaseService();

export const shareService: ShareService = new ShareService(
  prismaClient,
  () => workspaceService,
  () => distributionService
);

export const tabService: TabService = new TabService(
  prismaClient,
  () => workspaceService,
  () => distributionService
);

export const userService: UserService = new UserService(
  prismaClient,
  () => workspaceService,
  () => distributionService
);

export const workspaceService: WorkspaceService = new WorkspaceService(
  prismaClient,
  () => userService,
  () => mapService
);

(async () => {
  await workspaceService.deleteWorkspaces();
  await mapService.terminateProcesses();
  await distributionService.connectAndSubscribe();
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(distributionController);
app.use(mapController);
app.use(shareController);
app.use(tabController);
app.use(userController);
app.use(workspaceController);

app.get('/ping', async (req: Request, res: Response) => {
  console.log('ping');
  res.json('ping');
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
