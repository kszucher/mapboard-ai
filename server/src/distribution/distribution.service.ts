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
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private clients = new Map<string, ClientInfo>();
  private readonly channel: string;

  constructor(private workspaceRepository: WorkspaceRepository) {
    this.publisher = createClient({ url: process.env.REDIS_MAIN! });
    this.subscriber = this.publisher.duplicate();
    this.channel = 'workspace_updates';
  }

  async connectAndSubscribe() {
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
    // initial heartbeat & retry interval
    res.write(':\n\n');
    res.write('retry: 5000\n\n');

    this.clients.set(clientId, { res, workspaceId });
    req.on('close', async () => {
      console.log('killing workspace ', workspaceId);
      await this.workspaceRepository.deleteWorkspace({ workspaceId }); // is this really necessary here?
      this.clients.delete(clientId);
    });
  }

  private broadcast(message: RedisEventMessage) {
    for (const { res, workspaceId } of this.clients.values()) {
      if (workspaceId === message.workspaceId) {
        // res.write(`event: ${message.event.type}\n`);
        res.write(`data: ${JSON.stringify(message.event)}\n\n`);
      }
    }
  }
}
