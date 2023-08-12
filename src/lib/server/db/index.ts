import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { DATABASE_URL } from '$env/static/private';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './schema';
import { seedDB } from './seed';

export type DbClient = PostgresJsDatabase<typeof schema>;

const isProd = env.NODE_ENV === 'production';

const db = drizzle(postgres(env.DATABASE_URL || DATABASE_URL), { schema, logger: !isProd });

if (building || !isProd) {
  const migrationDb = drizzle(postgres(env.DATABASE_URL || DATABASE_URL, { max: 1 }));
  console.log('migrating');
  await migrate(migrationDb, { migrationsFolder: 'migrations' });

  if (!isProd) {
    console.log('seeding');
    seedDB(migrationDb);
  }
}

export default db;
