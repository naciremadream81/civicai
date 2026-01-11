"use client";

/**
 * Reports Page
 * 
 * Role-based reports view:
 * - Admin: Analytics & exportable reports with charts
 * - Citizen: Basic stats only
 */

import { useRole } from "@/context/RoleContext";
import { BarChart3, TrendingUp, Download, FileText, Calendar } from "lucide-react";

export default function ReportsPage() {
  const { role } = useRole();

  // Admin View
  if (role === "admin") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive system analytics and insights</p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Permits</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">317</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Approval Rate</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">88.5%</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2.3% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg Processing</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">3.2 days</p>
            <p className="text-xs text-gray-500">Target: 5 days</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Inspections</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">176</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permit Applications Trend</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart visualization would appear here</p>
              <p className="text-xs text-gray-400 mt-1">(Integration with charting library required)</p>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Monthly Summary", "Application Status", "Performance Metrics", "Inspections Report", "Approval Statistics", "User Activity"].map((report) => (
              <button
                key={report}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">{report}</h3>
                </div>
                <p className="text-xs text-gray-500">Generate and export report</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Citizen View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Statistics</h1>
        <p className="text-gray-600 mt-1">Basic statistics about your applications</p>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-600">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-xs text-gray-600">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Limited Statistics Available</h3>
            <p className="text-sm text-blue-700">
              As a citizen user, you have access to basic statistics about your own applications.
              For detailed analytics and reports, please contact your city administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
