import { z } from 'zod';

export const DataFrameQuerySchema = z.object({
  columns: z.array(z.string()), // required
  filterColumn: z.string().optional(),
  filterOperator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'in']).optional(),
  filterValue: z.any().optional(),
  groupBy: z.array(z.string()).optional(),
  aggregationColumn: z.string().optional(),
  aggregationOperation: z.enum(['sum', 'mean', 'count', 'min', 'max']).optional(),
  sortColumn: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
  text: z.string(), // must be included by mastra
});

export type DataFrameQuerySchemaType = z.infer<typeof DataFrameQuerySchema>;
