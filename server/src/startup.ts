import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { PrismaClient } from './generated/client';

export const prismaClient = new PrismaClient();

export const checkJwt = auth({
  audience: process.env.NODE_ENV
    ? process.env.AUTH0_REMOTE_URL
    : process.env.AUTH0_LOCAL_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export const getUserIdAndWorkspaceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: { sub: req.auth?.payload.sub ?? '' },
      select: { id: true },
    });

    const workspaceId = parseInt(req.headers['workspace-id'] as string);

    (req as any).userId = user.id;
    (req as any).workspaceId = workspaceId;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); // no need to return
  }
};
