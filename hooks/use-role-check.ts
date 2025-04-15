import { UserRole } from "@/types";
import { ApiUser } from "@/types";
import { useUser, useHasRole } from "@/store/auth.store";

/**
 * Hook providing more detailed role-based permissions control.
 * Combines the role checking functionality provided by auth.store
 * with direct checking of values in the roles array.
 */
export function useRoleCheck() {
  const user = useUser();

  /**
   * Checks if the user has a specific API role (e.g., "ROLE_ADMIN")
   */
  const hasApiRole = (apiRole: string): boolean => {
    if (!user) return false;
    // Cast to ApiUser to access the roles array
    const apiUser = user as unknown as ApiUser;
    return Array.isArray(apiUser.roles) && apiUser.roles.includes(apiRole);
  };

  /**
   * Checks if the user has Admin role
   */
  const isAdmin = useHasRole(UserRole.ADMIN) || hasApiRole('ROLE_ADMIN');

  /**
   * Checks if the user has Planner role
   */
  const isPlanner = useHasRole(UserRole.PLANNER) || hasApiRole('ROLE_PLANNER');

  /**
   * Checks if the user has Team Manager role
   */
  const isTeamManager = useHasRole(UserRole.TEAM_MANAGER) || hasApiRole('ROLE_TEAM_MANAGER');

  /**
   * Checks if the user has Agent role (default role)
   */
  const isAgent = useHasRole(UserRole.AGENT) || hasApiRole('ROLE_AGENT');

  return {
    hasApiRole,
    isAdmin,
    isPlanner,
    isTeamManager,
    isAgent,
  };
} 