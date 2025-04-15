/**
 * Common collection types for paginated API responses
 */

/**
 * Generic pagination parameters for API requests
 * 
 * @template T - The type of the field to sort by (string literals)
 */
export interface PaginationParams<T extends string = string> {
  page?: number; // Page number (1-indexed)
  limit?: number; // Items per page
  sortField?: T; // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort order
}

/**
 * Generic structure for paginated API responses
 * 
 * @template T - The type of the items in the collection
 */
export interface PaginatedResponse<T> {
  items: T[];       // Array of items for the current page
  total: number;    // Total number of items across all pages
  page: number;     // Current page number (0-indexed)
  limit: number;    // Items per page
  totalPages: number; // Total number of pages
} 