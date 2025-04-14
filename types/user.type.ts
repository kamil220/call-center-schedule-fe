/**
 * User type definitions
 * Contains shared interfaces and types for user-related data
 */

import { PaginationParams } from './collection.type';

/**
 * User role types
 */
export type UserRole = 
  | 'ROLE_ADMIN'
  | 'ROLE_PLANNER'
  | 'ROLE_TEAM_MANAGER'
  | 'ROLE_AGENT';

/**
 * Sort field options for users
 */
export type UserSortField = 'id' | 'email' | 'firstName' | 'lastName' | 'active';

/**
 * User filter and pagination parameters
 */
export interface UserListParams extends PaginationParams<UserSortField> {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  active?: boolean;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  active: boolean;
} 