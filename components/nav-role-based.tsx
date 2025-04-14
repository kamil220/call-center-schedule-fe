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
} from "@tabler/icons-react"

import { UserRole } from "@/types/user"
import { useUser, useHasRole } from "@/store/auth.store"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

export function NavRoleBased() {
  const user = useUser()
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

  const adminMenuItems = [
    {
      title: "Użytkownicy",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Logi systemowe",
      url: "/system-logs",
      icon: IconTerminal2,
    },
  ]

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
      items = [...items, ...adminMenuItems]
    }
    
    return items
  }, [isTeamManager, isPlanner, isAdmin])

  if (!user) return null

  return (
    <SidebarMenu>
      {visibleItems.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton asChild>
            <a href={item.url}>
              {item.icon && <item.icon className="size-4" />}
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
} 