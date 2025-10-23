import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class MapNodeConfigRepository {
  constructor(private prisma: PrismaClient) {}
}
