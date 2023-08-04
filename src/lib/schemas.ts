import { z } from 'zod';
import { insertRecipesSchema, unitEnum } from './server/db/schema/recipe';

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

export type NewRecipeSchema = typeof newRecipeSchema;
