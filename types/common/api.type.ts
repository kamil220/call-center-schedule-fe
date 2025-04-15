/**
 * Common API error types
 */

/**
 * Represents an error returned from the API
 */
export class ApiError extends Error {
  status: number;
  details?: unknown; // Additional details from the API response

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
} 