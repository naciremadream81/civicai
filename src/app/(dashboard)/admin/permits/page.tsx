"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { FileText, Search, Filter, CheckCircle, XCircle, Clock, Eye, Edit } from "lucide-react";
import Link from "next/link";

interface Permit {
  id: string;
  permitNo: string;
  type: string;
  status: string;
  contractor: string;
  address: string;
  submittedDate: string;
  assignedTo?: string;
}

const mockPermits: Permit[] = [
  {
    id: "1",
    permitNo: "PER-2024-001",
    type: "Building Permit",
    status: "PENDING",
    contractor: "ABC Construction",
    address: "123 Main St, City, State",
    submittedDate: "2024-01-15",
    assignedTo: "Jane Inspector",
  },
  {
    id: "2",
    permitNo: "PER-2024-002",
    type: "Electrical Permit",
    status: "APPROVED",
    contractor: "XYZ Electric",
    address: "456 Oak Ave, City, State",
    submittedDate: "2024-01-10",
    assignedTo: "Bob Inspector",
  },
  {
    id: "3",
    permitNo: "PER-2024-003",
    type: "Plumbing Permit",
    status: "REJECTED",
    contractor: "Plumb Pro",
    address: "789 Pine Rd, City, State",
    submittedDate: "2024-01-05",
    assignedTo: "Alice Inspector",
  },
];

const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending", icon: Clock },
  APPROVED: { label: "Approved", color: "status-approved", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "status-rejected", icon: XCircle },
  IN_REVIEW: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: Clock },
};

export default function AdminPermitsPage() {
  const [permits] = useState(mockPermits);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredPermits = permits.filter((permit) => {
    const matchesSearch =
      permit.permitNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || permit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="ADMIN" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Permits</h1>
          <p className="text-gray-600 mt-1">View and manage all permit applications</p>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by permit number, contractor, or address..."
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
                  <option value="IN_REVIEW">In Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Permits Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Permit Number</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contractor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Submitted</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermits.map((permit) => {
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
                        <p className="text-gray-700">{permit.contractor}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{permit.address}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{permit.assignedTo || "Unassigned"}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`status-badge ${statusInfo.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(permit.submittedDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/permits/${permit.id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="View">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </Link>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredPermits.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No permits found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
