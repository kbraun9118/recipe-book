import { relations, type InferModel } from 'drizzle-orm';
import { pgEnum, pgTable, primaryKey, real, serial, text, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import ingredientUnits from '../../../ingredient-units';
import { z } from 'zod';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  url: text('url'),
  notes: text('notes'),
  instructions: text('instructions').notNull(),
});

export const insertRecipesSchema = createInsertSchema(recipes, {
  name: (s) => s.name.min(2),
  url: (s) => s.url.url().optional().or(z.literal('')),
  description: (s) => s.description.min(10),
  notes: (s) => s.notes.min(10).optional().or(z.literal('')),
  instructions: (s) => s.instructions.min(10),
});

export const recipesRelations = relations(recipes, ({ many }) => ({
  recipesIngredients: many(recipesIngredients),
  recipesTags: many(recipesTags)
}));

export const unitEnum = pgEnum('units', ingredientUnits);

export const ingredients = pgTable(
  'ingredients',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    unit: unitEnum('unit').notNull(),
  },
  (t) => ({
    name_type_unique: unique('name_type_unique').on(t.name, t.unit),
  }),
);

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipesIngredients: many(recipesIngredients),
  conversions: many(conversions),
}));

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  recipesTags: many(recipesTags),
}));

export const recipesTags = pgTable(
  'recipes_tags',
  {
    tagId: serial('tagId')
      .notNull()
      .references(() => tags.id),
    recipeId: serial('recipeId')
      .notNull()
      .references(() => recipes.id),
  },
  (t) => ({
    primaryKey: primaryKey(t.recipeId, t.tagId),
  })
);

export const recipesTagsRelations = relations(recipesTags, ({ one }) => ({
  tag: one(tags, { references: [tags.id], fields: [recipesTags.tagId] }),
  recipe: one(recipes, { references: [recipes.id], fields: [recipesTags.recipeId] }),
}));

export const recipesIngredients = pgTable(
  'recipes_ingredients',
  {
    recipeId: serial('recipe_id')
      .notNull()
      .references(() => recipes.id),
    ingredientId: serial('ingredient_id')
      .notNull()
      .references(() => ingredients.id),
    amount: real('amount').notNull(),
  },
  (t) => ({
    primaryKey: primaryKey(t.recipeId, t.ingredientId),
  }),
);

export const recipesIngredientsRelations = relations(recipesIngredients, ({ one }) => ({
  recipe: one(recipes, { references: [recipes.id], fields: [recipesIngredients.recipeId] }),
  ingredient: one(ingredients, {
    references: [ingredients.id],
    fields: [recipesIngredients.ingredientId],
  }),
}));

export const conversions = pgTable(
  'conversions',
  {
    ingredientId: serial('ingredient_id')
      .notNull()
      .references(() => ingredients.id),
    scale: real('scale').notNull(),
    to: unitEnum('unit').notNull(),
  },
  (t) => ({
    primaryKey: primaryKey(t.ingredientId, t.to),
  }),
);

export type Conversion = InferModel<typeof conversions>;

export const conversionsRelations = relations(conversions, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [conversions.ingredientId],
    references: [ingredients.id],
  }),
}));

export const insertConversionsSchema = createInsertSchema(conversions, {
  scale: (s) => s.scale.gt(0),
});
