import db from '../../../lib/server/db';
import { recipes } from '../../../lib/server/db/schema/recipe';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    foo: 'bar',
  };
}) satisfies PageServerLoad;

export const actions = {
  async default({ request }) {
    const obj = Object.fromEntries(await request.formData());

    console.log(obj);

    // const [{id}] = await db.insert(recipes).values({
    //   name,
    //   description,
    //   notes,
    //   url
    // }).returning()
  },
} satisfies Actions;
