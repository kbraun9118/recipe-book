import type { LayoutLoad } from './$types';

export const load = (async () => {
    return {
        title: 'Recipe Book'
    };
}) satisfies LayoutLoad;