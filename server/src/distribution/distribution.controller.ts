import { Request, Response, Router } from 'express';
import { distributionService } from '../server';

const router = Router();

router.get('/workspace_events/:workspaceId', (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  distributionService.addClient(req, res, workspaceId);
});

export default router;
