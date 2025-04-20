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
    CREATE OR REPLACE FUNCTION notify_map_update()
    RETURNS TRIGGER AS $$
    BEGIN
      RAISE NOTICE '🔥 Trigger fired for map id: %', NEW.id;
      PERFORM pg_notify('map_update', NEW.id::text);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    await this.prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS map_update_trigger ON "Map";
  `);

    await this.prisma.$executeRawUnsafe(`
    CREATE TRIGGER map_update_trigger
    AFTER UPDATE ON "Map"
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE PROCEDURE notify_map_update();
  `);


    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
      console.log('📨 NOTIFY received:', msg);

      const mapId = parseInt(msg.payload as string);
      const map = await this.prisma.map.findUnique({ where: { id: mapId } });

      if (!map) return;

      for (const client of this.clients) {
        if (client.mapId === mapId) {
          client.res.write(`event: mapUpdate\n`);
          client.res.write(`data: ${JSON.stringify(map)}\n\n`);
        }
      }
    });

    this.pgClient.on('error', (err) => {
      console.error('Postgres client error:', err);
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
