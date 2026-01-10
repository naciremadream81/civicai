"use client";

/**
 * Permit Management App - Multi-Role Responsive UI Demo
 * 
 * This page demonstrates a split layout design showcasing how interfaces adapt
 * between Admin View and Citizen View. The design maintains consistent theming
 * while adjusting complexity based on the role.
 * 
 * Features:
 * - Toggle between Admin and Citizen views
 * - Side-by-side split layout on desktop
 * - Stacked layout on mobile devices
 * - Admin View: Analytics cards and approval workflows
 * - Citizen View: Application progress and submission tools
 * - Modern grid-based design with muted color tones
 */

import { useState } from "react";
import AdminView from "@/components/permit-demo/AdminView";
import CitizenView from "@/components/permit-demo/CitizenView";
import { Building2, Users, ToggleRight } from "lucide-react";

export type ViewMode = "admin" | "citizen" | "split";

export default function PermitDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Role Toggle */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--navy)] rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Permit Management System</h1>
                <p className="text-sm text-gray-500">Multi-Role Interface Demo</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("admin")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "admin"
                    ? "bg-white text-[var(--navy)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Admin View</span>
                <span className="sm:hidden">Admin</span>
              </button>
              
              <button
                onClick={() => setViewMode("split")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "split"
                    ? "bg-white text-[var(--navy)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ToggleRight className="w-4 h-4" />
                <span className="hidden sm:inline">Split View</span>
                <span className="sm:hidden">Split</span>
              </button>
              
              <button
                onClick={() => setViewMode("citizen")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "citizen"
                    ? "bg-white text-[var(--navy)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Citizen View</span>
                <span className="sm:hidden">Citizen</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Split View Layout */}
        {viewMode === "split" && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Split View Mode:</strong> This layout demonstrates how both interfaces adapt
                to different screen sizes. On desktop, views appear side-by-side. On mobile, they stack vertically.
              </p>
            </div>

            {/* Split Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Admin View Panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin View</h2>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hidden sm:inline">Full Access</span>
                </div>
                <div className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 shadow-sm overflow-hidden">
                  <div className="max-h-[calc(100vh-300px)] lg:max-h-none overflow-y-auto">
                    <AdminView />
                  </div>
                </div>
              </div>

              {/* Citizen View Panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Citizen View</h2>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hidden sm:inline">Self-Service</span>
                </div>
                <div className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 shadow-sm overflow-hidden">
                  <div className="max-h-[calc(100vh-300px)] lg:max-h-none overflow-y-auto">
                    <CitizenView />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Only View */}
        {viewMode === "admin" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">Admin View - Full Dashboard</h2>
            </div>
            <div className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 shadow-sm">
              <AdminView />
            </div>
          </div>
        )}

        {/* Citizen Only View */}
        {viewMode === "citizen" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">Citizen View - Self-Service Portal</h2>
            </div>
            <div className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 shadow-sm">
              <CitizenView />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Design demonstration showcasing role-based interface adaptation
          </p>
        </div>
      </footer>
    </div>
  );
}