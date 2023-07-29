import type { Adapter } from '@auth/core/adapters';
import type { DbClient } from '../db';
import { accounts, sessions, users, verificationTokens } from '../db/schema/auth';
import { and, eq } from 'drizzle-orm';

export default function DrizzleAdapter(client: DbClient): Adapter {
	return {
		async createUser(user) {
			return client
				.insert(users)
				.values(user)
				.returning()
				.then((u) => u[0]);
		},
		async getUser(id) {
			return (await client.query.users.findFirst({ where: eq(users.id, id) })) || null;
		},
		async getUserByEmail(email) {
			return (await client.query.users.findFirst({ where: eq(users.email, email) })) || null;
		},
		async getUserByAccount({ providerAccountId, provider }) {
			return client.query.users
				.findFirst({
					with: { accounts: true },
					where: and(
						eq(accounts.providerAccountId, providerAccountId),
						eq(accounts.provider, provider)
					)
				})
				.then((u) => u || null);
		},
		async updateUser(user) {
			return client
				.update(users)
				.set(user)
				.where(eq(users.id, user.id))
				.returning()
				.then((u) => u[0]);
		},
		async deleteUser(userId) {
			await client.delete(users).where(eq(users.id, userId)).returning();
		},
		async linkAccount(account) {
			await client
				.insert(accounts)
				.values(account)
				.returning()
				.then((a) => a[0]);
		},
		async unlinkAccount({ providerAccountId, provider }) {
			await client
				.delete(accounts)
				.where(
					and(eq(accounts.provider, provider), eq(accounts.providerAccountId, providerAccountId))
				);
		},
		async createSession(session) {
			return client
				.insert(sessions)
				.values(session)
				.returning()
				.then((s) => s[0]);
		},
		async getSessionAndUser(sessionToken) {
			const session = await client.query.sessions.findFirst({
				with: { user: true },
				where: eq(sessions.sessionToken, sessionToken)
			});

			if (session) {
				return {
					session,
					user: session.user
				};
			}

			return null;
		},
		async updateSession(session) {
			return client
				.update(sessions)
				.set(session)
				.where(eq(sessions.sessionToken, session.sessionToken))
				.returning()
				.then((s) => s[0]);
		},
		async deleteSession(sessionToken) {
			await client.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
		},
		async createVerificationToken(verificationToken) {
			return client
				.insert(verificationTokens)
				.values(verificationToken)
				.returning()
				.then((vt) => vt[0]);
		},
		async useVerificationToken({ identifier, token }) {
			return client
				.select()
				.from(verificationTokens)
				.where(
					and(eq(verificationTokens.identifier, identifier), eq(verificationTokens.token, token))
				)
				.then((vt) => vt[0]);
		}
	};
}
