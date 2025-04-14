import { User, UserRole, UserStatus } from '@/types/user';
import { 
  setAuthCookies, 
  clearAuthCookies, 
  getUserFromCookies, 
  getTokenFromCookies 
} from '@/lib/cookies';
import { api, ApiError } from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

// API response types
interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  active: boolean;
}

interface ApiLoginResponse {
  token: string;
  user: ApiUser;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

/**
 * Maps API roles to application UserRole enum
 */
function mapApiRoleToUserRole(apiRoles: string[]): UserRole {
  if (apiRoles.includes('ROLE_ADMIN')) {
    return UserRole.ADMIN;
  } else if (apiRoles.includes('ROLE_PLANNER')) {
    return UserRole.PLANNER;
  } else if (apiRoles.includes('ROLE_TEAM_MANAGER')) {
    return UserRole.TEAM_MANAGER;
  } else {
    return UserRole.AGENT;
  }
}

/**
 * Authentication service
 * 
 * Handles user authentication operations (login, logout, session management)
 * Currently uses mock implementations, but prepared for real API integration
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiLoginResponse>('/auth/login', credentials);
      
      // Map API user to our application User type
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        role: mapApiRoleToUserRole(response.user.roles),
        status: response.user.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        fullName: response.user.fullName,
      };
      
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
   * 
   * When real API is ready, implement token invalidation if needed
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

      const response = await api.get<ApiUser>('/auth/me');
      
      // Map API user to our application User type
      const user: User = {
        id: response.id,
        email: response.email,
        role: mapApiRoleToUserRole(response.roles),
        status: response.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        firstName: response.firstName,
        lastName: response.lastName,
        fullName: response.fullName,
      };
      
      return user;
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