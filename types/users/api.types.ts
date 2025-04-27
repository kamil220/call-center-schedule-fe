/**
 * User API DTOs and Related Types
 * 
 * Defines the types used for interacting with the user-related API endpoints.
 */

import { PaginationParams } from '../common/collection.type';

// Re-export the UserDto from auth/api.types as it seems to be the same
// If the /users endpoint returns a different structure, define UserDto separately here.
export { type UserDto } from '../auth/api.types'; 

/**
 * Employment types as defined by the API
 */
export enum ApiEmploymentType {
  EMPLOYMENT_CONTRACT = 'employment_contract',
  CIVIL_CONTRACT = 'civil_contract',
  CONTRACTOR = 'contractor'
}

/**
 * Leave types as defined by the API
 */
export enum ApiLeaveType {
  SICK_LEAVE = 'sick_leave',
  HOLIDAY = 'holiday',
  PERSONAL_LEAVE = 'personal_leave',
  PATERNITY_LEAVE = 'paternity_leave',
  MATERNITY_LEAVE = 'maternity_leave'
}

/**
 * Skill data as received from the API
 */
export interface ApiSkill {
  id: number;
  name: string;
  level: number;
}

/**
 * Skill category with its skills as received from the API
 */
export interface ApiSkillCategory {
  id: number;
  name: string;
  skills: ApiSkill[];
}

/**
 * Raw API User Data as received from the API with roles array.
 * This represents the actual shape of user data from the API,
 * before it's mapped to the domain User model.
 */
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[]; // API returns roles as string array (e.g., ["ROLE_ADMIN"])
  active: boolean;
  hireDate: string | null;
  manager: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  employmentType: ApiEmploymentType | null;
  skills: ApiSkillCategory[]; // Add skills to ApiUser interface
}

/**
 * User role types as defined by the API (e.g., 'ROLE_ADMIN')
 */
export type UserRoleApi = 
  | 'ROLE_ADMIN'
  | 'ROLE_PLANNER'
  | 'ROLE_TEAM_MANAGER'
  | 'ROLE_AGENT';

/**
 * Available roles for user creation and management
 */
export const AVAILABLE_ROLES: UserRoleApi[] = [
  'ROLE_ADMIN',
  'ROLE_PLANNER',
  'ROLE_TEAM_MANAGER',
  'ROLE_AGENT'
];

/**
 * Sort field options for user lists from the API
 */
export type UserSortFieldApi = 'id' | 'email' | 'firstName' | 'lastName' | 'active';

/**
 * User filter and pagination parameters for API requests
 */
export interface UserListParamsDto extends PaginationParams<UserSortFieldApi> {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  roles?: UserRoleApi[];
  active?: boolean;
}

/**
 * Request DTO for creating a new user
 */
export interface CreateUserRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: UserRoleApi[];
} 