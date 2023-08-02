import { env } from '$env/dynamic/private';
import db, { dbClient } from '$lib/server/db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

await dbClient.connect();

await migrate(db, { migrationsFolder: 'migrations' });

if (!env.PAGE_LOGIN) {
  console.error('"PAGE_LOGIN" environment variable must be set');
  process.exit(1);
}
