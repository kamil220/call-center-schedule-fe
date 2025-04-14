/**
 * API authentication types
 * 
 * These types exactly match the API response structure.
 * They should be used for API communication and then mapped to domain models.
 */

// Login request DTO
export interface LoginRequestDto {
  email: string;
  password: string;
  [key: string]: unknown;
}

// User data from API
export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  active: boolean;
}

// Login response DTO
export interface LoginResponseDto {
  token: string;
  user: UserDto;
} 