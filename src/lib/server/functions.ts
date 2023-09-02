import { and, eq, inArray } from 'drizzle-orm';
import { ingredients, recipesIngredients, recipesTags, tags } from './db/schema/recipe';
import db from './db';

export async function addIngredient(
  recipeId: number,
  ingredient: { name: string; amount: number; unit: string },
) {
  const query = and(eq(ingredients.name, ingredient.name), eq(ingredients.unit, ingredient.unit));

  await db
    .insert(ingredients)
    .values({
      name: ingredient.name.trim().toLowerCase(),
      unit: ingredient.unit,
    })
    .onConflictDoNothing({
      where: query,
    });

  const ingredientId = await db.query.ingredients.findFirst({
    where: query,
    columns: { id: true },
  });

  await db
    .insert(recipesIngredients)
    .values({ ingredientId: ingredientId?.id, recipeId, amount: ingredient.amount });
}

export async function addTagsToRecipe(recipeId: number, tagNames: string[]) {
  if (tagNames.length > 0) {
    const dbTags = await db.query.tags.findMany({ where: inArray(tags.name, tagNames) });

    const tagsToAdd = tagNames.filter((tag) => !dbTags.map((t) => t.name).includes(tag));

    if (tagsToAdd.length > 0) {
      const newTags = await db
        .insert(tags)
        .values(tagsToAdd.map((tag) => ({ name: tag })))
        .returning();

      dbTags.push(...newTags);
    }

    await db.insert(recipesTags).values(dbTags.map((tag) => ({ recipeId, tagId: tag.id })));
  }
}
