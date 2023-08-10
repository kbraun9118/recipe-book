import { newRecipeSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { recipeIngredients, recipes } from '$lib/server/db/schema/recipe';
import { addIngredient } from '$lib/server/functions';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const { recipe } = await parent();

  return {
    form: await superValidate(
      {
        name: recipe.name,
        url: recipe.url,
        description: recipe.description,
        notes: recipe.notes,
        instructions: recipe.instructions,
        ingredients: recipe.recipeIngredients.map((ri) => ({
          name: ri.ingredient.name,
          amount: ri.amount,
          unit: ri.ingredient.unit,
        })),
      },
      newRecipeSchema
    ),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const form = await superValidate(request, newRecipeSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const recipe = await db.query.recipes.findFirst({
      where: (t, { eq }) => eq(t.id, +params.recipeId),
      with: { recipeIngredients: { with: { ingredient: true } } },
    });

    const data = {
      ...form.data,
      ingredients: form.data.ingredients.map((i) => ({ ...i, name: i.name.trim().toLowerCase() })),
    };

    await db
      .update(recipes)
      .set({
        name: data.name,
        url: data.url,
        description: data.description,
        instructions: data.instructions,
        notes: data.notes,
      })
      .where(eq(recipes.id, +params.recipeId));

    const updated = recipe?.recipeIngredients
      .map((ri) => ({
        recipeIngredient: ri,
        ingredient: data.ingredients.find(
          (i) =>
            i.name === ri.ingredient.name && i.unit === ri.ingredient.unit && ri.amount !== i.amount
        ),
      }))
      .filter(({ ingredient }) => !!ingredient);

    const added = data.ingredients.filter((i) =>
      recipe?.recipeIngredients
        .map((ri) => ri.ingredient)
        .every((ri) => i.name !== ri.name || i.unit !== ri.unit)
    );

    const removed = recipe?.recipeIngredients
      .map((ri) => ri.ingredient)
      .filter((ri) => data.ingredients.every((i) => ri.name !== i.name || i.unit !== ri.unit));

    Promise.all([
      ...added.map((ingredient) => addIngredient(recipe?.id || -1, ingredient)),
      ...(updated?.map(({ ingredient, recipeIngredient }) =>
        db
          .update(recipeIngredients)
          .set({ amount: ingredient?.amount })
          .where(
            and(
              eq(recipeIngredients.recipeId, +params.recipeId),
              eq(recipeIngredients.ingredientId, recipeIngredient.ingredientId)
            )
          )
      ) || []),
      ...(removed?.map((ingredient) =>
        db
          .delete(recipeIngredients)
          .where(
            and(
              eq(recipeIngredients.recipeId, +params.recipeId),
              eq(recipeIngredients.ingredientId, ingredient.id)
            )
          )
      ) || []),
    ]);

    throw redirect(304, `/recipes/${params.recipeId}`);
  },
} satisfies Actions;
