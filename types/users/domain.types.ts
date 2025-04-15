/**
 * User Domain Models and Types
 * 
 * Defines the core data structures and types used within the application's 
 * business logic related to users and employees.
 */

// Enum defining possible user roles for internal application use
export enum UserRole {
  ADMIN = 'Admin',
  PLANNER = 'Planner',
  TEAM_MANAGER = 'Team Manager',
  AGENT = 'Agent',
}

// Enum for user status
export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

// Available specialization tags for employees
export type SpecializationTag = 
  | 'Sales' 
  | 'Technical Support' 
  | 'Customer Service' 
  | 'Administration' 
  | 'HR' 
  | 'IT' 
  | 'Management';

// Rating scale (1-5)
export type Rating = 1 | 2 | 3 | 4 | 5;

// Schedule day types
export type ScheduleDayType = 'work' | 'vacation' | 'sick';

// Schedule day structure
export interface ScheduleDay {
  type: ScheduleDayType;
  shift?: string;
  hours?: string;
  specializations?: string[];
  reason?: string;
}

// Efficiency details structure
export interface EfficiencyDetails {
  overall: Rating;
  workSpeed: Rating;
  confidence: Rating;
  knowledge: Rating;
}

// Employee comment structure
export interface EmployeeComment {
  id: string;
  authorId: string;
  date: string; // ISO date
  content: string;
}

// Interface defining the structure of a User domain model
export interface User {
  id: string; 
  email: string;
  role: UserRole; // Use the domain enum
  status: UserStatus;
  firstName: string;
  lastName: string;
  fullName: string;
  // Add other domain-specific fields as needed
}

/**
 * Extended User type for use in certain views that need additional properties
 * beyond the basic User type.
 */
export interface ExtendedUser extends Omit<User, 'firstName' | 'lastName' | 'fullName'> {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name: string; // Display name
  hireDate?: string;
  manager: string | null;
  managerName?: string | null; // Name of the manager for display purposes
}

// Employee type with all the extended information
export interface Employee extends ExtendedUser {
  specializations: SpecializationTag[];
  efficiency: EfficiencyDetails;
  workload: number; // Percentage 0-100
  comments: EmployeeComment[];
  schedule?: Record<string, ScheduleDay>; // Date -> Schedule day information
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
} 