/**
 * Type definitions for calendar-related API responses
 */

/**
 * Holiday information returned from the API
 */
export interface Holiday {
  date: string;
  type: 'fixed' | 'movable';
  description: string;
} 