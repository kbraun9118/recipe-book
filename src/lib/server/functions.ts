import { and, eq } from 'drizzle-orm';
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

export async function addTagToRecipe(recipeId: number, tagName: string) {
  let tag = await db.query.tags.findFirst({ where: eq(tags.name, tagName) });

  if (!tag) {
    const [newTag] = await db.insert(tags).values({ name: tagName }).returning();
    tag = newTag;
  }

  await db.insert(recipesTags).values({ recipeId, tagId: tag.id });
}
