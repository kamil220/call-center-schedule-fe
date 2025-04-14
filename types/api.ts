/**
 * Common API types shared across different endpoints
 */

/**
 * Sort direction options
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Common pagination parameters interface
 * Extended by specific entity list parameter interfaces
 * 
 * @template T - The type of the sortBy field (defaults to string)
 */
export interface PaginationParams<T = string> {
  page?: number;
  limit?: number;
  sortBy?: T;
  sortDirection?: SortDirection;
}

/**
 * Generic paginated response structure
 * Used for any collection of items from the API
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 