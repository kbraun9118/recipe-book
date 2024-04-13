import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import * as recipe from './recipe';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';

export const schema = {
  ...recipe,
};

export type DbTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
