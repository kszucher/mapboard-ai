import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = auth({
  audience: process.env.NODE_ENV ? process.env.AUTH0_REMOTE_URL : process.env.AUTH0_LOCAL_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export const getWorkspaceId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    (req as any).workspaceId = Number(req.headers['workspace-id']);

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); // no need to return
  }
};
