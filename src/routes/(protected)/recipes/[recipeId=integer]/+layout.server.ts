import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import DOMPurify from 'isomorphic-dompurify';

export const load = (async ({ params }) => {
  const recipe = await db.query.recipes
    .findFirst({
      with: {
        recipesIngredients: { with: { ingredient: { with: { conversions: true } } } },
        recipesTags: { with: { tag: true } },
      },
      where: (table, { eq }) => eq(table.id, +params.recipeId),
    })
    .then((r) => ({ ...r, instructions: DOMPurify.sanitize(r?.instructions || '') }));

  if (!recipe) {
    error(404, 'Not Found');
  }
  return {
    recipe,
    title: recipe.name,
  };
}) satisfies LayoutServerLoad;
