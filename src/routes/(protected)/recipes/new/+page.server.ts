import { newRecipeSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { ingredients, recipeIngredients, recipes } from '$lib/server/db/schema/recipe';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { addIngredient } from '$lib/server/functions';

export const load = (async () => {
  return {
    form: await superValidate(
      {
        ingredients: [{ name: '', unit: 'cups', amount: 0 }],
      },
      newRecipeSchema
    ),
  };
}) satisfies PageServerLoad;

export const actions = {
  async default({ request }) {
    const form = await superValidate(request, newRecipeSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const data = form.data;

    const [{ recipeId }] = await db
      .insert(recipes)
      .values({
        name: data.name,
        description: data.description,
        notes: data.notes,
        url: data.url,
        instructions: data.instructions,
      })
      .returning({ recipeId: recipes.id });

    Promise.all(data.ingredients.map(async (ingredient) => addIngredient(recipeId, ingredient)));

    throw redirect(303, `/recipes/${recipeId}`);
  },
} satisfies Actions;
