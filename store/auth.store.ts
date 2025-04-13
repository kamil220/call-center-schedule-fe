import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { authService } from '@/services/auth.service';

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
}

export const useAuthStore = create<AuthState>()(
  // Add persist middleware to store user session in localStorage/sessionStorage
  persist(
    // Add devtools middleware for debugging (shows up in Redux DevTools)
    devtools(
      (set) => ({
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
            await authService.logout();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            
            // Additional side effects could be handled here
            // e.g., redirecting the user
          } catch (error) {
            set({
              error: 'Error during logout: ' + error,
              isLoading: false,
            });
          }
        },
        
        // Helper to clear error state
        clearError: () => set({ error: null }),
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

// Example of a selector to get user
export const useUser = () => useAuthStore((state) => state.user);

// Example of action selector
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  clearError: state.clearError,
})); 