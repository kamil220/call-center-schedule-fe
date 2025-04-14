/**
 * Type mappers
 * 
 * Functions to convert between API DTOs and domain models
 */

import { UserDto } from './api/auth';
import { User, UserRole, UserStatus } from './user';

/**
 * Maps API roles to application UserRole enum
 */
export function mapApiRoleToUserRole(apiRoles: string[]): UserRole {
  if (apiRoles.includes('ROLE_ADMIN')) {
    return UserRole.ADMIN;
  } else if (apiRoles.includes('ROLE_PLANNER')) {
    return UserRole.PLANNER;
  } else if (apiRoles.includes('ROLE_TEAM_MANAGER')) {
    return UserRole.TEAM_MANAGER;
  } else {
    return UserRole.AGENT;
  }
}

/**
 * Maps API UserDto to application User model
 */
export function mapApiUserToUser(apiUser: UserDto): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: mapApiRoleToUserRole(apiUser.roles),
    status: apiUser.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    fullName: apiUser.fullName,
  };
} 