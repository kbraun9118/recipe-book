import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import {
  ingredients,
  isnertRecipesSchema as insertRecipesSchema,
  recipeIngredients,
  recipes,
  unitEnum,
} from '../../../lib/server/db/schema/recipe';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { and, eq } from 'drizzle-orm';

const newRecipeSchema = insertRecipesSchema.extend({
  ingredients: z.array(
    z.object({
      name: z.string().min(2),
      unit: z.enum([...unitEnum.enumValues]),
      amount: z.number().gt(0),
    })
  ),
});

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

    console.log(JSON.stringify(form));

    if (!form.valid) {
      return fail(400, { form });
    }

    const data = form.data;

    const [{ id: recipeId }] = await db
      .insert(recipes)
      .values({ name: data.name, description: data.description, notes: data.notes, url: data.url })
      .returning();

    console.log('recipeId: ', recipeId);

    for (let ingredient of data.ingredients) {
      const query = and(
        eq(ingredients.name, ingredient.name),
        eq(ingredients.unit, ingredient.unit)
      );

      await db
        .insert(ingredients)
        .values({
          name: ingredient.name,
          unit: ingredient.unit,
        })
        .onConflictDoNothing({
          where: query,
        });

      const [{ id: ingredientId }] = await db.query.ingredients.findMany({ where: query });

      await db
        .insert(recipeIngredients)
        .values({ ingredientId, recipeId, amount: ingredient.amount });
    }

    throw redirect(303, `/recipes/${recipeId}`);
  },
} satisfies Actions;
