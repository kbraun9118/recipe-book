import { integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name'),
	email: text('email'),
	emailVerified: timestamp('email_verified'),
	image: text('image')
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	sessions: many(sessions)
}));

export const accounts = pgTable('accounts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('userId').notNull(),
	type: text('type').notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('provider_account_id').notNull(),
	refreshToken: text('refresh_token'),
	accessToken: text('access_token'),
	expiresAt: integer('expires_at'),
	tokenType: text('token_type'),
	scope: text('scope'),
	idToken: text('id_token'),
	sessionState: text('session_state')
});

export const accountsRelations = relations(accounts, ({ one }) => ({
	account: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom(),
	sessionToken: text('session_token').notNull(),
	userId: uuid('user_id').notNull(),
	expires: timestamp('expires')
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	account: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const verificationTokens = pgTable(
	'verification_tokens',
	{
		identifier: uuid('identifier').primaryKey(),
		token: text('token').unique().notNull(),
		expires: timestamp('expires').notNull()
	},
	(t) => ({
		identifier_token_unique: unique().on(t.token, t.identifier)
	})
);
