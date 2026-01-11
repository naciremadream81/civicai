"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Bell, 
  Settings, 
  Users, 
  BarChart3,
  ClipboardCheck,
  X
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  role: "CONTRACTOR" | "INSPECTOR" | "ADMIN";
  isOpen: boolean;
  onClose: () => void;
}

const contractorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/permits", label: "My Permits", icon: FileText },
  { href: "/permits/new", label: "Submit Permit", icon: Upload },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const inspectorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inspections", label: "Inspections", icon: ClipboardCheck },
  { href: "/permits", label: "Assigned Permits", icon: FileText },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/permits", label: "Applications", icon: FileText },
  { href: "/admin/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/admin/analytics", label: "Reports", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  const links = role === "CONTRACTOR" 
    ? contractorLinks 
    : role === "INSPECTOR" 
    ? inspectorLinks 
    : adminLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[var(--navy)]">PermitSystem</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                // Handle exact matches and nested routes
                let isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                // Special case: map alternative routes to their target pages
                if (link.href === "/admin/permits" && pathname === "/admin/applications") {
                  isActive = true;
                }
                if (link.href === "/admin/approvals" && pathname === "/admin/approvals") {
                  isActive = true;
                }
                if (link.href === "/admin/analytics" && pathname === "/admin/reports") {
                  isActive = true;
                }
                
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                      onClick={onClose}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="px-4 py-2 text-sm text-gray-500">
              <p className="font-medium">Role: {role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
