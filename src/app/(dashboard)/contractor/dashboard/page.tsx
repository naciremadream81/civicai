"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual API calls
const mockPermits = [
  {
    id: "1",
    permitNo: "PER-2024-001",
    type: "Building Permit",
    status: "PENDING",
    submittedDate: "2024-01-15",
    address: "123 Main St, City, State",
  },
  {
    id: "2",
    permitNo: "PER-2024-002",
    type: "Electrical Permit",
    status: "APPROVED",
    submittedDate: "2024-01-10",
    address: "456 Oak Ave, City, State",
  },
  {
    id: "3",
    permitNo: "PER-2024-003",
    type: "Plumbing Permit",
    status: "REJECTED",
    submittedDate: "2024-01-05",
    address: "789 Pine Rd, City, State",
  },
];

const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending", icon: Clock },
  APPROVED: { label: "Approved", color: "status-approved", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "status-rejected", icon: XCircle },
};

export default function ContractorDashboard() {
  const [permits] = useState(mockPermits);

  const stats = {
    total: permits.length,
    pending: permits.filter((p) => p.status === "PENDING").length,
    approved: permits.filter((p) => p.status === "APPROVED").length,
    rejected: permits.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <DashboardLayout role="CONTRACTOR" userName="John Contractor" notificationCount={3}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your permit applications</p>
          </div>
          <Link href="/permits/new">
            <button className="btn btn-primary flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              Submit New Permit
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Permits</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-[var(--navy)]" />
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
                <Clock className="w-6 h-6 text-[var(--amber)]" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[var(--green)]" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-[var(--red)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Permits Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Permits</h2>
            <Link href="/permits" className="text-sm text-[var(--navy)] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Permit Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Submitted
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {permits.map((permit) => {
                  const StatusIcon = statusConfig[permit.status as keyof typeof statusConfig]?.icon || Clock;
                  const statusInfo = statusConfig[permit.status as keyof typeof statusConfig] || statusConfig.PENDING;
                  
                  return (
                    <tr
                      key={permit.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{permit.permitNo}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{permit.type}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 text-sm">{permit.address}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`status-badge ${statusInfo.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm">
                          {new Date(permit.submittedDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/permits/${permit.id}`}
                          className="text-sm text-[var(--navy)] hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {permits.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No permits submitted yet</p>
              <Link href="/permits/new">
                <button className="btn btn-primary">Submit Your First Permit</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
