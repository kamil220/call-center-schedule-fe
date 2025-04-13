import { AuthState, AuthAction } from '@/types/auth.types';

// Initial state for the reducer
export const initialState: AuthState = {
  user: null,
  isLoading: true, // Start loading initially
  isAuthenticated: false,
};

// Implement Reducer Function
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false, // Finished loading after initialization
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING': // Optional: if you need to manually set loading elsewhere
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      // Ensure exhaustiveness checking for action types in the future
      // const _exhaustiveCheck: never = action;
      return state;
  }
}; 