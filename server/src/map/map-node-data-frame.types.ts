import { z } from 'zod';

export const DataFrameQuerySchema = z.object({
  // fallback
  text: z.string(),
  // actual query parameters
  columns: z.array(z.string()),
  filters: z
    .array(
      z.object({
        column: z.string(),
        operator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'in']),
        value: z.any(),
      })
    )
    .optional(),
  groupBy: z.array(z.string()).optional(),
  aggregations: z
    .array(
      z.object({
        column: z.string(),
        operation: z.enum(['sum', 'mean', 'count', 'min', 'max']),
      })
    )
    .optional(),
  sort: z
    .object({
      column: z.string(),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
  limit: z.number().optional(),
});

export type DataFrameQuerySchemaType = z.infer<typeof DataFrameQuerySchema>;
