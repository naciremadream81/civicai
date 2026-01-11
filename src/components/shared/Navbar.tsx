"use client";

/**
 * Navbar Component
 * 
 * Top navigation bar with:
 * - Search functionality
 * - Notifications (bell icon)
 * - User avatar
 * - Role toggle switch
 */

import { Search, Bell, User as UserIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { useState } from "react";

export default function Navbar() {
  const { role, toggleRole } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo/Brand - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Permit Manager</span>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search permits, applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Role Toggle */}
            <button
              onClick={toggleRole}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              title={`Switch to ${role === "admin" ? "Citizen" : "Admin"} view`}
            >
              {role === "admin" ? (
                <>
                  <ToggleRight className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-green-600" />
                  <span className="hidden sm:inline">Citizen</span>
                </>
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-2">
                      <div className="p-3 text-sm text-gray-600">
                        {role === "admin" ? "3 new approvals pending" : "Your application status has been updated"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {role === "admin" ? "City Official" : "John Doe"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <div className="p-1">
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Profile
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Settings
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded">
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
