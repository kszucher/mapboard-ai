import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import { container } from 'tsyringe';
import { DistributionController } from './distribution/distribution.controller';
import { DistributionService } from './distribution/distribution.service';
import { PrismaClient } from './generated/client';
import { EdgeTypeController } from './edge-type/edge-type.controller';
import { EdgeTypeRepository } from './edge-type/edge-type.repository';
import { EdgeTypeService } from './edge-type/edge-type.service';
import { EdgeRepository } from './edge/edge.repository';
import { MapController } from './map/map.controller';
import { MapRepository } from './map/map.repository';
import { MapService } from './map/map.service';
import { NodeTypeController } from './node-type/node-type.controller';
import { NodeTypeRepository } from './node-type/node-type.repository';
import { NodeTypeService } from './node-type/node-type.service';
import { NodeRepository } from './node/node.repository';
import { ShareController } from './share/share.controller';
import { ShareRepository } from './share/share.repository';
import { ShareService } from './share/share.service';
import { TabController } from './tab/tab.controller';
import { TabRepository } from './tab/tab.repository';
import { TabService } from './tab/tab.service';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import { WorkspaceController } from './workspace/workspace.controller';
import { WorkspaceRepository } from './workspace/workspace.repository';
import { WorkspaceService } from './workspace/workspace.service';

export interface MapBoardConfig {
  port?: number;
  env?: Record<string, string>;
}

export class MapBoard {
  public app: express.Express;
  public prismaClient: PrismaClient;

  public userService: UserService;
  public mapService: MapService;
  public tabService: TabService;
  public shareService: ShareService;
  public workspaceService: WorkspaceService;
  public distributionService: DistributionService;

  constructor(private config: MapBoardConfig = {}) {
    if (config.env) {
      for (const key in config.env) {
        process.env[key] = config.env[key];
      }
    }

    this.prismaClient = new PrismaClient();
    container.registerInstance(PrismaClient, this.prismaClient);

    container.registerSingleton(UserService);
    container.registerSingleton(UserRepository);
    container.registerSingleton(UserController);

    container.registerSingleton(MapService);
    container.registerSingleton(MapRepository);
    container.registerSingleton(MapController);

    container.registerSingleton(NodeRepository);

    container.registerSingleton(NodeTypeService);
    container.registerSingleton(NodeTypeRepository);
    container.registerSingleton(NodeTypeController);

    container.registerSingleton(EdgeRepository);

    container.registerSingleton(EdgeTypeService);
    container.registerSingleton(EdgeTypeRepository);
    container.registerSingleton(EdgeTypeController);

    container.registerSingleton(TabService);
    container.registerSingleton(TabRepository);
    container.registerSingleton(TabController);

    container.registerSingleton(ShareService);
    container.registerSingleton(ShareRepository);
    container.registerSingleton(ShareController);

    container.registerSingleton(WorkspaceService);
    container.registerSingleton(WorkspaceRepository);
    container.registerSingleton(WorkspaceController);

    container.registerSingleton(DistributionService);
    container.registerSingleton(DistributionController);

    this.userService = container.resolve(UserService);
    this.mapService = container.resolve(MapService);
    this.tabService = container.resolve(TabService);
    this.shareService = container.resolve(ShareService);
    this.workspaceService = container.resolve(WorkspaceService);
    this.distributionService = container.resolve(DistributionService);

    const userController = container.resolve(UserController);
    const mapController = container.resolve(MapController);
    const nodeTypeController = container.resolve(NodeTypeController);
    const edgeTypeController = container.resolve(EdgeTypeController);
    const tabController = container.resolve(TabController);
    const shareController = container.resolve(ShareController);
    const workspaceController = container.resolve(WorkspaceController);
    const distributionController = container.resolve(DistributionController);

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(userController.router);
    this.app.use(mapController.router);
    this.app.use(nodeTypeController.router);
    this.app.use(edgeTypeController.router);
    this.app.use(tabController.router);
    this.app.use(shareController.router);
    this.app.use(workspaceController.router);
    this.app.use(distributionController.router);
  }

  public async run() {
    await this.workspaceService.deleteWorkspaces();
    await this.mapService.clearProcessingAll();
    await this.distributionService.connectAndSubscribe();

    const port = this.config.port || Number(process.env.PORT) || 8083;
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
