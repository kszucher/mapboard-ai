import { Router } from 'express';
import { prismaClient } from '../startup';
import { UserService } from './user.service';

const router = Router();
export const userService = new UserService(prismaClient);

export default router;
