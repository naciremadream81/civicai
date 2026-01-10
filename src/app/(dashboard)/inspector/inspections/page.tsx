"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { ClipboardCheck, Calendar, Search, Filter, MapPin } from "lucide-react";
import Link from "next/link";

const mockInspections = [
  {
    id: "1",
    permitNo: "PER-2024-001",
    address: "123 Main St, City, State",
    type: "Building Inspection",
    dueDate: "2024-01-20",
    priority: "HIGH",
    status: "PENDING",
  },
  {
    id: "2",
    permitNo: "PER-2024-002",
    address: "456 Oak Ave, City, State",
    type: "Electrical Inspection",
    dueDate: "2024-01-18",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    permitNo: "PER-2024-003",
    address: "789 Pine Rd, City, State",
    type: "Plumbing Inspection",
    dueDate: "2024-01-25",
    priority: "LOW",
    status: "COMPLETED",
  },
  {
    id: "4",
    permitNo: "PER-2024-004",
    address: "321 Elm St, City, State",
    type: "HVAC Inspection",
    dueDate: "2024-01-17",
    priority: "HIGH",
    status: "PENDING",
  },
];

const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", color: "status-approved" },
  OVERDUE: { label: "Overdue", color: "status-rejected" },
};

const priorityConfig = {
  HIGH: { label: "High", color: "bg-red-100 text-red-800" },
  MEDIUM: { label: "Medium", color: "bg-amber-100 text-amber-800" },
  LOW: { label: "Low", color: "bg-green-100 text-green-800" },
};

export default function InspectionsPage() {
  const [inspections] = useState(mockInspections);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.permitNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || inspection.status === statusFilter;
    const matchesPriority = !priorityFilter || inspection.priority === priorityFilter;
    const isOverdue = new Date(inspection.dueDate) < new Date() && inspection.status !== "COMPLETED";
    const matchesOverdue = !statusFilter || (statusFilter === "OVERDUE" ? isOverdue : inspection.status === statusFilter);

    return matchesSearch && matchesStatus && matchesPriority && (statusFilter !== "OVERDUE" || matchesOverdue);
  });

  return (
    <DashboardLayout role="INSPECTOR" userName="Jane Inspector" notificationCount={2}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspections</h1>
          <p className="text-gray-600 mt-1">Manage your assigned inspections</p>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by permit number, address, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        <div className="space-y-4">
          {filteredInspections.map((inspection) => {
            const statusInfo = statusConfig[inspection.status as keyof typeof statusConfig] || statusConfig.PENDING;
            const priorityInfo = priorityConfig[inspection.priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
            const isOverdue = new Date(inspection.dueDate) < new Date() && inspection.status !== "COMPLETED";

            return (
              <div
                key={inspection.id}
                className="card card-hover cursor-pointer"
                onClick={() => window.location.href = `/inspections/${inspection.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ClipboardCheck className="w-6 h-6 text-[var(--navy)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{inspection.permitNo}</h3>
                        <span className={`status-badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className={`status-badge ${priorityInfo.color}`}>
                          {priorityInfo.label} Priority
                        </span>
                        {isOverdue && (
                          <span className="status-badge status-rejected">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-700 mb-1">{inspection.type}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {inspection.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(inspection.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-col">
                    <Link href={`/inspections/${inspection.id}`} onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-primary w-full sm:w-auto">
                        View Details
                      </button>
                    </Link>
                    {inspection.status !== "COMPLETED" && (
                      <Link href={`/inspections/${inspection.id}/checklist`} onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-secondary w-full sm:w-auto">
                          Checklist
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInspections.length === 0 && (
          <div className="card">
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No inspections found matching your criteria</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
