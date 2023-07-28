import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const client = new Client({
	connectionString: env.DATABASE_URL
});

await client.connect();
const db = drizzle(client, { schema });

await migrate(db, { migrationsFolder: 'migrations' });

const todo = await db.select().from(schema.todos);

if (todo.length == 0) {
	await db.insert(schema.todos).values({ name: 'Thing' });
}

export default db;
