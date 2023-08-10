import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import db from '$lib/server/db';
import { seedDB } from '$lib/server/db/seed';

if (!building && env.NODE_ENV !== 'production') {
  await seedDB(db);
}

if (!env.PAGE_LOGIN) {
  console.error('"PAGE_LOGIN" environment variable must be set');
  process.exit(1);
}
