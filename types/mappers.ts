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
  // Return the highest priority role if multiple roles exist
  if (!apiRoles || !apiRoles.length) {
    console.warn('[Mapper] No roles provided, defaulting to AGENT');
    return UserRole.AGENT;
  }
  
  // Check for admin role first (highest priority)
  if (apiRoles.includes('ROLE_ADMIN')) {
    return UserRole.ADMIN;
  }
  
  // Then check for other roles in order of priority
  if (apiRoles.includes('ROLE_TEAM_MANAGER')) {
    return UserRole.TEAM_MANAGER;
  }
  
  if (apiRoles.includes('ROLE_PLANNER')) {
    return UserRole.PLANNER;
  }
  
  if (apiRoles.includes('ROLE_AGENT')) {
    return UserRole.AGENT;
  }
  
  console.warn(`[Mapper] Unknown API roles encountered: ${apiRoles.join(', ')}`);
  return UserRole.AGENT; // Default fallback
};

/**
 * Maps a UserDto from the API to the internal User domain model.
 * 
 * @param userDto - The user data object received from the API.
 * @returns A User object conforming to the application's domain model.
 */
export const mapUserDtoToDomain = (userDto: UserDto): User => {
  console.log('[Mapper] mapUserDtoToDomain - Received userDto:', JSON.stringify(userDto));
  
  if (!userDto.roles || !Array.isArray(userDto.roles)) {
    console.warn('[Mapper] mapUserDtoToDomain - No roles array in userDto:', userDto);
  }
  
  const mappedRole = mapApiRoleToDomain(userDto.roles || []);
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
  console.log('[Mapper] mapUserDtoToDomain - Returning Domain User:', JSON.stringify(domainUser));
  return domainUser;
}; 