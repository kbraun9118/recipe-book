import { and, eq } from 'drizzle-orm';
import { ingredients, recipeIngredients } from './db/schema/recipe';
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
    .insert(recipeIngredients)
    .values({ ingredientId: ingredientId?.id, recipeId, amount: ingredient.amount });
}
