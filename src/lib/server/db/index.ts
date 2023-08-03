import { env } from '$env/dynamic/private';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { schema } from './schema';

export type DbClient = NodePgDatabase<typeof schema>;

const globalForDrizzle = globalThis as unknown as {
  db: DbClient | undefined;
};

export const dbClient = new pg.Client({
  connectionString: env.DATABASE_URL || '',
});

const isProd = env.NODE_ENV === 'production';

const db = globalForDrizzle.db ?? drizzle(dbClient, { schema, logger: !isProd });

if (!isProd) globalForDrizzle.db = db;

export default db;
