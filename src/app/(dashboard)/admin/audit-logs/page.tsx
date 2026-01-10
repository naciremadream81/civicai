"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { FileText, Search, Filter, Download, Eye } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  status: "SUCCESS" | "FAILED";
}

// Mock data
const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-20T10:30:00",
    user: "Admin User",
    action: "CREATE",
    resource: "User",
    resourceId: "user-123",
    ipAddress: "192.168.1.100",
    status: "SUCCESS",
  },
  {
    id: "2",
    timestamp: "2024-01-20T09:15:00",
    user: "Jane Inspector",
    action: "UPDATE",
    resource: "Inspection",
    resourceId: "insp-456",
    ipAddress: "192.168.1.101",
    status: "SUCCESS",
  },
  {
    id: "3",
    timestamp: "2024-01-20T08:45:00",
    user: "John Contractor",
    action: "LOGIN",
    resource: "Auth",
    resourceId: "-",
    ipAddress: "192.168.1.102",
    status: "FAILED",
  },
];

const actionColors = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
  LOGIN: "bg-purple-100 text-purple-800",
  LOGOUT: "bg-gray-100 text-gray-800",
  VIEW: "bg-amber-100 text-amber-800",
};

export default function AuditLogsPage() {
  const [logs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = !selectedAction || log.action === selectedAction;
    const matchesStatus = !selectedStatus || log.status === selectedStatus;
    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <DashboardLayout role="ADMIN" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600 mt-1">System activity and security audit trail</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2 w-full sm:w-auto">
            <Download className="w-5 h-5" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, action, or resource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="VIEW">View</option>
                </select>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resource</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resource ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">IP Address</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{log.user}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${actionColors[log.action as keyof typeof actionColors] || "bg-gray-100 text-gray-800"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700">{log.resource}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 font-mono">{log.resourceId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 font-mono">{log.ipAddress}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${
                        log.status === "SUCCESS" ? "status-approved" : "status-rejected"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="View details">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No audit logs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
