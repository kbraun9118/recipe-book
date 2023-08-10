import { z } from 'zod';
import { insertRecipesSchema, unitEnum } from './server/db/schema/recipe';
import ingredientUnits from './ingredient-units';

export const newRecipeSchema = insertRecipesSchema.extend({
  ingredients: z
    .array(
      z.object({
        name: z.string().min(2),
        unit: z.enum([...unitEnum.enumValues]),
        amount: z.number().gt(0),
      })
    )
    .refine((items) => new Set(items.map((i) => i.name)).size === items.length, {
      message: 'Must be an array of unique strings',
    }),
});

export const updateConversionSchema = z.object({
  ingredientId: z.number(),
  scale: z.number().gt(0),
  to: z.enum(ingredientUnits),
  previousTo: z.enum(ingredientUnits),
});

export type UpdateConversionSchema = typeof updateConversionSchema;

export type NewRecipeSchema = typeof newRecipeSchema;
