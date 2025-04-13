// Enum defining possible user roles based on documentation
export enum UserRole {
  ADMIN = 'ADMIN', // Can add Planners
  PLANNER = 'PLANNER', // Planista
  TEAM_MANAGER = 'TEAM_MANAGER', // Team Manager
  AGENT = 'AGENT', // Agent
}

// Interface defining the structure of a User object
export interface User {
  id: string; // Or number, depending on your backend
  email: string;
  role: UserRole;
  // Add other fields like name, avatarUrl etc. as needed
} 