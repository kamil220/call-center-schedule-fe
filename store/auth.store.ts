import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserRole } from '@/types/user';
import { authService } from '@/services/auth.service';
import { getUserFromCookies, getTokenFromCookies } from '@/lib/cookies';

// Define the state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  // Helper for role checking
  hasRole: (role: UserRole) => boolean;
  // Sync with cookies
  syncWithCookies: () => void;
}

export const useAuthStore = create<AuthState>()(
  // Add persist middleware to store user session in localStorage/sessionStorage
  persist(
    // Add devtools middleware for debugging (shows up in Redux DevTools)
    devtools(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        // Login action
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await authService.login({ email, password });
            
            if (result.success && result.user) {
              set({
                user: result.user,
                isAuthenticated: true,
                isLoading: false,
              });
              
              // Additional side effects could be handled here or in a middleware
              // e.g., redirecting the user
            } else {
              set({
                error: result.error || 'Login failed',
                isLoading: false,
              });
            }
          } catch (error) {
            set({
              error: 'An unexpected error occurred: ' + error,
              isLoading: false,
            });
          }
        },
        
        // Logout action
        logout: async () => {
          set({ isLoading: true });
          
          try {
            // This already clears cookies internally
            await authService.logout();
            // Update the store state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            
          } catch (error) {
            console.error('Auth Store [DEBUG] logout: Error during logout:', error);
            set({
              error: 'Error during logout: ' + error,
              isLoading: false,
            });
          }
        },
        
        // Helper to clear error state
        clearError: () => set({ error: null }),

        // Helper to check if user has a specific role or higher
        hasRole: (role: UserRole) => {
          const { user } = get();
          if (!user) {
            return false;
          }

          const roleHierarchy = {
            [UserRole.AGENT]: 1,
            [UserRole.TEAM_MANAGER]: 2,
            [UserRole.PLANNER]: 3,
            [UserRole.ADMIN]: 4
          };

          const hasRole = roleHierarchy[user.role] >= roleHierarchy[role];
          return hasRole;
        },
        
        // Sync store with cookies
        syncWithCookies: () => {
          // Check if we have authenticated user in cookies
          const user = getUserFromCookies();
          const token = getTokenFromCookies();
          
          if (user && token) {
            // Update store with cookie data if available           
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        },
      }),
      { name: 'auth-store' } // Name for Redux DevTools
    ),
    {
      name: 'auth-session', // localStorage/sessionStorage key
      // Use sessionStorage instead of localStorage
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name);
          }
        },
      },
    }
  )
);

// Example of a selector to get authentication status
export const useAuthStatus = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));

// Get user data
export const useUser = () => useAuthStore((state) => state.user);

// Check if user has a specific role
export const useHasRole = (role: UserRole) => useAuthStore((state) => state.hasRole(role));

// Get auth actions
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  clearError: state.clearError,
  syncWithCookies: state.syncWithCookies,
})); 