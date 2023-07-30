import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  const authorized = cookies.get('authorized');
  console.log('here', authorized);
  if (!cookies.get('authorized')) {
    console.log('here')
    throw redirect(308, '/login');
  }
}) satisfies LayoutServerLoad;

