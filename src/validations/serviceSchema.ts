// src/validations/serviceSchema.ts

import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be 20 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(50, "Description must be 50 characters or less"),
  categoryId: z.union([z.string(), z.number()]).nullable(),
});

export const serviceUpdateSchema = serviceSchema.extend({
  id: z.number(),
  category: categorySchema.nullable(),
});

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;
