import { pgEnum, pgTable, serial, text, decimal, primaryKey, unique } from 'drizzle-orm/pg-core';
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

export const ingredients = pgTable(
  'ingredients',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    unit: text('unit').notNull(),
  },
  (t) => ({
    name_type_unique: unique('name_type_unique').on(t.name, t.unit),
  })
);

export const ingredientsRelations = relations(ingredients, ({ many, one }) => ({
  recipeIngredients: many(recipeIngredients),
  conversion: one(conversions, {
    fields: [ingredients.id],
    references: [conversions.ingredientId],
  }),
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

export const conversions = pgTable('conversions', {
  ingredientId: serial('ingredient_id')
    .primaryKey()
    .references(() => ingredients.id),
  scale: decimal('scale').notNull(),
});
