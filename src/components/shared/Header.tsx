"use client";

import { Bell, Moon, Sun, User, LogOut, Menu, Settings, Search, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  showSearch?: boolean;
}

export default function Header({ 
  onMenuClick, 
  userName = "User",
  userRole = "USER",
  notificationCount = 0,
  showSearch = false
}: HeaderProps) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would implement actual dark mode logic
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 gap-4">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Global Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search permits, applications, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile search toggle */}
        {showSearch && (
          <button
            onClick={() => setShowSearchBar(!showSearchBar)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Mobile search bar */}
        {showSearch && showSearchBar && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
              <button
                onClick={() => setShowSearchBar(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        <div className="lg:hidden flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-700" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="p-2">
                    {notificationCount === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Notification items would go here */}
                        <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">Permit Approved</p>
                          <p className="text-xs text-gray-500 mt-1">Your permit #12345 has been approved</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[var(--navy)] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {userName}
              </span>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--red)] hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
