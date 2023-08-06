import db from '$lib/server/db';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { insertConversionsSchema } from '$lib/server/db/schema/recipe';
import { z } from 'zod';
import ingredientUnits from '../../../lib/ingredient-units';
import { fail, type Actions } from '@sveltejs/kit';

const updateConversionSchema = z.object({
  recipeId: z.number(),
  scale: z.number().gt(0),
  to: z.enum(ingredientUnits),
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

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  },
  update: async ({ request }) => {
    const form = await superValidate(request, updateConversionSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  },
  delete: async ({ request }) => {
    const { ingredientId, to } = Object.fromEntries(await request.formData());

    console.log({ ingredientId, to });
  },
} satisfies Actions;
