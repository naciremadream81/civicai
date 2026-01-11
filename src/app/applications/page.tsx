"use client";

/**
 * Applications Page
 * 
 * Role-based applications view:
 * - Admin: Manage/Review Applications with data table
 * - Citizen: Track My Applications
 */

import { useRole } from "@/context/RoleContext";
import { Search, Filter, FileText, Calendar, User, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ApplicationsPage() {
  const { role } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Admin View
  if (role === "admin") {
    const applications = [
      { id: "PMT-2024-050", applicant: "John Smith", type: "Building", status: "pending", submitted: "2024-01-17", daysPending: 1 },
      { id: "PMT-2024-049", applicant: "Sarah Johnson", type: "Electrical", status: "approved", submitted: "2024-01-15", daysPending: 0 },
      { id: "PMT-2024-048", applicant: "Mike Chen", type: "Plumbing", status: "in-review", submitted: "2024-01-16", daysPending: 2 },
      { id: "PMT-2024-047", applicant: "Emily Davis", type: "HVAC", status: "overdue", submitted: "2024-01-10", daysPending: 7 },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage all permit applications</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="overdue">Overdue</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.applicant}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.submitted}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "approved" ? "bg-green-100 text-green-800" :
                        app.status === "pending" ? "bg-amber-100 text-amber-800" :
                        app.status === "in-review" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Citizen View
  const myApplications = [
    { id: "PMT-2024-046", type: "Building Permit", status: "in-review", submitted: "2024-01-15", progress: 60 },
    { id: "PMT-2024-045", type: "Electrical Permit", status: "approved", submitted: "2024-01-10", progress: 100 },
    { id: "PMT-2024-044", type: "Plumbing Permit", status: "pending", submitted: "2024-01-16", progress: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track your permit applications</p>
        </div>
        <Link
          href="/new-application"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {myApplications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{app.id}</h3>
                <p className="text-sm text-gray-600 mt-1">{app.type}</p>
                <p className="text-xs text-gray-500 mt-1">Submitted: {app.submitted}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === "approved" ? "bg-green-100 text-green-800" :
                app.status === "in-review" ? "bg-blue-100 text-blue-800" :
                "bg-amber-100 text-amber-800"
              }`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' ')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-900">{app.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${app.progress}%` }}
                ></div>
              </div>
            </div>

            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
              View Details <FileText className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
