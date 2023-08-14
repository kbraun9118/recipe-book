import db from '$lib/server/db';
import { recipes } from '$lib/server/db/schema/recipe';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
  const name = url.searchParams.get('name');
  return {
    tag: name
      ? await db.query.tags.findFirst({
          with: {
            recipesTags: { with: { recipe: { with: { recipesTags: { with: { tag: true } } } } } },
          },
          where: (tag, { eq }) => eq(tag.name, name),
        })
      : null,
    tags: await db.query.tags.findMany(),
  };
}) satisfies PageServerLoad;
