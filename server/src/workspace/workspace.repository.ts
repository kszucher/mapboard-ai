import { PrismaClient } from '../generated/client';

export class WorkspaceRepository {
  constructor(private prisma: PrismaClient) {}

  async getWorkspaceIdsOfUser({ userId }: { userId: number }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { User: { id: userId } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async getWorkspaceIdsOfUsers({ userIds }: { userIds: number[] }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { User: { id: { in: userIds } } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async getWorkspaceIdsOfMap({ mapId }: { mapId: number }) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { Map: { id: mapId } },
      select: { id: true },
    });
    return workspaces.map(el => el.id);
  }

  async removeMapFromWorkspaces({ mapId }: { mapId: number }): Promise<void> {
    await this.prisma.workspace.updateMany({
      where: { mapId },
      data: {
        mapId: undefined,
      },
    });
  }

  async addMapToWorkspace({ workspaceId, mapId }: { workspaceId: number; mapId: number }) {
    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { mapId },
    });
  }

  async deleteWorkspace({ workspaceId }: { workspaceId: number }) {
    try {
      await this.prisma.workspace.delete({ where: { id: workspaceId } });
    } catch (e) {
      console.error('delete workspace error');
    }
  }

  async deleteWorkspaces() {
    await this.prisma.workspace.deleteMany();
  }
}
