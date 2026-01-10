"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { FileText, Clock, CheckCircle, XCircle, Filter, Search, Plus } from "lucide-react";
import Link from "next/link";

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
  {
    id: "4",
    permitNo: "PER-2024-004",
    type: "Building Permit",
    status: "IN_REVIEW",
    submittedDate: "2024-01-12",
    address: "321 Elm St, City, State",
  },
];

const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending", icon: Clock },
  APPROVED: { label: "Approved", color: "status-approved", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "status-rejected", icon: XCircle },
  IN_REVIEW: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: Clock },
};

export default function ContractorPermitsPage() {
  const [permits] = useState(mockPermits);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredPermits = permits.filter((permit) => {
    const matchesSearch =
      permit.permitNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || permit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="CONTRACTOR" userName="John Contractor" notificationCount={3}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Permits</h1>
            <p className="text-gray-600 mt-1">View and manage all your permit applications</p>
          </div>
          <Link href="/permits/new">
            <button className="btn btn-primary flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              Submit New Permit
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by permit number, type, or address..."
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

        {/* Permits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPermits.map((permit) => {
            const StatusIcon = statusConfig[permit.status as keyof typeof statusConfig]?.icon || Clock;
            const statusInfo = statusConfig[permit.status as keyof typeof statusConfig] || statusConfig.PENDING;

            return (
              <div
                key={permit.id}
                className="card card-hover cursor-pointer"
                onClick={() => window.location.href = `/permits/${permit.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-[var(--navy)]" />
                  </div>
                  <span className={`status-badge ${statusInfo.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{permit.permitNo}</h3>
                <p className="text-sm font-medium text-gray-700 mb-2">{permit.type}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{permit.address}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(permit.submittedDate).toLocaleDateString()}
                  </p>
                  <Link href={`/permits/${permit.id}`} onClick={(e) => e.stopPropagation()}>
                    <span className="text-sm text-[var(--navy)] hover:underline font-medium">
                      View →
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPermits.length === 0 && (
          <div className="card">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No permits found matching your criteria</p>
              <Link href="/permits/new">
                <button className="btn btn-primary">Submit Your First Permit</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
