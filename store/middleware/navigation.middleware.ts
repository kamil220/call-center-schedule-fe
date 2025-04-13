import { StateCreator } from 'zustand';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// State with user property
interface UserAwareState {
  user: unknown;
}

// Type of middleware function
type NavigationMiddleware = <T extends NavigationState>(
  f: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

// State slice that the middleware requires
interface NavigationState {
  router?: AppRouterInstance;
  navigate: (path: string) => void;
  setRouter: (router: AppRouterInstance) => void;
}

// Create the middleware
export const createNavigationMiddleware = (): NavigationMiddleware => (create) => (set, get, api) => {
  return create(
    set,
    get,
    api
  );
};

// Middleware factory to include navigation in a store
export const withNavigation = <T extends NavigationState & UserAwareState>(config: StateCreator<T, [], []>): StateCreator<T, [], []> => (set, get, api) => {
  return config(
    (partial, replace) => {
      // Intercept state updates to handle navigation effects
      if ('user' in partial && partial.user !== null && get().user === null) {
        // If user just logged in, navigate to dashboard after state update
        setTimeout(() => {
          const router = get().router;
          if (router) {
            router.push('/dashboard');
          }
        }, 0);
      } else if ('user' in partial && partial.user === null && get().user !== null) {
        // If user just logged out, navigate to login
        setTimeout(() => {
          const router = get().router;
          if (router) {
            router.push('/login');
          }
        }, 0);
      }
      
      // Apply the state update
      set(partial, replace);
    },
    get,
    api
  );
};

// Slice to inject into stores for navigation
export const createNavigationSlice = <T>(): StateCreator<T & NavigationState, [], [], NavigationState> => (set) => ({
  router: undefined,
  navigate: (path: string) => {
    const state = useStore.getState() as T & NavigationState;
    if (state.router) {
      state.router.push(path);
    } else {
      console.error('Router not initialized. Call setRouter first.');
    }
  },
  setRouter: (router: AppRouterInstance) => set({ router } as Partial<T & NavigationState>),
});

// This is a placeholder and should be replaced with your actual store
// It's only used for TypeScript to recognize the getState method
const useStore = { getState: () => ({}) }; 