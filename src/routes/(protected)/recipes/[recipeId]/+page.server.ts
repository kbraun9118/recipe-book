import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  return {
    recipe: await db.query.recipes.findFirst({
      with: { recipeIngredients: { with: { ingredient: true } } },
      where: (table, { eq }) => eq(table.id, +params.recipeId),
    }),
  };
}) satisfies PageServerLoad;
