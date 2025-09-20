import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { createClient, RedisClientType } from 'redis';
import { injectable } from 'tsyringe';
import { SSE_EVENT } from '../../../shared/src/api/api-types-distribution';
import { WorkspaceRepository } from '../workspace/workspace.repository';

export interface RedisEventMessage {
  workspaceId: number;
  event: SSE_EVENT;
}

type ClientInfo = {
  res: Response;
  workspaceId: number;
};

@injectable()
export class DistributionService {
  private publisher?: any;
  private subscriber?: any;
  private clients = new Map<string, ClientInfo>();
  private readonly channel = 'workspace_updates';

  constructor(private workspaceRepository: WorkspaceRepository) {}

  async connectAndSubscribe() {
    console.log('attempt');
    // Create clients lazily
    this.publisher = createClient({ url: process.env.REDIS_MAIN! });
    this.subscriber = this.publisher.duplicate();

    await this.publisher.connect();
    await this.subscriber.connect();

    await this.subscriber.subscribe(this.channel, (message: string) => {
      try {
        const msg: RedisEventMessage = JSON.parse(message);
        this.broadcast(msg);
      } catch (err) {
        console.error('Failed to parse Redis message:', err);
      }
    });
  }

  async publish(workspaceIds: number[], event: SSE_EVENT) {
    if (!this.publisher) {
      throw new Error('Redis publisher not initialized. Call connectAndSubscribe first.');
    }

    for (const workspaceId of workspaceIds) {
      const msg: RedisEventMessage = { workspaceId, event };
      await this.publisher.publish(this.channel, JSON.stringify(msg));
    }
  }

  addClient(req: Request, res: Response, workspaceId: number) {
    const clientId = randomUUID();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders?.();

    // Initial heartbeat & retry interval
    res.write(':\n\n');
    res.write('retry: 5000\n\n');

    this.clients.set(clientId, { res, workspaceId });

    req.on('close', async () => {
      console.log('killing workspace ', workspaceId);
      await this.workspaceRepository.deleteWorkspace({ workspaceId }); // optional, depends on your logic
      this.clients.delete(clientId);
    });
  }

  private broadcast(message: RedisEventMessage) {
    for (const { res, workspaceId } of this.clients.values()) {
      if (workspaceId === message.workspaceId) {
        res.write(`data: ${JSON.stringify(message.event)}\n\n`);
      }
    }
  }
}
