import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    recipes: await db.query.recipes.findMany()
  };
}) satisfies PageServerLoad;
