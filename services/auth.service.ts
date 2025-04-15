import { 
  setAuthCookies, 
  clearAuthCookies, 
  getUserFromCookies, 
  getTokenFromCookies 
} from '@/lib/cookies';
import { api } from './api';
import { ApiError, User } from '@/types';
import { LoginRequestDto, LoginResponseDto, UserDto } from '@/types';
import { mapUserDtoToDomain } from '@/types';

// Custom response type for login
export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Authentication service
 * Handles login, logout, and potentially other auth-related API calls
 */
export const authService = {
  /**
   * Login user
   * 
   * @param credentials - Login credentials (email, password)
   * @returns LoginResponse containing success status, user data or error message
   */
  login: async (credentials: LoginRequestDto): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponseDto, LoginRequestDto>(
        '/auth/login', 
        credentials
      );
      
      // Map API DTO to domain User model first
      const domainUser = mapUserDtoToDomain(response.user);
      
      // Store token and mapped user info in cookies
      setAuthCookies(response.token, domainUser);
      
      return { success: true, user: domainUser };
      
    } catch (error) {
      let errorMessage = 'Login failed due to an unknown error.';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error('Login Error:', error);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // Optionally call a backend logout endpoint if it exists
    // await api.post('/auth/logout');
    
    // Clear cookies and potentially reset state
    clearAuthCookies();
  },

  /**
   * Get current user (e.g., on app load)
   * This might involve fetching user data based on the token
   */
  getCurrentUser: async (): Promise<User | null> => {
    const token = getTokenFromCookies();
    if (!token) {
      return null;
    }
    
    try {
      // Example: Fetch user profile using the token
      // Adjust endpoint and response type as needed
      const userDto = await api.get<UserDto>('/auth/me'); 
      return mapUserDtoToDomain(userDto);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // If fetching fails (e.g., invalid token), clear cookies
      clearAuthCookies();
      return null;
    }
  },

  /**
   * Get current session
   * 
   * Check if user has valid session (useful for initial auth state)
   */
  getSession: async (): Promise<{ user: User | null }> => {
    // Try to get user from cookies first
    const cookieUser = getUserFromCookies();
    const token = getTokenFromCookies();
    
    if (cookieUser && token) {
      return { user: cookieUser };
    }
    
    return { user: null };
  }
}; 