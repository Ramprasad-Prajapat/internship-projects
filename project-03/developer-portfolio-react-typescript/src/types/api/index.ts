// src/types/api/index.ts
/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Sorting direction.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Basic filter definition.
 */
export interface Filter<T = any> {
  field: keyof T;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: any;
}

/**
 * Sorting definition.
 */
export interface Sort<T = any> {
  field: keyof T;
  direction: SortDirection;
}
