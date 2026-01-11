"use client";

/**
 * SidebarNav Component
 * 
 * Sidebar navigation menu that adapts based on user role.
 * Shows different navigation items for admin vs citizen.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  Users,
  User as UserIcon,
  Plus
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  citizenOnly?: boolean;
}

export default function SidebarNav() {
  const pathname = usePathname();
  const { role } = useRole();

  // Define nav items - base items for all roles
  const baseNavItems: NavItem[] = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/applications", label: "Applications", icon: FileText },
    { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { 
      href: "/users", 
      label: role === "admin" ? "Users" : "Profile", 
      icon: role === "admin" ? Users : UserIcon 
    },
  ];

  // Add citizen-only items
  const citizenNavItems: NavItem[] = role === "citizen" 
    ? [{ href: "/new-application", label: "New Application", icon: Plus, citizenOnly: true }]
    : [];

  // Combine all nav items
  const navItems: NavItem[] = [
    baseNavItems[0], // Dashboard
    baseNavItems[1], // Applications
    ...citizenNavItems, // New Application (citizen only)
    ...baseNavItems.slice(2), // Approvals, Reports, Users/Profile
  ];

  // Filter nav items based on role (though we've already filtered by adding conditionally)
  const filteredItems = navItems.filter((item) => {
    if (item.adminOnly && role !== "admin") return false;
    if (item.citizenOnly && role !== "citizen") return false;
    return true;
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href)) ||
            (item.href === "/new-application" && pathname === "/new-application");

          // Handle Users/Profile label based on role
          const label = item.href === "/users" 
            ? (role === "admin" ? "Users" : "Profile")
            : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
