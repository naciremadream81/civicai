"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { ArrowLeft, FileText, MapPin, Calendar, User, CheckCircle, XCircle, Clock, Download, Eye } from "lucide-react";
import Link from "next/link";

interface PermitDetail {
  id: string;
  permitNo: string;
  type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contractor: string;
  contractorLicense: string;
  submittedDate: string;
  lastUpdated: string;
  description: string;
  documents: Array<{ id: string; name: string; size: number; uploadedAt: string }>;
}

export default function PermitDetailPage({ params }: { params: { id: string } }) {
  const [permit] = useState<PermitDetail>({
    id: params.id,
    permitNo: "PER-2024-001",
    type: "Building Permit",
    status: "PENDING",
    address: "123 Main Street",
    city: "City",
    state: "State",
    zip: "12345",
    contractor: "ABC Construction LLC",
    contractorLicense: "LIC-CON-12345",
    submittedDate: "2024-01-15",
    lastUpdated: "2024-01-18",
    description: "Construction of a new residential addition including foundation, framing, electrical, and plumbing work.",
    documents: [
      { id: "1", name: "Site Plan.pdf", size: 2048000, uploadedAt: "2024-01-15" },
      { id: "2", name: "Building Plans.pdf", size: 5242880, uploadedAt: "2024-01-15" },
      { id: "3", name: "Contractor License.pdf", size: 512000, uploadedAt: "2024-01-15" },
    ],
  });

  const statusConfig = {
    PENDING: { label: "Pending", color: "status-pending", icon: Clock },
    APPROVED: { label: "Approved", color: "status-approved", icon: CheckCircle },
    REJECTED: { label: "Rejected", color: "status-rejected", icon: XCircle },
    IN_REVIEW: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: Clock },
  };

  const StatusIcon = statusConfig[permit.status as keyof typeof statusConfig]?.icon || Clock;
  const statusInfo = statusConfig[permit.status as keyof typeof statusConfig] || statusConfig.PENDING;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <DashboardLayout role="CONTRACTOR" userName="John Contractor">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/permits"
            className="text-sm text-[var(--navy)] hover:underline mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Permits
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{permit.permitNo}</h1>
              <p className="text-gray-600 mt-1">{permit.type}</p>
            </div>
            <span className={`status-badge ${statusInfo.color} flex items-center gap-1`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Permit Details */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Permit Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Project Address</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {permit.address}<br />
                  {permit.city}, {permit.state} {permit.zip}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Contractor</p>
                <p className="font-semibold text-gray-900 mt-1">{permit.contractor}</p>
                <p className="text-sm text-gray-600">{permit.contractorLicense}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {new Date(permit.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {new Date(permit.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Project Description</p>
            <p className="text-gray-700">{permit.description}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Documents ({permit.documents.length})</h2>
          </div>
          <div className="space-y-3">
            {permit.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-[var(--navy)]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="View">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Download">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Status Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="font-semibold text-gray-900">Permit Submitted</p>
                <p className="text-sm text-gray-600">{new Date(permit.submittedDate).toLocaleString()}</p>
              </div>
            </div>
            {permit.status === "IN_REVIEW" && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600">{new Date(permit.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
