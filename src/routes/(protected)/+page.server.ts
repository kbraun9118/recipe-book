import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { DataSchema } from './form-data';
import { validateFormJson } from '$lib/validation';

// export const load = (async () => {
//   return {
//   };
// }) satisfies PageServerLoad;

export const actions = {
  logout({ cookies }) {
    cookies.delete('authorized');
  },
  doThing: validateFormJson(DataSchema, async ({ json }) => {
    console.log(json);
  }),
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
