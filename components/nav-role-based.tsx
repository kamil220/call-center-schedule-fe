import * as React from "react"
import {
  IconCalendarTime,
  IconChartAreaLine,
  IconDashboard,
  IconFileCertificate,
  IconFileReport,
  IconTimeline,
  IconUserCircle,
  IconUsers,
  IconListDetails,
  IconTerminal2,
  IconSettings,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import { UserRole } from "@/types/user"
import { useUser, useHasRole } from "@/store/auth.store"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"

export function NavRoleBased() {
  const user = useUser()
  const pathname = usePathname()
  const isTeamManager = useHasRole(UserRole.TEAM_MANAGER)
  const isPlanner = useHasRole(UserRole.PLANNER)
  const isAdmin = useHasRole(UserRole.ADMIN)
  
  // Define menu items based on roles
  const agentMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Mój grafik",
      url: "/my-schedule",
      icon: IconCalendarTime,
    },
    {
      title: "Wnioski urlopowe",
      url: "/leave-requests",
      icon: IconFileCertificate,
    },
    {
      title: "Profil pracownika",
      url: "/employee-profile",
      icon: IconUserCircle,
    },
  ]

  const managerMenuItems = [
    {
      title: "Pracownicy",
      url: "/dashboard/employees",
      icon: IconUsers,
    },
    {
      title: "Efektywność",
      url: "/efficiency",
      icon: IconChartAreaLine,
    },
    // Note: Wnioski urlopowe already in agent menu
  ]

  const plannerMenuItems = [
    {
      title: "Raporty",
      url: "/reports",
      icon: IconFileReport,
    },
    {
      title: "Planer",
      url: "/planner",
      icon: IconTimeline,
    },
    {
      title: "Dostępność pracowników",
      url: "/employee-availability",
      icon: IconListDetails,
    },
  ]

  // Admin menu items - removed Użytkownicy as it will be in the Administracja section
  const adminMenuItems = [
    {
      title: "Logi systemowe",
      url: "/system-logs",
      icon: IconTerminal2,
    },
  ]

  // New Administracja section with Użytkownicy at the top
  const administracjaMenuItems = [
    {
      title: "Użytkownicy",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Ustawienia",
      url: "/admin/settings",
      icon: IconSettings,
    },
  ]

  // Check if the current path matches the item's URL
  const isItemActive = (itemUrl: string) => {
    return pathname === itemUrl || 
           (itemUrl !== '/dashboard' && pathname.startsWith(itemUrl));
  }

  // Get all visible menu items based on role
  const visibleItems = React.useMemo(() => {
    let items = [...agentMenuItems]
    
    if (isTeamManager) {
      items = [...items, ...managerMenuItems]
    }
    
    if (isPlanner) {
      items = [...items, ...plannerMenuItems]
    }
    
    if (isAdmin) {
      items = [...items, ...administracjaMenuItems, ...adminMenuItems]
    }
    
    return items
  }, [isTeamManager, isPlanner, isAdmin])

  if (!user) return null

  return (
    <>
      <SidebarMenu>
        {visibleItems.map((item, index) => (
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
      
      {/* Display Administracja section for admin users */}
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