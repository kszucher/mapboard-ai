import { Router } from 'express';
import { prismaClient } from '../startup';
import { TabService } from './tab.service';

const router = Router();
export const tabService = new TabService(prismaClient);

export default router;

// TODO moveUpMapInTab

// TODO moveDownMapInTab
