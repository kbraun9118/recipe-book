import db from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
  };
}) satisfies PageServerLoad;

export const actions = {
  logout({cookies}) {
    cookies.delete('authorized')
  }
} satisfies Actions
