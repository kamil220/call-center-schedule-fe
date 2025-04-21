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

/**
 * Recurrence pattern for availability
 */
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  excludeDates?: string[];
  until: string;
}

/**
 * User availability information
 */
export interface UserAvailability {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrencePattern: RecurrencePattern | null;
} 