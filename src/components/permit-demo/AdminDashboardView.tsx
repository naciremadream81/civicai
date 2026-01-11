"use client";

/**
 * Admin Dashboard View Component
 * 
 * Complete admin interface featuring:
 * - Sidebar menu navigation
 * - Top navigation bar with search, notifications, and avatar
 * - High-level analytics cards
 * - Data table with status filters
 * - Approval queue widget
 * 
 * Designed for city officials with emphasis on clarity, speed, and administrative control.
 */

import { useState } from "react";
import { 
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  BarChart3,
  Users,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

// Mock data
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
    address: "123 Main St",
    type: "Building",
    submitted: "2024-01-15",
    status: "pending",
    daysPending: 3,
  },
  {
    id: "PMT-2024-002",
    applicant: "Sarah Johnson",
    address: "456 Oak Ave",
    type: "Electrical",
    submitted: "2024-01-14",
    status: "in-review",
    daysPending: 4,
  },
  {
    id: "PMT-2024-003",
    applicant: "Mike Chen",
    address: "789 Elm Blvd",
    type: "Plumbing",
    submitted: "2024-01-10",
    status: "approved",
    daysPending: 0,
  },
  {
    id: "PMT-2024-004",
    applicant: "Emily Davis",
    address: "321 Pine Rd",
    type: "HVAC",
    submitted: "2024-01-08",
    status: "overdue",
    daysPending: 7,
  },
];

const approvalQueue = [
  { id: "PMT-2024-007", applicant: "David Martinez", type: "Building", priority: "high" },
  { id: "PMT-2024-008", applicant: "Jennifer Brown", type: "Plumbing", priority: "medium" },
  { id: "PMT-2024-009", applicant: "Michael Taylor", type: "Electrical", priority: "high" },
];

const sidebarMenu = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Applications", icon: FileText, active: false },
  { label: "Approvals", icon: ClipboardCheck, active: false },
  { label: "Reports", icon: BarChart3, active: false },
  { label: "Users", icon: Users, active: false },
];

export default function AdminDashboardView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const filteredSubmissions = recentSubmissions.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = 
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${base} bg-green-100 text-green-800`;
      case "pending":
        return `${base} bg-amber-100 text-amber-800`;
      case "in-review":
        return `${base} bg-blue-100 text-blue-800`;
      case "overdue":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="flex h-full bg-gray-50 w-full overflow-hidden" style={{ minHeight: '600px', height: '100%' }}>
      {/* Sidebar - Hidden on mobile, visible on tablet+ */}
      <aside className="hidden lg:flex w-48 xl:w-56 bg-white border-r border-gray-200 flex-col shrink-0 h-full">
        <div className="p-4 xl:p-5 border-b border-gray-200 shrink-0">
          <h2 className="text-base xl:text-lg font-bold text-gray-900">Permit Admin</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2.5 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-3 lg:px-4 py-2.5 shrink-0">
          <div className="flex items-center justify-between gap-2 lg:gap-3">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xs lg:max-w-md relative">
              <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 lg:pl-9 pr-4 py-1.5 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs lg:text-sm"
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold">Notifications</p>
                    </div>
                    <div className="p-2">
                      <div className="p-2 text-sm text-gray-600">3 new approvals pending</div>
                    </div>
                  </div>
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
                  <span className="hidden lg:block text-sm font-medium text-gray-700">Admin</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold">City Official</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="p-1">
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Profile
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 xl:p-5">
          <div className="space-y-4 lg:space-y-5">
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total Apps</p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] lg:text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-blue-50 rounded-xl shrink-0">
                    <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Pending</p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-600">{stats.pending}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] lg:text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="hidden lg:inline">Review needed</span>
                      <span className="lg:hidden">Review</span>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-amber-50 rounded-xl shrink-0">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Approved</p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-green-600">{stats.approved}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] lg:text-xs text-gray-500">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="hidden lg:inline">This month</span>
                      <span className="lg:hidden">Month</span>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-green-50 rounded-xl shrink-0">
                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Overdue</p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-red-600">{stats.overdue}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] lg:text-xs text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="hidden lg:inline">Action required</span>
                      <span className="lg:hidden">Action</span>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-red-50 rounded-xl shrink-0">
                    <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table and Approval Queue Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
              {/* Data Table - Takes 2 columns on desktop */}
              <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 lg:p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-900">Recent Submissions</h2>
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto appearance-none pl-3 pr-7 py-1.5 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs lg:text-sm bg-white cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <table className="w-full min-w-[600px] lg:min-w-0">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase">ID</th>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase">Applicant</th>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Type</th>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase hidden xl:table-cell">Submitted</th>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-3 lg:px-4 xl:px-6 py-2.5 lg:py-3 text-right text-[10px] lg:text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSubmissions.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">{item.id}</td>
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-600">{item.applicant}</td>
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-600 hidden lg:table-cell">{item.type}</td>
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-600 hidden xl:table-cell">{item.submitted}</td>
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4">
                            <span className={getStatusBadge(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-3 lg:px-4 xl:px-6 py-3 lg:py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approval Queue Widget - Takes 1 column */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 lg:p-4 border-b border-gray-200">
                  <h2 className="text-base lg:text-lg font-semibold text-gray-900">Approval Queue</h2>
                  <p className="text-[10px] lg:text-xs text-gray-500 mt-1">{approvalQueue.length} items pending</p>
                </div>
                <div className="p-3 lg:p-4 space-y-2 lg:space-y-3 max-h-[400px] overflow-y-auto">
                  {approvalQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">{item.id}</p>
                          <p className="text-[10px] lg:text-xs text-gray-600 mt-1 truncate">{item.applicant}</p>
                        </div>
                        {item.priority === "high" && (
                          <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-red-100 text-red-700 rounded text-[10px] lg:text-xs font-medium shrink-0 ml-2">
                            High
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-500 mb-2 lg:mb-3">{item.type}</p>
                      <button className="w-full px-2 lg:px-3 py-1.5 lg:py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}