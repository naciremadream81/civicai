"use client";

/**
 * Permit Management Admin Dashboard
 * 
 * Modern web-based UI for city officials to manage permits efficiently.
 * Features:
 * - High-level statistics (total, pending, approved, overdue)
 * - Data table with status filters
 * - Approval queue widget
 * - Clean, professional design with blue and grey tones
 * - Inter/Roboto typography for clarity
 */

import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Calendar,
  User,
  Building2,
  TrendingUp,
  Download
} from "lucide-react";
import { useState } from "react";

// Mock data for demonstration
const stats = {
  totalApplications: 247,
  pending: 18,
  approved: 198,
  overdue: 31,
};

const recentSubmissions = [
  {
    id: "PMT-2024-001",
    applicant: "John Smith",
    address: "123 Main St, Springfield",
    type: "Building",
    submitted: "2024-01-15",
    status: "pending",
    daysPending: 3,
    priority: "high",
  },
  {
    id: "PMT-2024-002",
    applicant: "Sarah Johnson",
    address: "456 Oak Ave, Springfield",
    type: "Electrical",
    submitted: "2024-01-14",
    status: "in-review",
    daysPending: 4,
    priority: "medium",
  },
  {
    id: "PMT-2024-003",
    applicant: "Mike Chen",
    address: "789 Elm Blvd, Springfield",
    type: "Plumbing",
    submitted: "2024-01-10",
    status: "approved",
    daysPending: 0,
    priority: "low",
  },
  {
    id: "PMT-2024-004",
    applicant: "Emily Davis",
    address: "321 Pine Rd, Springfield",
    type: "HVAC",
    submitted: "2024-01-08",
    status: "overdue",
    daysPending: 7,
    priority: "high",
  },
  {
    id: "PMT-2024-005",
    applicant: "Robert Wilson",
    address: "654 Maple Dr, Springfield",
    type: "Building",
    submitted: "2024-01-12",
    status: "pending",
    daysPending: 6,
    priority: "medium",
  },
  {
    id: "PMT-2024-006",
    applicant: "Lisa Anderson",
    address: "987 Cedar Ln, Springfield",
    type: "Electrical",
    submitted: "2024-01-13",
    status: "in-review",
    daysPending: 5,
    priority: "low",
  },
];

const approvalQueue = [
  {
    id: "PMT-2024-007",
    applicant: "David Martinez",
    type: "Building",
    submitted: "2024-01-16",
    priority: "high",
    requiresAttention: true,
  },
  {
    id: "PMT-2024-008",
    applicant: "Jennifer Brown",
    type: "Plumbing",
    submitted: "2024-01-15",
    priority: "medium",
    requiresAttention: false,
  },
  {
    id: "PMT-2024-009",
    applicant: "Michael Taylor",
    type: "Electrical",
    submitted: "2024-01-15",
    priority: "high",
    requiresAttention: true,
  },
  {
    id: "PMT-2024-010",
    applicant: "Amanda White",
    type: "HVAC",
    submitted: "2024-01-14",
    priority: "low",
    requiresAttention: false,
  },
];

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = recentSubmissions.filter((submission) => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesSearch = 
      searchQuery === "" ||
      submission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case "in-review":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "overdue":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    switch (priority) {
      case "high":
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      case "medium":
        return `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`;
      case "low":
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Manage permits, applications, and approvals
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* High-Level Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Applications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {stats.totalApplications}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Pending
                </p>
                <p className="text-3xl font-bold text-amber-600 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {stats.pending}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Requires review</span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {stats.approved}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>This month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Overdue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Overdue
                </p>
                <p className="text-3xl font-bold text-red-600 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {stats.overdue}
                </p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Action required</span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Table Section - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Table Header with Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Recent Permit Submissions
                </h2>
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48"
                    />
                  </div>
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="approved">Approved</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Permit ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {submission.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {submission.applicant}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{submission.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getPriorityBadge(submission.priority)}>
                          {submission.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{submission.submitted}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(submission.status)}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('-', ' ')}
                        </span>
                        {submission.daysPending > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({submission.daysPending}d)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          View
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Showing {filteredSubmissions.length} of {recentSubmissions.length} applications
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Queue Widget - Takes 1 column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Approval Queue
                </h2>
                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  {approvalQueue.length}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {approvalQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    item.requiresAttention
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {item.id}
                      </p>
                      <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {item.applicant}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={getPriorityBadge(item.priority)}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {item.submitted}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                View All Pending Approvals →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}