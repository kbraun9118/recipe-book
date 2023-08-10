import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { DATABASE_URL } from '$env/static/private';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './schema';

export type DbClient = PostgresJsDatabase<typeof schema>;

const globalForDrizzle = globalThis as unknown as {
  db: DbClient | undefined;
};

const isProd = env.NODE_ENV === 'production';

const db =
  globalForDrizzle.db ??
  drizzle(postgres(env.DATABASE_URL || DATABASE_URL), { schema, logger: !isProd });

if (building) {
  postgres(env.DATABASE_URL || DATABASE_URL, { max: 1 });
  await migrate(db, { migrationsFolder: 'migrations' });
}

if (!isProd) globalForDrizzle.db = db;

export default db;
