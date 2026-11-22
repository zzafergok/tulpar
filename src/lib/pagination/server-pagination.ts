import { z } from 'zod';
import type { PaginatedResponse, SortOrder, SortState } from './types';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const sortOrderSchema = z.enum(['asc', 'desc']);

export const basePaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  search: z.string().trim().max(120).optional(),
  sortBy: z.string().trim().min(1).max(60).optional(),
  sortOrder: sortOrderSchema.optional(),
});

export function createSortablePaginationQuerySchema<
  TSortFields extends readonly [string, ...string[]],
>(
  sortFields: TSortFields,
  defaultSortBy: TSortFields[number],
  defaultSortOrder: SortOrder = 'desc',
) {
  return basePaginationQuerySchema.extend({
    sortBy: z.enum(sortFields).default(defaultSortBy),
    sortOrder: sortOrderSchema.default(defaultSortOrder),
  });
}

export function parsePaginationSearchParams<TSchema extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: TSchema,
): z.infer<TSchema> {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value !== '') {
      raw[key] = value;
    }
  });
  return schema.parse(raw);
}

export function sortItems<TItem>(
  items: readonly TItem[],
  sortBy: string | undefined,
  sortOrder: SortOrder,
  comparators: Record<string, (a: TItem, b: TItem) => number>,
): TItem[] {
  if (!sortBy || !comparators[sortBy]) {
    return [...items];
  }
  const compare = comparators[sortBy];
  const factor = sortOrder === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => compare(a, b) * factor);
}

export function toggleSortState<TSortBy extends string>(
  current: SortState<TSortBy>,
  column: TSortBy,
  defaultOrder: SortOrder = 'desc',
): SortState<TSortBy> {
  if (current.sortBy === column) {
    return {
      sortBy: column,
      sortOrder: current.sortOrder === 'asc' ? 'desc' : 'asc',
    };
  }
  return {
    sortBy: column,
    sortOrder: defaultOrder,
  };
}

export function paginateArray<TItem, TSummary = undefined>(
  allItems: TItem[],
  page: number,
  pageSize: number,
  summary?: TSummary,
): PaginatedResponse<TItem, TSummary> {
  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * pageSize;
  const items = allItems.slice(startIndex, startIndex + pageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
    ...(summary !== undefined ? { summary } : {}),
  };
}
