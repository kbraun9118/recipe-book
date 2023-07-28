import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name'),
	email: text('email'),
	emailVerified: timestamp('email_verified'),
	image: text('image')
});

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

export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom(),
	sessionToken: text('session_token').notNull(),
	userId: uuid('user_id').notNull(),
	expires: timestamp('expires')
});

export const verificationTokens = pgTable('verification_tokens', {
	identifier: uuid('identifier').primaryKey(),
	token: text('token').unique().notNull(),
	expires: timestamp('expires').notNull()
}, {
    identifier_token_unique: () => {}
});
