export type SortOrder = 'asc' | 'desc';

export interface SortState<TSortBy extends string = string> {
  sortBy?: TSortBy;
  sortOrder: SortOrder;
}

export interface PaginatedResponse<TItem, TSummary = undefined> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary?: TSummary;
}

export interface BasePaginationQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}
