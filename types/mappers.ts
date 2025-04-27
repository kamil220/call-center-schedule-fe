/**
 * Data Mappers
 * 
 * Functions to convert between API DTOs (Data Transfer Objects) 
 * and internal domain models.
 */

import { UserDto } from './auth/api.types'; // Using the re-exported UserDto
import { User, UserRole, UserStatus, UserSkill } from './users/domain.types';
import { ApiSkillCategory } from './users/api.types';

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
 * Maps API skills to domain UserSkill array
 */
export const mapSkillsToDomain = (apiSkillCategories: ApiSkillCategory[] = []): UserSkill[] => {
  return apiSkillCategories.flatMap(category => 
    category.skills.map(skill => ({
      skillTag: {
        id: skill.id.toString(),
        name: skill.name,
        category: category.name.toLowerCase() // Use category name directly from API
      },
      rating: skill.level as 1 | 2 | 3 | 4 | 5 // Cast to Rating type
    }))
  );
};

/**
 * Maps a UserDto from the API to the internal User domain model.
 * 
 * @param userDto - The user data object received from the API.
 * @returns A User object conforming to the application's domain model.
 */
export const mapUserDtoToDomain = (userDto: UserDto): User => {
  const mappedRole = mapApiRoleToDomain(userDto.roles || []);

  const domainUser = {
    id: userDto.id,
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    fullName: userDto.fullName,
    role: mappedRole,
    status: userDto.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    skills: mapSkillsToDomain(userDto.skills), // Map skills from API to domain model
  };

  return domainUser;
}; 