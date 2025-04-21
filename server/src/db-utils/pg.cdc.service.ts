import { Client as PgClient } from 'pg';
import { PrismaClient } from '../generated/client';
import express from 'express';

type Client = {
  mapId: number;
  res: express.Response;
};

export class PgCdcService {
  private clients = new Set<Client>();

  constructor(private pgClient: PgClient, private prisma: PrismaClient) {
  }

  async setupListenNotify() {

    await this.prisma.$executeRawUnsafe(`
  DROP TRIGGER IF EXISTS map_update_trigger ON "Map";
`);

    await this.prisma.$executeRawUnsafe(`
  CREATE OR REPLACE FUNCTION notify_map_update()
  RETURNS TRIGGER AS $$
  BEGIN
    PERFORM pg_notify('map_update', NEW.id::text);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

    await this.prisma.$executeRawUnsafe(`
  CREATE TRIGGER map_update_trigger
  AFTER UPDATE ON "Map"
  FOR EACH ROW
  WHEN (OLD."updatedAt" IS DISTINCT FROM NEW."updatedAt")
  EXECUTE FUNCTION notify_map_update();
`);

    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
        console.log('📨 NOTIFY received:', msg);

        try {
          const mapId = parseInt(msg.payload as string);
          const map = await this.prisma.map.findUnique({ where: { id: mapId } });

          if (!map) return;

          // console.log(this.clients);

          for (const client of this.clients) {
            if (client.mapId === mapId) {
              console.log('match');
              // client.res.write(`message: mapUpdate\n`);
              // client.res.write(`data: ${JSON.stringify(map)}\n\n`);
            }
          }


        } catch (e) {
          console.log('error');
        }
      },
    );

    this.pgClient.on('error', (err) => {
      console.error('Postgres client error:', err);
    });

    this.pgClient.on('end', () => {
      console.error('Postgres client end!!!:');
    });

    await this.pgClient.query('LISTEN map_update');


  }

  addClient(client: Client) {
    this.clients.add(client);
  }


  deleteClient(client: Client) {
    this.clients.delete(client);
  }
}
