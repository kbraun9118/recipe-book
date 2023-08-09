import db from '$lib/server/db';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { conversions, insertConversionsSchema } from '$lib/server/db/schema/recipe';
import { z } from 'zod';
import ingredientUnits from '../../../lib/ingredient-units';
import { fail, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

const updateConversionSchema = z.object({
  updateIngredientId: z.number(),
  updateScale: z.number().gt(0),
  updateTo: z.enum(ingredientUnits),
  previousTo: z.enum(ingredientUnits),
});

export const load = (async () => {
  return {
    conversions: await db.query.conversions.findMany({ with: { ingredient: true } }),
    createForm: await superValidate(insertConversionsSchema),
    updateForm: await superValidate(updateConversionSchema),
    ingredients: await db.query.ingredients.findMany(),
  };
}) satisfies PageServerLoad;

export const actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, insertConversionsSchema);

    console.log(form.data);

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.insert(conversions).values({
      scale: form.data.scale,
      to: form.data.to,
      ingredientId: form.data.ingredientId
    })

    return { form };
  },
  update: async ({ request }) => {
    const form = await superValidate(request, updateConversionSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    await db
      .update(conversions)
      .set({ scale: form.data.updateScale, to: form.data.updateTo })
      .where(
        and(
          eq(conversions.ingredientId, form.data.updateIngredientId),
          eq(conversions.to, form.data.previousTo)
        )
      );

    return { form };
  },
  delete: async ({ request }) => {
    const { deleteIngredientId, deleteTo } = Object.fromEntries(await request.formData());

    await db
      .delete(conversions)
      .where(
        and(
          eq(conversions.ingredientId, +deleteIngredientId),
          eq(conversions.to, deleteTo.toString())
        )
      );
  },
} satisfies Actions;
