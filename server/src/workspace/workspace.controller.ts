import { Request, Response, Router } from 'express';
import { WorkspaceUpdateResponseDto } from '../../../shared/types/api-state-types';
import { mapService } from '../map/map.controller';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { WorkspaceService } from './workspace.service';

const router = Router();

export const workspaceService = new WorkspaceService(prismaClient, mapService);

router.post('/workspace-update', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const { mapId } = req.body;
  await workspaceService.updateWorkspace(({ workspaceId, mapId }));
  const mapInfo = await mapService.readMap({ workspaceId });
  res.json({ mapInfo } as WorkspaceUpdateResponseDto);
});

export default router;
