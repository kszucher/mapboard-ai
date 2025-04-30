import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { createClient, RedisClientType } from 'redis';
import { WORKSPACE_EVENT } from '../../../shared/src/api/api-types-distribution';

export interface RedisEventPayload {
  type: WORKSPACE_EVENT;
  payload: Record<string, any>;
}

export interface RedisEventMessage {
  workspaceId: number;
  event: RedisEventPayload;
}

type ClientInfo = {
  res: Response;
  workspaceId: number;
};

export class DistributionService {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private clients = new Map<string, ClientInfo>();
  private readonly channel: string;

  constructor(redisUrl: string, channel = 'workspace_updates') {
    this.publisher = createClient({ url: redisUrl });
    this.subscriber = this.publisher.duplicate();
    this.channel = channel;
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

  async publish(workspaceIds: number[], event: RedisEventPayload) {
    for (const workspaceId of workspaceIds) {
      const msg: RedisEventMessage = { workspaceId, event };
      await this.publisher.publish(this.channel, JSON.stringify(msg));
    }
  }

  // addClient(req: Request, res: Response, workspaceId: number) {
  //   const clientId = randomUUID();
  //   // Set SSE headers
  //   res.writeHead(200, {
  //     'Content-Type': 'text/event-stream',
  //     'Cache-Control': 'no-cache',
  //     // Connection: 'keep-alive',
  //   });
  //   res.write('\n'); // keep the connection open
  //
  //   this.clients.set(clientId, { res, workspaceId });
  //
  //   req.on('close', () => {
  //     this.clients.delete(clientId);
  //   });
  // }

  addClient(req: Request, res: Response, workspaceId: number) {
    const clientId = randomUUID();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.flushHeaders?.();
    // initial heartbeat & retry interval
    res.write(':\n\n');
    res.write('retry: 5000\n\n');

    this.clients.set(clientId, { res, workspaceId });
    req.on('close', () => this.clients.delete(clientId));
  }


  private broadcast(message: RedisEventMessage) {
    for (const { res, workspaceId } of this.clients.values()) {
      if (workspaceId === message.workspaceId) {
        // const payload = {
        //   event_id: message.event.type,
        //   payload: message.event.payload,
        // };
        // res.write(`data: ${JSON.stringify(payload)}\n\n`);
        // inside broadcast():
        res.write(`event: ${message.event.type}\n`);
        res.write(`data: ${JSON.stringify(message.event.payload)}\n\n`);

      }
    }
  }
}
