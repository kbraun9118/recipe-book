import db from '$lib/server/db';
import { tags } from '$lib/server/db/schema/recipe';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
  return {
    tags: await db
      .select({ name: tags.name })
      .from(tags)
      .then((v) => v.map((t) => t.name)),
  };
}) satisfies LayoutServerLoad;
