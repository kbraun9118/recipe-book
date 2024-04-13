import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  async default({ cookies, request }) {
    const formData = await request.formData();
    const { password } = Object.fromEntries(formData);

    if (password === env.PAGE_LOGIN) {
      cookies.set('authorized', 'true', { path: '.' });
       redirect(303, '/');
    }

    return fail(400, { message: 'invalid password' });
  },
} satisfies Actions;
