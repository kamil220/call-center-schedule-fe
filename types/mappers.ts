/**
 * Data Mappers
 * 
 * Functions to convert between API DTOs (Data Transfer Objects) 
 * and internal domain models.
 */

import { UserDto } from './auth/api.types'; // Using the re-exported UserDto
import { User, UserRole, UserStatus } from './users/domain.types';

/**
 * Maps the API UserRole string (e.g., 'ROLE_ADMIN') to the domain UserRole enum.
 * 
 * @param apiRoles - Array of role strings from the API.
 * @returns The corresponding domain UserRole enum value (defaults to AGENT if mapping fails).
 */
export const mapApiRoleToDomain = (apiRoles: string[]): UserRole => {
  // Assuming the primary role is the first one relevant to our domain enum
  const apiRole = apiRoles?.[0];
  // console.log('apiRole', apiRole); // Log from previous debugging
  switch (apiRole) {
    case 'ROLE_ADMIN': return UserRole.ADMIN;
    case 'ROLE_PLANNER': return UserRole.PLANNER;
    case 'ROLE_TEAM_MANAGER': return UserRole.TEAM_MANAGER;
    case 'ROLE_AGENT': return UserRole.AGENT;
    default:
      console.warn(`[Mapper] Unknown API role encountered: ${apiRole}`);
      return UserRole.AGENT; // Default fallback
  }
};

/**
 * Maps a UserDto from the API to the internal User domain model.
 * 
 * @param userDto - The user data object received from the API.
 * @returns A User object conforming to the application's domain model.
 */
export const mapUserDtoToDomain = (userDto: UserDto): User => {
  const mappedRole = mapApiRoleToDomain(userDto.roles);
  console.log('[Mapper] mapUserDtoToDomain - Mapped Role:', mappedRole, '(from API roles:', userDto.roles, ')');

  const domainUser = {
    id: userDto.id,
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    fullName: userDto.fullName,
    role: mappedRole, // Map roles
    status: userDto.active ? UserStatus.ACTIVE : UserStatus.INACTIVE, // Map active to status enum
  };
  console.log('[Mapper] mapUserDtoToDomain - Returning Domain User:', domainUser);
  return domainUser;
}; 