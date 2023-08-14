import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { DATABASE_URL } from '$env/static/private';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './schema';
import { seedDB } from './seed';

export type DbClient = PostgresJsDatabase<typeof schema>;

const isNotProd = env.ENVIRONMENT !== 'production';

const db = drizzle(postgres(DATABASE_URL || env.DATABASE_URL), { schema, logger: isNotProd });

if (building || isNotProd) {
  const migrationDb = drizzle(postgres(DATABASE_URL || env.DATABASE_URL, { max: 1 }));
  await migrate(db, { migrationsFolder: 'migrations' });

  if (!building) {
    await seedDB(migrationDb);
  }
}

export default db;
