import { injectable } from 'tsyringe';
import { PrismaClient } from '../generated/client';

@injectable()
export class WorkspaceRepository {
  constructor(private prisma: PrismaClient) {}

  async createWorkspace({ userId, mapId }: { userId: number; mapId: number }) {
    return this.prisma.workspace.create({
      data: { userId, mapId },
      select: { id: true },
    });
  }

  async getWorkspaceById({ workspaceId }: { workspaceId: number }) {
    return this.prisma.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: {
        mapId: true,
        userId: true,
      },
    });
  }

  async getWorkspacesOfUser({ userId }: { userId: number }) {
    return this.prisma.workspace.findMany({
      where: { User: { id: userId } },
      select: { id: true },
    });
  }

  async getWorkspacesOfUsers({ userIds }: { userIds: number[] }) {
    return this.prisma.workspace.findMany({
      where: { User: { id: { in: userIds } } },
      select: { id: true },
    });
  }

  async getWorkspacesOfMap({ mapId }: { mapId: number }) {
    return this.prisma.workspace.findMany({
      where: { User: { Tab: { mapIds: { has: mapId } } } },
      select: { id: true },
    });
  }

  async getWorkspacesOfMapGraph({ mapId }: { mapId: number }) {
    return this.prisma.workspace.findMany({
      where: { Map: { id: mapId } },
      select: { id: true },
    });
  }

  async getWorkspacesWithNoMap() {
    return this.prisma.workspace.findMany({
      where: { Map: null },
      select: { id: true },
    });
  }

  async addMapToWorkspace({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { mapId },
    });
  }

  async removeMapFromWorkspaces({ mapId }: { mapId: number }): Promise<void> {
    await this.prisma.workspace.updateMany({
      where: { mapId },
      data: {
        mapId: undefined,
      },
    });
  }

  async deleteWorkspace({ workspaceId }: { workspaceId: number }) {
    try {
      await this.prisma.workspace.delete({ where: { id: workspaceId } });
    } catch (e) {
      console.error('delete workspace error');
    }
  }

  async deleteWorkspacesAll() {
    await this.prisma.workspace.deleteMany();
  }
}
