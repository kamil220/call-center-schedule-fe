/**
 * Calendar-related API services
 */

import { api } from './api';
import { Holiday, UserAvailability } from '@/types';

// Get country from environment variable
const DEFAULT_COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'PL';

/**
 * Calendar API service
 */
export const calendarApi = {
  /**
   * Get holidays for a specific year and country
   * 
   * @param year - The year to fetch holidays for
   * @param country - The country code (default from env var or 'PL')
   * @returns Promise with array of holidays
   */
  getHolidays: (year: number, country: string = DEFAULT_COUNTRY): Promise<Holiday[]> => {
    return api.get<Holiday[]>(`/v1/calendar/holidays/${year}?country=${country}`);
  },

  /**
   * Get user availability for a date range
   * 
   * @param userId - The user ID to fetch availability for
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns Promise with array of user availabilities
   */
  getUserAvailability: (userId: string, startDate: string, endDate: string): Promise<UserAvailability[]> => {
    return api.get<UserAvailability[]>(`/work-schedule/availabilities?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
  }
};

// Cache for holidays to avoid unnecessary API calls
const holidaysCache: Record<string, Holiday[]> = {};

// Track in-flight requests to avoid duplicate calls
const pendingRequests = new Map<string, Promise<Holiday[]>>();

/**
 * Calendar service with caching and deduplication
 */
export const calendarService = {
  /**
   * Get holidays for a specific year and country
   * Uses cached data if available, otherwise fetches from API
   * Deduplicates simultaneous requests for the same data
   * 
   * @param year - The year to fetch holidays for
   * @param country - The country code (default from env var or 'PL')
   * @returns Promise with array of holidays
   */
  getHolidays: async (year: number, country: string = DEFAULT_COUNTRY): Promise<Holiday[]> => {
    const cacheKey = `${year}-${country}`;
    
    // Return from cache if available
    if (holidaysCache[cacheKey]) {
      return holidaysCache[cacheKey];
    }
    
    // If there's already an in-flight request for this data, return that promise
    const existingRequest = pendingRequests.get(cacheKey);
    if (existingRequest) {
      console.log(`Reusing in-flight request for holidays ${year}`);
      return existingRequest;
    }
    
    // Create a new request
    console.log(`Creating new request for holidays ${year}`);
    const requestPromise = calendarApi.getHolidays(year, country)
      .then(holidays => {
        // Cache the results on success
        holidaysCache[cacheKey] = holidays;
        // Remove from pending requests
        pendingRequests.delete(cacheKey);
        return holidays;
      })
      .catch(error => {
        // Remove from pending requests on error
        pendingRequests.delete(cacheKey);
        console.error('Failed to fetch holidays:', error);
        return [];
      });
    
    // Store the promise
    pendingRequests.set(cacheKey, requestPromise);
    
    return requestPromise;
  },
  
  /**
   * Get user availability for a date range
   * 
   * @param userId - The user ID to fetch availability for
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns Promise with array of user availabilities
   */
  getUserAvailability: (userId: string, startDate: string, endDate: string): Promise<UserAvailability[]> => {
    return calendarApi.getUserAvailability(userId, startDate, endDate);
  },
  
  /**
   * Clear the holidays cache
   */
  clearCache: () => {
    Object.keys(holidaysCache).forEach(key => {
      delete holidaysCache[key];
    });
    pendingRequests.clear();
  }
}; 