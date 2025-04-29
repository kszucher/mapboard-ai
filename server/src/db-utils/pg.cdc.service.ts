import express from 'express';
import { Client as PgClient } from 'pg';
import { PrismaClient } from '../generated/client';

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
      CREATE OR REPLACE FUNCTION notify_map_change()
      RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('map_change', COALESCE(NEW.id, OLD.id)::text);
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    await this.prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS map_change_update_trigger ON "Map";
    `);

    await this.prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS map_change_delete_trigger ON "Map";
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TRIGGER map_change_update_trigger
      AFTER UPDATE ON "Map"
      FOR EACH ROW
      WHEN (OLD."updatedAt" IS DISTINCT FROM NEW."updatedAt")
      EXECUTE FUNCTION notify_map_change();
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TRIGGER map_change_delete_trigger
      AFTER DELETE ON "Map"
      FOR EACH ROW
      EXECUTE FUNCTION notify_map_change();
    `);

    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
      console.log('📨 NOTIFY received:', msg);

      try {
        const mapId = parseInt(msg.payload as string);

        // Try to fetch the map from the database
        const map = await this.prisma.map.findUnique({ where: { id: mapId } });

        if (!map) {
          // 🔥 Map was deleted
          for (const client of this.clients) {
            if (client.mapId === mapId) {
              console.log('map deleted match');
              client.res.write(`event: mapDelete\n\n`);
              client.res.write(`data: ${JSON.stringify({ op: 'mapDelete', id: mapId })}\n\n`);
            }
          }

          return; // nothing more to do
        }

        // ✅ Map exists — it's an update
        for (const client of this.clients) {
          if (client.mapId === mapId) {
            console.log('map updated match');

            console.timeEnd('Save Map');

            client.res.write(`event: mapUpdate\n\n`);
            client.res.write(`data: ${JSON.stringify({ op: 'mapUpdate', id: mapId })}\n\n`);
          }
        }

      } catch (e) {
        console.error('❌ Error handling NOTIFY event:', e);
      }
    });

    this.pgClient.on('error', (err) => {
      console.error('Postgres client error:', err);
    });

    this.pgClient.on('end', () => {
      console.error('Postgres client end');
    });

    await this.pgClient.query('LISTEN map_change');

  }

  addClient(client: Client) {
    this.clients.add(client);
  }


  deleteClient(client: Client) {
    this.clients.delete(client);
  }
}
