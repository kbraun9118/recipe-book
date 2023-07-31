import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  if (!cookies.get('authorized')) {
    throw redirect(308, '/login');
  }
}) satisfies LayoutServerLoad;

