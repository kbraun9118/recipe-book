import { newRecipeSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { recipes, recipesIngredients, recipesTags } from '$lib/server/db/schema/recipe';
import { addIngredient, addTagToRecipe } from '$lib/server/functions';
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
        ingredients: recipe.recipesIngredients?.map((ri) => ({
          name: ri.ingredient.name,
          amount: ri.amount,
          unit: ri.ingredient.unit,
        })),
        tags: recipe.recipesTags?.map((rt) => rt.tag.name) || [],
      },
      newRecipeSchema,
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
      with: {
        recipesIngredients: { with: { ingredient: true } },
        recipesTags: { with: { tag: true } },
      },
    });

    const data = {
      ...form.data,
      ingredients: form.data.ingredients?.map((i) => ({ ...i, name: i.name.trim().toLowerCase() })),
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

    const updatedIngredients = recipe?.recipesIngredients
      .map((ri) => ({
        recipesIngredient: ri,
        ingredient: data.ingredients.find(
          (i) =>
            i.name === ri.ingredient.name &&
            i.unit === ri.ingredient.unit &&
            ri.amount !== i.amount,
        ),
      }))
      .filter(({ ingredient }) => !!ingredient);

    const addedIngredients = data.ingredients.filter(
      (i) =>
        recipe?.recipesIngredients
          .map((ri) => ri.ingredient)
          .every((ri) => i.name !== ri.name || i.unit !== ri.unit),
    );

    const removedIngredients = recipe?.recipesIngredients
      .map((ri) => ri.ingredient)
      .filter((ri) => data.ingredients.every((i) => ri.name !== i.name || i.unit !== ri.unit));

    Promise.all([
      ...addedIngredients.map((ingredient) => addIngredient(recipe?.id || -1, ingredient)),
      ...(updatedIngredients?.map(({ ingredient, recipesIngredient }) =>
        db
          .update(recipesIngredients)
          .set({ amount: ingredient?.amount })
          .where(
            and(
              eq(recipesIngredients.recipeId, +params.recipeId),
              eq(recipesIngredients.ingredientId, recipesIngredient.ingredientId),
            ),
          ),
      ) || []),
      ...(removedIngredients?.map((ingredient) =>
        db
          .delete(recipesIngredients)
          .where(
            and(
              eq(recipesIngredients.recipeId, +params.recipeId),
              eq(recipesIngredients.ingredientId, ingredient.id),
            ),
          ),
      ) || []),
    ]);

    Promise.all(
      recipe?.recipesTags.forEach(async () =>
        db.delete(recipesTags).where(eq(recipesTags.recipeId, recipe.id)),
      ) || [],
    );
    Promise.all(form.data.tags.map((t) => addTagToRecipe(+params.recipeId, t)));

    throw redirect(304, `/recipes/${params.recipeId}`);
  },
} satisfies Actions;
