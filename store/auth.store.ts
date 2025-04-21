import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { authService } from '@/services/auth.service';
import { getUserFromCookies, getTokenFromCookies } from '@/lib/cookies';
import { setLogoutHandler } from '@/services/api';
import { LoginRequestDto } from '@/types/api/auth';

// Define the state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  // Helper for role checking
  hasRole: (role: UserRole) => boolean;
  // Sync with cookies
  syncWithCookies: () => void;
  // Fetch current user data
  fetchCurrentUser: () => Promise<void>;
}

// Define the AuthActions interface
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  // Add helper action for role checking
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
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
            const credentials: LoginRequestDto = { email, password };
            const result = await authService.login(credentials);
            
            if (result.success && result.user) {
              set({
                user: result.user,
                isAuthenticated: true,
                isLoading: false,
              });
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

        // Updated hasRole to check API roles
        hasRole: (role: UserRole): boolean => {
          const user = get().user;
          if (!user) return false;
          
          // Direct role check - compare the user role to the required role
          // Return true if the user role matches or is higher privilege than the required role
          // ADMIN > TEAM_MANAGER > PLANNER > AGENT
          
          if (user.role === UserRole.ADMIN) {
            // Admin has access to everything
            return true;
          }
          
          if (user.role === UserRole.TEAM_MANAGER) {
            // Team managers have access to team manager, planner, and agent roles
            return role === UserRole.TEAM_MANAGER ||
                   role === UserRole.PLANNER ||
                   role === UserRole.AGENT;
          }
          
          if (user.role === UserRole.PLANNER) {
            // Planners have access to planner and agent roles
            return role === UserRole.PLANNER || 
                   role === UserRole.AGENT;
          }
          
          if (user.role === UserRole.AGENT) {
            // Agents only have access to agent role
            return role === UserRole.AGENT;
          }

          // Fall back to direct comparison if none of the above apply
          const result = user.role === role;
          return result;
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

        // Fetch current user data
        fetchCurrentUser: async () => {
          set({ isLoading: true });
          
          try {
            const user = await authService.getCurrentUser();
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (error) {
            set({
              error: 'An unexpected error occurred: ' + error,
              isLoading: false,
            });
          }
        },

        // Check session
        checkSession: async () => {
          // Only check if not already authenticated and not loading
          if (get().isAuthenticated || get().isLoading) return;
          
          set({ isLoading: true, error: null });
          const token = getTokenFromCookies(); // Check for token first
          const user = token ? await authService.getCurrentUser() : null;
          
          set({
            user: user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        },
      }),
      {
        name: 'auth-storage', // Name of the item in storage
        // Optional: partialize to exclude certain parts of state from persistence
        // partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'auth-store' } // Name for Redux DevTools
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
  fetchCurrentUser: state.fetchCurrentUser,
}));

// Set the API logout handler to use our store's logout function
// Do this after store initialization
const initLogoutHandler = () => {
  // Get the state directly from the store
  const logout = useAuthStore.getState().logout;
  
  // Set the handler in the API
  setLogoutHandler(() => {
    logout();
  });
};

// Initialize right away
initLogoutHandler();

// Initialize state from cookies on store creation
// This ensures the initial state reflects any existing session
// We run checkSession here, which handles loading the user if a token exists
useAuthStore.getState().checkSession(); 