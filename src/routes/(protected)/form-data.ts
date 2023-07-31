import { z } from 'zod';

export const DataSchema = z.object({
    name: z.string().min(2),
    age: z.number().int().nullable(),
    items: z.array(z.object({
        value: z.string().min(2)
    })).min(2)
});

export type Data = z.infer<typeof DataSchema>;