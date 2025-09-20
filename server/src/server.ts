import cors from 'cors';
import express, { Request, Response } from 'express';
import distributionController from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';
import { PrismaClient } from './generated/client';
import { MapNodeContextService } from './map/map-node-context.service';
import { MapNodeDataFrameService } from './map/map-node-data-frame.service';
import { MapNodeFileService } from './map/map-node-file.service';
import { MapNodeIngestionService } from './map/map-node-ingestion.service';
import { MapNodeLlmService } from './map/map-node-llm.service';
import { MapNodeQuestionService } from './map/map-node-question.service';
import { MapNodeVectorDatabaseService } from './map/map-node-vector-database.service';
import { MapNodeVisualizerService } from './map/map-node-visualizer.service';
import { MapNodeService } from './map/map-node.service';
import mapController from './map/map.controller';
import { MapRepository } from './map/map.repository';
import { MapService } from './map/map.service';
import shareController from './share/share.controller';
import { ShareService } from './share/share.service';
import tabController from './tab/tab.controller';
import { TabRepository } from './tab/tab.repository';
import { TabService } from './tab/tab.service';
import userController from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import workspaceController from './workspace/workspace.controller';
import { WorkspaceRepository } from './workspace/workspace.repository';
import { WorkspaceService } from './workspace/workspace.service';

export const prismaClient = new PrismaClient();

export const distributionService: DistributionService = new DistributionService(
  () => workspaceRepository,
  process.env.REDIS_MAIN!
);

export const mapService: MapService = new MapService(
  prismaClient,
  () => mapRepository,
  () => tabRepository,
  () => tabService,
  () => workspaceRepository,
  () => distributionService,
  () => mapNodeFileService,
  () => mapNodeIngestionService,
  () => mapNodeContextService,
  () => mapNodeQuestionService,
  () => mapNodeVectorDatabaseService,
  () => mapNodeDataFrameService,
  () => mapNodeLlmService,
  () => mapNodeVisualizerService
);

export const mapRepository: MapRepository = new MapRepository(prismaClient);

export const mapNodeService: MapNodeService = new MapNodeService(prismaClient);

export const mapNodeFileService: MapNodeFileService = new MapNodeFileService(prismaClient, () => mapNodeService);

export const mapNodeIngestionService: MapNodeIngestionService = new MapNodeIngestionService(
  prismaClient,
  () => mapNodeService
);

export const mapNodeContextService: MapNodeContextService = new MapNodeContextService(
  prismaClient,
  () => mapNodeService
);

export const mapNodeQuestionService: MapNodeQuestionService = new MapNodeQuestionService(
  prismaClient,
  () => mapNodeService
);

export const mapNodeVectorDatabaseService: MapNodeVectorDatabaseService = new MapNodeVectorDatabaseService(
  prismaClient,
  () => mapNodeService
);

export const mapNodeDataFrameService: MapNodeDataFrameService = new MapNodeDataFrameService(
  prismaClient,
  () => mapNodeService,
  () => mapNodeFileService
);

export const mapNodeLlmService: MapNodeLlmService = new MapNodeLlmService(
  prismaClient,
  () => mapNodeService,
  () => workspaceRepository,
  () => distributionService
);

export const mapNodeVisualizerService: MapNodeVisualizerService = new MapNodeVisualizerService(
  prismaClient,
  () => mapNodeService,
  () => workspaceRepository,
  () => distributionService
);

export const shareService: ShareService = new ShareService(
  prismaClient,
  () => workspaceRepository,
  () => distributionService
);

export const tabService: TabService = new TabService(
  prismaClient,
  () => tabRepository,
  () => workspaceRepository,
  () => distributionService
);

export const tabRepository: TabRepository = new TabRepository(prismaClient);

export const userService: UserService = new UserService(prismaClient, () => userRepository);

export const userRepository: UserRepository = new UserRepository(prismaClient);

export const workspaceService: WorkspaceService = new WorkspaceService(
  prismaClient,
  () => workspaceRepository,
  () => userRepository,
  () => mapRepository,
  () => tabRepository
);

export const workspaceRepository: WorkspaceRepository = new WorkspaceRepository(prismaClient);

(async () => {
  await workspaceRepository.deleteWorkspaces();
  await mapRepository.terminateProcesses();
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
