import { env } from '$env/dynamic/private';
import { DATABASE_URL } from '$env/static/private';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { schema } from './schema';
import { building } from '$app/environment';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export type DbClient = NodePgDatabase<typeof schema>;

const globalForDrizzle = globalThis as unknown as {
  db: DbClient | undefined;
};

export const dbClient = new pg.Client({
  connectionString: env.DATABASE_URL || DATABASE_URL,
});

const isProd = env.NODE_ENV === 'production';

const db = globalForDrizzle.db ?? drizzle(dbClient, { schema, logger: !isProd });

if (building) {
  await dbClient.connect();
  await migrate(db, { migrationsFolder: 'migrations' });
}

if (!isProd) globalForDrizzle.db = db;

export default db;
