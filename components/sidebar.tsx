'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, useAuthActions } from '@/store/auth.store';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  ClipboardCheck,
  UserCheck,
  LogOut,
  BriefcaseBusiness
} from 'lucide-react';

const commonLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const roleLinks = {
  [UserRole.ADMIN]: [
    { href: '/dashboard/users', label: 'Manage Users', icon: Users },
    // Add other ADMIN specific links here
  ],
  [UserRole.PLANNER]: [
    { href: '/dashboard/schedules', label: 'Manage Schedules', icon: CalendarDays },
    { href: '/dashboard/availability', label: 'Agent Availability', icon: ClipboardList },
    // Add other PLANNER specific links here
  ],
  [UserRole.TEAM_MANAGER]: [
    { href: '/dashboard/team-view', label: 'Team View', icon: BriefcaseBusiness },
    { href: '/dashboard/requests', label: 'Approve Requests', icon: ClipboardCheck },
    // Add other TEAM_MANAGER specific links here
  ],
  [UserRole.AGENT]: [
    { href: '/dashboard/my-schedule', label: 'My Schedule', icon: CalendarDays },
    { href: '/dashboard/submit-request', label: 'Submit Request', icon: UserCheck },
    // Add other AGENT specific links here
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const user = useUser();
  const { logout } = useAuthActions();

  const links = user ? [...commonLinks, ...(roleLinks[user.role] || [])] : [...commonLinks];

  return (
    <aside className="w-64 flex flex-col border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold tracking-tight">Scheduler App</h2>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-muted text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 border-t">
        {user && (
          <div className="mb-2 text-sm">
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">Role: {user.role}</p>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
} 