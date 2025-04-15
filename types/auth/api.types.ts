/**
 * Authentication API DTOs (Data Transfer Objects)
 * 
 * These types define the exact structure for API requests and responses
 * related to authentication.
 */

// Login request DTO
export interface LoginRequestDto {
  email: string;
  password: string;
  [key: string]: unknown; // Allow extra properties if needed by API
}

// User data DTO received from the API
export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[]; // Roles as strings (e.g., 'ROLE_ADMIN') from API
  active: boolean;
}

// Login response DTO
export interface LoginResponseDto {
  token: string;
  user: UserDto;
} 