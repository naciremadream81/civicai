"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "CONTRACTOR" | "INSPECTOR" | "ADMIN";
  userName?: string;
  notificationCount?: number;
}

export default function DashboardLayout({
  children,
  role,
  userName = "User",
  notificationCount = 0,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userName={userName}
          userRole={role}
          notificationCount={notificationCount}
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav role={role} />
      </div>
    </div>
  );
}
