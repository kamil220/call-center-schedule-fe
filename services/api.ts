/**
 * Base API client for making HTTP requests
 * 
 * This file provides utility functions for interacting with the backend API.
 * It can be extended with more specialized functions as needed.
 */

import { getTokenFromCookies } from '@/lib/cookies';
import { clearAuthCookies } from '@/lib/cookies';
import { PaginatedResponse, PaginationParams } from '../types/api';

// Constants
const API_BASE_URL = '/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Handle unauthorized error (401)
// Using a function so we can import this before the store is initialized
let handleLogout: () => void = () => {
  clearAuthCookies();
  // We'll set this function after store initialization
};

// Function to set the logout handler from the auth store
export const setLogoutHandler = (fn: () => void) => {
  handleLogout = fn;
};

/**
 * Base fetch wrapper with error handling and automatic JSON parsing
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  // Get token from cookies
  const token = getTokenFromCookies();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON response if available
    let data;
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      // Handle 401 errors - unauthorized (token expired or invalid)
      if (response.status === 401) {
        // Clear auth cookies and trigger logout
        handleLogout();
      }
      
      throw new ApiError(
        data.message || 'An error occurred while fetching data',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert generic fetch errors to ApiError
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

/**
 * User role types
 */
export type UserRole = 
  | 'ROLE_ADMIN'
  | 'ROLE_PLANNER'
  | 'ROLE_TEAM_MANAGER'
  | 'ROLE_AGENT';

/**
 * Sort field options for users
 */
export type UserSortField = 'id' | 'email' | 'firstName' | 'lastName' | 'active';

/**
 * User filter and pagination parameters
 */
export interface UserListParams extends PaginationParams<UserSortField> {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  active: boolean;
}

/**
 * Helper methods for common HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T, D = Record<string, unknown>>(endpoint: string, data?: D, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T, D = Record<string, unknown>>(endpoint: string, data?: D, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T, D = Record<string, unknown>>(endpoint: string, data?: D, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
}; 

/**
 * Users API endpoints
 */
export const usersApi = {
  /**
   * Get users with filtering and pagination
   * Requires admin or planner role
   */
  getUsers: (params?: UserListParams): Promise<PaginatedResponse<User>> => {
    // Convert params to URL query string
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    return api.get<PaginatedResponse<User>>(endpoint);
  }
}; 