"use client";

/**
 * Admin View Component
 * 
 * This component represents the administrative interface for the Permit Management System.
 * It features:
 * - Analytics cards showing key metrics and KPIs
 * - Approval workflows for managing permit requests
 * - Data visualization elements
 * - Advanced filtering and search capabilities
 * 
 * Design Philosophy:
 * - More complex interface with multiple data points
 * - Emphasis on data-driven decision making
 * - Grid-based layout for optimal information density
 * - Muted color tones for professional appearance
 */

import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Download
} from "lucide-react";

// Mock data for demonstration
const analyticsData = {
  totalPermits: 247,
  pendingReviews: 18,
  approvedThisMonth: 89,
  avgProcessingTime: 4.2,
  approvalRate: 87,
  activeInspections: 12,
};

const approvalQueue = [
  {
    id: "PMT-2024-001",
    applicant: "John Smith",
    type: "Building",
    submitted: "2024-01-15",
    status: "pending",
    priority: "high",
  },
  {
    id: "PMT-2024-002",
    applicant: "Sarah Johnson",
    type: "Electrical",
    submitted: "2024-01-14",
    status: "pending",
    priority: "medium",
  },
  {
    id: "PMT-2024-003",
    applicant: "Mike Chen",
    type: "Plumbing",
    submitted: "2024-01-13",
    status: "pending",
    priority: "low",
  },
  {
    id: "PMT-2024-004",
    applicant: "Emily Davis",
    type: "HVAC",
    submitted: "2024-01-12",
    status: "pending",
    priority: "medium",
  },
];

const recentActivity = [
  { id: 1, action: "Permit approved", reference: "PMT-2024-098", time: "2 hours ago", status: "approved" },
  { id: 2, action: "Permit rejected", reference: "PMT-2024-097", time: "5 hours ago", status: "rejected" },
  { id: 3, action: "Inspection scheduled", reference: "PMT-2024-096", time: "1 day ago", status: "in-review" },
  { id: 4, action: "Permit approved", reference: "PMT-2024-095", time: "1 day ago", status: "approved" },
];

export default function AdminView() {
  return (
    <div className="space-y-6">
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Permits Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Total Permits</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{analyticsData.totalPermits}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
          </div>
        </div>

        {/* Pending Reviews Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending Reviews</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{analyticsData.pendingReviews}</p>
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Requires attention</span>
              </p>
            </div>
            <div className="p-2 bg-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
          </div>
        </div>

        {/* Approval Rate Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Approval Rate</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{analyticsData.approvalRate}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Last 30 days</span>
              </p>
            </div>
            <div className="p-2 bg-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Approval Workflow Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        {/* Section Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
              <p className="text-sm text-gray-500 mt-1">Review and manage pending permit applications</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search permits..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent w-full sm:w-64"
                />
              </div>
              <button className="btn btn-secondary flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="btn btn-secondary flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Approval Queue Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permit ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Applicant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvalQueue.map((permit) => (
                <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{permit.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{permit.applicant}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {permit.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{permit.submitted}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        permit.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : permit.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {permit.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium whitespace-nowrap">
                        Review
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-xs font-medium whitespace-nowrap">
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-xs font-medium whitespace-nowrap">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Showing 4 of {analyticsData.pendingReviews} pending reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === "approved"
                    ? "bg-green-100"
                    : activity.status === "rejected"
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}>
                  {activity.status === "approved" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : activity.status === "rejected" ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.reference} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">System Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Users</p>
                  <p className="text-xs text-gray-500">Active accounts</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">142</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Avg. Processing Time</p>
                  <p className="text-xs text-gray-500">Days to approval</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">{analyticsData.avgProcessingTime}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Approved This Month</p>
                  <p className="text-xs text-gray-500">January 2024</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">{analyticsData.approvedThisMonth}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Inspections</p>
                  <p className="text-xs text-gray-500">In progress</p>
                </div>
              </div>
              <p className="text-lg font-bold text-amber-600">{analyticsData.activeInspections}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}