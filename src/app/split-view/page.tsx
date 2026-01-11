"use client";

/**
 * Split-Screen Multi-Role Permit Management UI
 * 
 * A responsive split-screen layout showcasing both Admin and Citizen views
 * side-by-side. Features a toggle switch to switch between views and a
 * comprehensive layout that adapts to mobile devices.
 * 
 * Design Features:
 * - Professional muted colors (white, blue, grey tones)
 * - Rounded UI elements for modern appearance
 * - Large, clear typography (Inter/Roboto)
 * - Role-based icons and visual hierarchy
 * - Responsive grid layout
 */

import { useState } from "react";
import AdminDashboardView from "@/components/permit-demo/AdminDashboardView";
import CitizenPortalView from "@/components/permit-demo/CitizenPortalView";
import { Building2, Users, Layout } from "lucide-react";

export type ViewMode = "admin" | "citizen" | "split";

export default function SplitViewPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar with Toggle Switch */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Permit Management System
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">
                  Multi-Role Split-Screen Interface
                </p>
              </div>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-1.5 w-full lg:w-auto">
              {/* Admin View Toggle */}
              <button
                onClick={() => setViewMode("admin")}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-sm lg:text-base font-semibold transition-all duration-200 ${
                  viewMode === "admin"
                    ? "bg-white text-blue-700 shadow-md border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Admin View</span>
              </button>

              {/* Split View Toggle */}
              <button
                onClick={() => setViewMode("split")}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-sm lg:text-base font-semibold transition-all duration-200 ${
                  viewMode === "split"
                    ? "bg-white text-blue-700 shadow-md border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <Layout className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Split View</span>
                <span className="sm:hidden">Split</span>
              </button>

              {/* Citizen View Toggle */}
              <button
                onClick={() => setViewMode("citizen")}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 rounded-lg text-sm lg:text-base font-semibold transition-all duration-200 ${
                  viewMode === "citizen"
                    ? "bg-white text-blue-700 shadow-md border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Citizen View</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1920px] mx-auto">
        {/* Split View Layout */}
        {viewMode === "split" && (
          <div className="p-4 lg:p-6">
            {/* Info Banner */}
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layout className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Split View Mode</p>
                  <p className="text-xs text-blue-700">
                    View both Admin and Citizen interfaces side-by-side. On mobile devices, the views will stack vertically for optimal viewing.
                  </p>
                </div>
              </div>
            </div>

            {/* Split Layout Grid - Fixed alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Admin View Panel (Left) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm mb-4 h-[80px]">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-2 h-8 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                        Admin View
                      </h2>
                      <p className="text-xs text-gray-500 truncate">City Official Dashboard</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0 ml-2 whitespace-nowrap">
                    Full Access
                  </span>
                </div>
                <div className="border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden flex-1" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 280px)' }}>
                  <AdminDashboardView />
                </div>
              </div>

              {/* Citizen View Panel (Right) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-green-200 shadow-sm mb-4 h-[80px]">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-2 h-8 bg-green-600 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                        Citizen View
                      </h2>
                      <p className="text-xs text-gray-500 truncate">Self-Service Portal</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex-shrink-0 ml-2 whitespace-nowrap">
                    Self-Service
                  </span>
                </div>
                <div className="border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden flex-1" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 280px)' }}>
                  <CitizenPortalView />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Only View */}
        {viewMode === "admin" && (
          <div className="p-4 lg:p-6">
            <div className="mb-6 flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Admin View - Full Dashboard
                </h2>
                <p className="text-sm text-gray-500">Complete administrative interface for city officials</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
              <AdminDashboardView />
            </div>
          </div>
        )}

        {/* Citizen Only View */}
        {viewMode === "citizen" && (
          <div className="p-4 lg:p-6">
            <div className="mb-6 flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-green-200 shadow-sm">
              <div className="w-2 h-8 bg-green-600 rounded-full"></div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Citizen View - Self-Service Portal
                </h2>
                <p className="text-sm text-gray-500">Streamlined interface for permit applicants</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
              <CitizenPortalView />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Split-Screen Multi-Role Permit Management Interface
          </p>
        </div>
      </footer>
    </div>
  );
}