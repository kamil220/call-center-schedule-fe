import * as React from "react"
import {
  IconDashboard,
  IconFileReport,
  IconTimeline,
  IconUsers,
  IconPhone,
  IconSettings,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import { useUser } from "@/store/auth.store"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useRoleCheck } from "@/hooks/use-role-check"

export function NavRoleBased() {
  const pathname = usePathname()
  const user = useUser()
  const { isAdmin, isPlanner, isTeamManager } = useRoleCheck()
  
  // Define menu items for each role section
  const agentMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Call History",
      url: "/dashboard/call-history",
      icon: IconPhone,
    },
  ]

  const managerMenuItems = [
    {
      title: "Employees",
      url: "/dashboard/users",
      icon: IconUsers,
    },
  ]

  const adminMenuItems: never[] = [
    // Other admin-specific items can go here
  ]

  const administracjaMenuItems = [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
  ]

  // Check if the current path matches the item's URL
  const isItemActive = (itemUrl: string) => {
    // Handle exact match for dashboard, prefix match for others
    return pathname === itemUrl || (itemUrl !== '/dashboard' && pathname.startsWith(itemUrl));
  }

  // Build the main menu items additively based on roles
  const visibleMainMenuItems = React.useMemo(() => {
    let items = [...agentMenuItems]; // Start with Agent items

    if (isTeamManager || isPlanner || isAdmin) { // Managers see their own + Agent items
      items = [...items, ...managerMenuItems];
    }
    
    if (isAdmin) { // Admins see their own (non-admin section) + Planner + Manager + Agent items
      items = [...items, ...adminMenuItems];
    }
    
    // Remove duplicates based on title (or URL if titles can be the same)
    const uniqueItems = items.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.title === item.title
      ))
    );

    return uniqueItems;
  }, [isAdmin, isPlanner, isTeamManager]); // Updated dependencies

  if (!user) return null;

  return (
    <>
      {/* Main Menu Section */}
      <SidebarMenu>
        {visibleMainMenuItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton 
              asChild
              isActive={isItemActive(item.url)}
            >
              <a href={item.url}>
                {item.icon && <item.icon className="size-4" />} 
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      {/* Administration Section (Admin Only) */}
      {isAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel>Administracja</SidebarGroupLabel>
          <SidebarMenu>
            {administracjaMenuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  asChild
                  isActive={isItemActive(item.url)}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon className="size-4" />} 
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
} 