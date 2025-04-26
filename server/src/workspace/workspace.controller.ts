import { Request, Response, Router } from 'express';
import { CreateWorkspaceResponseDto, UpdateWorkspaceResponseDto } from '../../../shared/src/api/api-types';
import { mapService } from '../map/map.controller';
import { checkJwt, getUserIdAndWorkspaceId, prismaClient } from '../startup';
import { WorkspaceService } from './workspace.service';

const router = Router();

export const workspaceService = new WorkspaceService(prismaClient, mapService);

router.post('/create-workspace', checkJwt, async (req: Request, res: Response) => {
  const { workspaceId } = await workspaceService.createWorkspace({ userSub: req.auth?.payload.sub ?? '' });
  const { userInfo, mapInfo, tabMapInfo, shareInfo } = await workspaceService.readWorkspace({ workspaceId });
  const response: CreateWorkspaceResponseDto = { workspaceId, userInfo, mapInfo, tabMapInfo, shareInfo };
  res.json(response);
});

router.post('/update-workspace-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = (req as any);
  const { mapId } = req.body;
  await workspaceService.updateWorkspaceMap(({ workspaceId, mapId }));
  const mapInfo = await mapService.readMap({ workspaceId });
  res.json({ mapInfo } as UpdateWorkspaceResponseDto);
});

export default router;
