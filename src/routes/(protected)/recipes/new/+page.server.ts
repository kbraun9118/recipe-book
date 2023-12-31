import { newRecipeSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { recipes } from '$lib/server/db/schema/recipe';
import { addIngredient, addTagsToRecipe } from '$lib/server/functions';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    form: await superValidate(
      {
        ingredients: [{ name: '', unit: 'cups', amount: 0 }],
      },
      newRecipeSchema,
      { errors: false },
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

    await Promise.all(
      data.ingredients.map(async (ingredient) => addIngredient(recipeId, ingredient)),
    );
    await addTagsToRecipe(recipeId, data.tags);

    throw redirect(303, `/recipes/${recipeId}`);
  },
} satisfies Actions;
