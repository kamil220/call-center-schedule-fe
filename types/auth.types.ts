import { User } from './user';

// 1. Define State Interface
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 2. Define Action Types
export type AuthAction =
  | { type: 'INITIALIZE'; payload: { user: User | null } }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }; 