import { updateConversionSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { conversions, insertConversionsSchema } from '$lib/server/db/schema/recipe';
import { fail, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

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

    try {
      await db.insert(conversions).values({
        scale: form.data.scale,
        to: form.data.to,
        ingredientId: form.data.ingredientId,
      });

      return { form };
    } catch (err) {
      return setError(form, 'ingredientId', 'Number already has conversion to this unit');
    }
  },
  update: async ({ request }) => {
    const form = await superValidate(request, updateConversionSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await db
        .update(conversions)
        .set({ scale: form.data.scale, to: form.data.to })
        .where(
          and(
            eq(conversions.ingredientId, form.data.ingredientId),
            eq(conversions.to, form.data.previousTo),
          ),
        );

      return { form };
    } catch (err) {
      return setError(form, 'ingredientId', 'Number already has conversion to this unit');
    }
  },
  delete: async ({ request }) => {
    const { ingredientId, to } = Object.fromEntries(await request.formData());

    await db
      .delete(conversions)
      .where(and(eq(conversions.ingredientId, +ingredientId), eq(conversions.to, to.toString())));
  },
} satisfies Actions;
