import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import Google from '@auth/core/providers/google';
import { env } from '$env/dynamic/private';
import DrizzleAdapter from '$lib/auth/drizzle-adapter';
import db from '$lib/db';

export const handle = SvelteKitAuth({
	providers: [Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET })],
	adapter: DrizzleAdapter(db)
}) satisfies Handle;
