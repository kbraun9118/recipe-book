import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { insertConversionsSchema } from '$lib/server/db/schema/recipe';
import db from '$lib/server/db';


export const load = (async () => {
    return {
        form: await superValidate(insertConversionsSchema),
        ingredients: await db.query.ingredients.findMany(),
    };
}) satisfies PageServerLoad;