/**
 * Base API client for making HTTP requests
 * 
 * This file provides utility functions for interacting with the backend API.
 * It can be extended with more specialized functions.
 */

import { getTokenFromCookies } from '@/lib/cookies';
import { clearAuthCookies } from '@/lib/cookies';
import {
  ApiError,
  PaginatedResponse,
  UserDto,
  UserListParamsDto,
  CreateUserRequestDto,
  ApiUser
} from '@/types'; 

// Constants
const API_BASE_URL = '/api';

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
      data = await response.text(); // Keep text parsing for non-JSON responses
    }

    // Handle error responses
    if (!response.ok) {
      // Handle 401 errors - unauthorized (token expired or invalid)
      if (response.status === 401) {
        // Clear auth cookies and trigger logout
        handleLogout();
      }
      
      // Use the parsed data (might be JSON or text) for the error details
      const errorMessage = (typeof data === 'object' && ( data?.message || data?.error)) 
                         ? data.message || data.error
                         : typeof data === 'string' && data 
                         ? data 
                         : 'An error occurred while fetching data';
                         
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert generic fetch errors to ApiError
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0 // Use 0 or a specific code for network/unknown errors
    );
  }
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
  getUsers: (params?: UserListParamsDto): Promise<PaginatedResponse<UserDto>> => {
    // Convert params to URL query string
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Special handling for the roles array
          if (key === 'roles' && Array.isArray(value)) {
            value.forEach(role => queryParams.append('roles[]', role));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;

    // API returns PaginatedResponse of UserDto
    return api.get<PaginatedResponse<UserDto>>(endpoint);
  },
  
  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns User data
   */
  getUser: (id: string): Promise<ApiUser> => {
    return api.get<ApiUser>(`/users/${id}`);
  },
  
  /**
   * Create a new user
   * Requires admin role
   * 
   * @param userData - User data DTO
   * @returns Newly created user data (as UserDto from API)
   */
  createUser: (userData: CreateUserRequestDto): Promise<UserDto> => {
    // API call expects CreateUserRequestDto and returns UserDto
    return api.post<UserDto, CreateUserRequestDto>('/users', userData);
  }
};