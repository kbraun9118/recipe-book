import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const formSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().nullable(),
  items: z
    .array(
      z.object({
        value: z.string().min(2),
      })
    )
    .min(2),
});

export const load = (async () => {
  return {
    form: await superValidate(
      { name: '', age: null, items: [{ value: '' }, { value: '' }] },
      formSchema,
      { errors: false }
    ),
  };
}) satisfies PageServerLoad;

export const actions = {
  logout({ cookies }) {
    cookies.delete('authorized');
  },
  doThing: async ({ request }) => {
    const form = await superValidate(request, formSchema);

    console.log(JSON.stringify(form));

    if (!form.valid) {
      return fail(400, { form });
    }

    return { form };
  },
  // doThing: async ({ request }) => {
  //   const formData = await request.formData();
  //   const value = formData.get('value')

  //   if (typeof value === 'string') {
  //     const data = DataSchema.safeParse(JSON.parse(value));
  //     if (data.success) {
  //       console.log(data.data);
  //     } else {
  //       return fail(400, { validation: data.error.format() })
  //     }
  //   }

  //   return fail(400, { message: 'must pass json to "value" form data' })
  // }
} satisfies Actions;
