import db from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    recipes: await db.query.recipes.findMany({ with: { recipesTags: { with: { tag: true } } } }),
  };
}) satisfies PageServerLoad;

export const actions = {
  logout: async ({ cookies }) => {
    cookies.delete('authorized');
  },
} satisfies Actions;
