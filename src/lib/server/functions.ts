import { and, eq, inArray } from 'drizzle-orm';
import { ingredients, recipesIngredients, recipesTags, tags } from './db/schema/recipe';
import db from './db';
import type { DbTransaction } from './db/schema';


export async function addIngredient(
  tx: DbTransaction,
  recipeId: number,
  ingredient: { name: string; amount: number; unit: string },
) {
  const query = and(eq(ingredients.name, ingredient.name), eq(ingredients.unit, ingredient.unit));

  const inserted = await tx
    .insert(ingredients)
    .values({
      name: ingredient.name.trim().toLowerCase(),
      unit: ingredient.unit,
    })
    .onConflictDoNothing({
      where: query,
    })
    .returning({ id: ingredients.id });

  let ingredientId: number | undefined;

  if (inserted.length > 0) {
    ingredientId = inserted[0].id;
  } else {
    const queryed = await tx.query.ingredients.findFirst({
      where: query,
      columns: { id: true },
    });
    ingredientId = queryed?.id;
  }

  await tx
    .insert(recipesIngredients)
    .values({ ingredientId: ingredientId, recipeId, amount: ingredient.amount });
}

export async function addTagsToRecipe(tx: DbTransaction, recipeId: number, tagNames: string[]) {
  if (tagNames.length > 0) {
    const dbTags = await db.query.tags.findMany({ where: inArray(tags.name, tagNames) });

    const tagsToAdd = tagNames.filter((tag) => !dbTags.map((t) => t.name).includes(tag));

    if (tagsToAdd.length > 0) {
      const newTags = await tx
        .insert(tags)
        .values(tagsToAdd.map((tag) => ({ name: tag })))
        .returning();

      dbTags.push(...newTags);
    }

    await tx.insert(recipesTags).values(dbTags.map((tag) => ({ recipeId, tagId: tag.id })));
  }
}
