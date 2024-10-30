import { updateConversionSchema } from '$lib/schemas';
import db from '$lib/server/db';
import { conversions, insertConversionsSchema } from '$lib/server/db/schema/recipe';
import { fail, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async () => {
  return {
    conversions: await db.query.conversions.findMany({ with: { ingredient: true } }),
    createForm: await superValidate(zod(insertConversionsSchema)),
    updateForm: await superValidate(zod(updateConversionSchema)),
    ingredients: await db.query.ingredients.findMany(),
  };
}) satisfies PageServerLoad;

export const actions = {
  async create({ request }) {
    const form = await superValidate(request, zod(insertConversionsSchema));

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
    } catch (_) {
      return setError(form, 'ingredientId', 'Number already has conversion to this unit');
    }
  },
  async update({ request }) {
    const form = await superValidate(request, zod(updateConversionSchema));

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
    } catch (_) {
      return setError(form, 'ingredientId', 'Number already has conversion to this unit');
    }
  },
  async delete({ request }) {
    const { ingredientId, to } = Object.fromEntries(await request.formData());

    await db
      .delete(conversions)
      .where(and(eq(conversions.ingredientId, +ingredientId), eq(conversions.to, to.toString())));
  },
} satisfies Actions;
