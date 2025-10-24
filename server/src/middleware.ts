import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

let checkJwtInstance: any = null;

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  if (!checkJwtInstance) {
    checkJwtInstance = auth({
      audience: process.env.NODE_ENV ? process.env.AUTH0_REMOTE_URL : process.env.AUTH0_LOCAL_URL,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    });
  }
  return checkJwtInstance(req, res, next);
};

export const getWorkspaceId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    (req as any).workspaceId = Number(req.headers['workspace-id']);

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
