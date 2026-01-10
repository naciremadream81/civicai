"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { ClipboardCheck, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";

// Mock data
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

export default function InspectorDashboard() {
  const [inspections] = useState(mockInspections);

  const stats = {
    assigned: inspections.length,
    pending: inspections.filter((i) => i.status === "PENDING").length,
    inProgress: inspections.filter((i) => i.status === "IN_PROGRESS").length,
    completed: inspections.filter((i) => i.status === "COMPLETED").length,
    overdue: inspections.filter((i) => {
      const due = new Date(i.dueDate);
      const today = new Date();
      return due < today && i.status !== "COMPLETED";
    }).length,
  };

  return (
    <DashboardLayout role="INSPECTOR" userName="Jane Inspector" notificationCount={2}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspector Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your assigned inspections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.assigned}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-[var(--navy)]" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-[var(--amber)]" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[var(--green)]" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-[var(--red)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Assigned Inspections</h2>
            <Link href="/inspections" className="text-sm text-[var(--navy)] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {inspections.map((inspection) => {
              const statusInfo = statusConfig[inspection.status as keyof typeof statusConfig] || statusConfig.PENDING;
              const priorityInfo = priorityConfig[inspection.priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
              const isOverdue = new Date(inspection.dueDate) < new Date() && inspection.status !== "COMPLETED";

              return (
                <div
                  key={inspection.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ClipboardCheck className="w-5 h-5 text-[var(--navy)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
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
                          <p className="text-gray-700 mb-1">{inspection.type}</p>
                          <p className="text-sm text-gray-600">{inspection.address}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Due: {new Date(inspection.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/inspections/${inspection.id}`}>
                        <button className="btn btn-primary">
                          View Details
                        </button>
                      </Link>
                      {inspection.status !== "COMPLETED" && (
                        <Link href={`/inspections/${inspection.id}/checklist`}>
                          <button className="btn btn-secondary">
                            Inspection Checklist
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {inspections.length === 0 && (
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No inspections assigned</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
