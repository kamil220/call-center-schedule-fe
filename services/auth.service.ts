import { User, UserRole } from '@/types/user';
import { 
  setAuthCookies, 
  clearAuthCookies, 
  getUserFromCookies, 
  getTokenFromCookies 
} from '@/lib/cookies';
// import { api } from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

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
 * Currently uses mock implementations, but prepared for real API integration
 */
class AuthService {
  /**
   * Login user
   * 
   * When real API is ready, uncomment the api.post call and remove the mock implementation
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('AuthService [DEBUG] login:', { email: credentials.email });
    
    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
    // --------------------------------------------------------
    if (credentials.email === 'admin@email.com' && credentials.password === 'admin') {
      const mockAdminUser: User = {
        id: 'mock-admin-id',
        email: 'admin@email.com',
        role: UserRole.ADMIN,
      };
      
      // Set auth cookies
      const token = 'mock-admin-token';
      console.log('AuthService [DEBUG] login: Setting admin cookies', { 
        userRole: mockAdminUser.role,
        token: token.substring(0, 4) + '...'
      });
      
      setAuthCookies(token, mockAdminUser);
      
      // Verify cookies were set correctly for debugging
      const userCookie = getUserFromCookies();
      const tokenCookie = getTokenFromCookies();
      console.log('AuthService [DEBUG] login: Cookies verification', {
        userCookieExists: !!userCookie,
        tokenCookieExists: !!tokenCookie,
        userRole: userCookie?.role
      });
      
      return { success: true, user: mockAdminUser, token };
    } else if (credentials.password === 'password') {
      // Simulate a generic user login for demo purposes
      const mockAgentUser: User = {
        id: `mock-agent-${Math.random().toString(36).substring(7)}`,
        email: credentials.email,
        role: UserRole.AGENT,
      };
      
      // Set auth cookies
      const token = 'mock-agent-token';
      console.log('AuthService [DEBUG] login: Setting agent cookies', { 
        userRole: mockAgentUser.role,
        token: token.substring(0, 4) + '...'
      });
      
      setAuthCookies(token, mockAgentUser);
      
      // Verify cookies were set correctly for debugging
      const userCookie = getUserFromCookies();
      const tokenCookie = getTokenFromCookies();
      console.log('AuthService [DEBUG] login: Cookies verification', {
        userCookieExists: !!userCookie,
        tokenCookieExists: !!tokenCookie,
        userRole: userCookie?.role
      });
      
      return { success: true, user: mockAgentUser, token };
    }
    
    console.log('AuthService [DEBUG] login: Invalid credentials');
    return { success: false, error: 'Invalid email or password' };
    // --------------------------------------------------------

    // REAL IMPLEMENTATION - Uncomment when backend is ready
    // try {
    //   const response = await api.post<LoginResponse>('/auth/login', credentials);
    //   
    //   // If login successful, set auth cookies
    //   if (response.success && response.user && response.token) {
    //     setAuthCookies(response.token, response.user);
    //   }
    //   
    //   return response;
    // } catch (error) {
    //   // Handle specific API errors appropriately
    //   if (error instanceof ApiError) {
    //     return {
    //       success: false,
    //       error: error.data?.message || 'Login failed. Please try again.'
    //     };
    //   }
    //   return { success: false, error: 'An unexpected error occurred' };
    // }
  }

  /**
   * Logout user
   * 
   * When real API is ready, implement token invalidation if needed
   */
  async logout(): Promise<void> {
    // Clear auth cookies
    clearAuthCookies();
    
    // REAL IMPLEMENTATION - Uncomment when backend is ready
    // try {
    //   await api.post('/auth/logout');
    //   clearAuthCookies();
    // } catch (error) {
    //   console.error('Error during logout:', error);
    //   // Still clear cookies on client-side even if API call fails
    //   clearAuthCookies();
    // }
    
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));
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
    
    // REAL IMPLEMENTATION - Uncomment when backend is ready
    // try {
    //   const response = await api.get<{ user: User }>('/auth/session');
    //   return response;
    // } catch (error) {
    //   return { user: null };
    // }
    
    // For now, just return null (session will be managed by frontend storage)
    return { user: null };
  }
}

// Export as singleton
export const authService = new AuthService(); 