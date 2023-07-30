import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
