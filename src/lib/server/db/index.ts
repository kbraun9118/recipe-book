import { Client } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { schema } from './schema';
import { env } from '$env/dynamic/private';

export type DbClient = NodePgDatabase<typeof schema>;

const globalForDrizzle = globalThis as unknown as {
  db: DbClient | undefined;
};

const client = new Client({
  connectionString: env.DATABASE_URL,
});

if (!globalForDrizzle.db) {
  await client.connect();
}

const isProd = env.NODE_ENV === 'production';

const db = globalForDrizzle.db ?? drizzle(client, { schema, logger: !isProd });

if (!isProd) globalForDrizzle.db = db;

await migrate(db, { migrationsFolder: 'migrations' });

export default db;
