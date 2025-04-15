/**
 * Authentication Store Types
 * 
 * Defines the shape of the authentication state and related types
 * used within the application's state management (e.g., Zustand).
 */

import { User } from '../users/domain.types'; // Import the domain User model

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 