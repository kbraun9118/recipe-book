import { pgEnum, pgTable, serial, text, decimal, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  url: text('url'),
  notes: text('notes'),
});

export const recipesRelations = relations(recipes, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}));

export const ingredientType = pgEnum('ingredient_type', ['wet', 'dry', 'other']);

export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  type: ingredientType('type').notNull(),
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}));

export const recipeIngredients = pgTable(
  'recipeIngredients',
  {
    recipeId: serial('recipe_id')
      .notNull()
      .references(() => recipes.id),
    ingredientId: serial('ingredient_id')
      .notNull()
      .references(() => ingredients.id),
    amount: decimal('amount').notNull(),
    unit: text('unit').notNull(),
  },
  (t) => ({
    primaryKey: primaryKey(t.recipeId, t.ingredientId),
  })
);

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, { references: [recipes.id], fields: [recipeIngredients.recipeId] }),
  ingredient: one(ingredients, {
    references: [ingredients.id],
    fields: [recipeIngredients.ingredientId],
  }),
}));
