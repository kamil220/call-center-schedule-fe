import { User } from '@/types/user';
import { 
  setAuthCookies, 
  clearAuthCookies, 
  getUserFromCookies, 
  getTokenFromCookies 
} from '@/lib/cookies';
import { api } from './api';
import { ApiError } from '../types/api.type';
import { LoginRequestDto, LoginResponseDto, UserDto } from '@/types/api/auth';
import { mapApiUserToUser } from '@/types/mappers';

// Custom response type for login
export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

/**
 * Authentication service
 * 
 * Handles user authentication operations (login, logout, session management)
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponseDto>('/auth/login', credentials);
      
      // Map API user to our application User type
      const user = mapApiUserToUser(response.user);
      
      // Save the token and user info
      setAuthCookies(response.token, user);
      
      return { 
        success: true, 
        user, 
        token: response.token 
      };
    } catch (error) {
      // Handle specific API errors appropriately
      if (error instanceof ApiError) {
        if (error.status === 401) {
          return {
            success: false,
            error: 'Invalid email or password'
          };
        }
        return {
          success: false,
          error: typeof error.data === 'object' && error.data && 'message' in error.data 
            ? String(error.data.message) 
            : 'Login failed. Please try again.'
        };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // Clear auth cookies
    clearAuthCookies();
        
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Get information about the current logged-in user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        return null;
      }

      const response = await api.get<UserDto>('/auth/me');
      
      // Map API user to our application User type
      return mapApiUserToUser(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Clear cookies if the session is invalid
        clearAuthCookies();
      }
      return null;
    }
  }

  /**
   * Get current session
   * 
   * Check if user has valid session (useful for initial auth state)
   */
  async getSession(): Promise<{ user: User | null }> {
    // Try to get user from cookies first
    const cookieUser = getUserFromCookies();
    const token = getTokenFromCookies();
    
    if (cookieUser && token) {
      return { user: cookieUser };
    }
    
    return { user: null };
  }
}

// Export as singleton
export const authService = new AuthService(); 