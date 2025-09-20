import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { container } from 'tsyringe';
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
import { MapNodeRepository } from './map/map-node.repository';
import { MapRepository } from './map/map.repository';
import { MapService } from './map/map.service';
import { ShareService } from './share/share.service';
import { TabRepository } from './tab/tab.repository';
import { TabService } from './tab/tab.service';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import { WorkspaceRepository } from './workspace/workspace.repository';
import { WorkspaceService } from './workspace/workspace.service';

export const prismaClient = new PrismaClient();

container.registerInstance('PrismaClient', prismaClient);

container.registerSingleton(WorkspaceRepository);
container.registerSingleton(MapRepository);
container.registerSingleton(TabRepository);
container.registerSingleton(UserRepository);

container.registerSingleton(DistributionService);
container.registerSingleton(MapNodeRepository);
container.registerSingleton(MapNodeFileService);
container.registerSingleton(MapNodeIngestionService);
container.registerSingleton(MapNodeContextService);
container.registerSingleton(MapNodeQuestionService);
container.registerSingleton(MapNodeVectorDatabaseService);
container.registerSingleton(MapNodeDataFrameService);
container.registerSingleton(MapNodeLlmService);
container.registerSingleton(MapNodeVisualizerService);
container.registerSingleton(ShareService);
container.registerSingleton(TabService);
container.registerSingleton(UserService);
container.registerSingleton(WorkspaceService);
container.registerSingleton(MapService);

export const workspaceRepository = container.resolve(WorkspaceRepository);
export const mapRepository = container.resolve(MapRepository);
export const tabRepository = container.resolve(TabRepository);
export const userRepository = container.resolve(UserRepository);

export const distributionService = container.resolve(DistributionService);
export const mapNodeService = container.resolve(MapNodeRepository);
export const mapNodeFileService = container.resolve(MapNodeFileService);
export const mapNodeIngestionService = container.resolve(MapNodeIngestionService);
export const mapNodeContextService = container.resolve(MapNodeContextService);
export const mapNodeQuestionService = container.resolve(MapNodeQuestionService);
export const mapNodeVectorDatabaseService = container.resolve(MapNodeVectorDatabaseService);
export const mapNodeDataFrameService = container.resolve(MapNodeDataFrameService);
export const mapNodeLlmService = container.resolve(MapNodeLlmService);
export const mapNodeVisualizerService = container.resolve(MapNodeVisualizerService);
export const shareService = container.resolve(ShareService);
export const tabService = container.resolve(TabService);
export const userService = container.resolve(UserService);
export const workspaceService = container.resolve(WorkspaceService);
export const mapService = container.resolve(MapService);

export { container };

(async () => {
  await workspaceRepository.deleteWorkspaces();
  await mapRepository.terminateProcesses();
  await distributionService.connectAndSubscribe();
})();

const app = express();

import distributionController from './distribution/distribution.controller';
import mapController from './map/map.controller';
import shareController from './share/share.controller';
import tabController from './tab/tab.controller';
import userController from './user/user.controller';
import workspaceController from './workspace/workspace.controller';

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
