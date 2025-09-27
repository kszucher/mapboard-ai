import { Request, Response, Router } from 'express';
import { CreateWorkspaceResponseDto, UpdateWorkspaceMapRequestDto } from '../../../shared/src/api/api-types-workspace';
import { prismaClient, workspaceService } from '../server';
import { checkJwt, getUserIdAndWorkspaceId } from '../startup';

const router = Router();

router.post('/create-workspace', checkJwt, async (req: Request, res: Response) => {
  const user = await prismaClient.user.findFirstOrThrow({
    where: { sub: req.auth?.payload.sub ?? '' },
    select: { id: true },
  });
  const workspace = await workspaceService.createWorkspace({ userId: user.id });
  const response: CreateWorkspaceResponseDto = { workspaceId: workspace.id };
  res.json(response);
});

router.post('/update-workspace-map', checkJwt, getUserIdAndWorkspaceId, async (req: Request, res: Response) => {
  const { workspaceId } = req as any;
  const { mapId }: UpdateWorkspaceMapRequestDto = req.body;
  await workspaceService.updateWorkspaceMap({ workspaceId, mapId });
  res.json();
});

// TODO deleteWorkspace

export default router;
