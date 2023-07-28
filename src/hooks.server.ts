import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import Google from '@auth/core/providers/google';
import { env } from '$env/dynamic/private';


export const handle = SvelteKitAuth({
    providers: [
        Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRE })
    ],
    
}) satisfies Handle;