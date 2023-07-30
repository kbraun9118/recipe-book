import db from '$lib/db';
import { todos } from '$lib/db/schema/todos';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    todos: await db.select().from(todos),
  };
}) satisfies PageServerLoad;

export const actions = {
  logout({cookies}) {
    cookies.delete('authorized')
  }
} satisfies Actions
