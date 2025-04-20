import { Router } from 'express';
import { mapService } from '../map/map.controller';
import { prismaClient } from '../startup';
import { WorkspaceService } from './workspace.service';

const router = Router();

export const workspaceService = new WorkspaceService(prismaClient, mapService);

export default router;
