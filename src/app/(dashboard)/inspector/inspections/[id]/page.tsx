"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { ArrowLeft, CheckCircle, XCircle, Calendar, MapPin, FileText } from "lucide-react";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
  notes?: string;
}

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  // Using permit ID from params (for future API integration)
  const permitId = params.id;
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Electrical wiring meets code requirements", checked: false, required: true },
    { id: "2", label: "All outlets and switches properly installed", checked: false, required: true },
    { id: "3", label: "GFCI protection in required locations", checked: false, required: true },
    { id: "4", label: "Panel box properly labeled", checked: false, required: false },
    { id: "5", label: "Grounding system verified", checked: false, required: true },
    { id: "6", label: "Smoke detectors installed and operational", checked: false, required: true },
  ]);

  const [inspectionNotes, setInspectionNotes] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const allRequiredChecked = checklist
    .filter((item) => item.required)
    .every((item) => item.checked);

  const permitDetails = {
    permitNo: "PER-2024-001",
    type: "Electrical Inspection",
    address: "123 Main St, City, State 12345",
    contractor: "ABC Electrical LLC",
    contractorLicense: "LIC-ELC-12345",
    submittedDate: "2024-01-15",
    dueDate: "2024-01-20",
    priority: "HIGH",
  };

  return (
    <DashboardLayout role="INSPECTOR" userName="Jane Inspector">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/inspections"
            className="text-sm text-[var(--navy)] hover:underline mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inspections
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Inspection Details</h1>
          <p className="text-gray-600 mt-1">Complete the inspection checklist below</p>
        </div>

        {/* Permit Info Card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permit Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Permit Number</p>
                <p className="font-semibold text-gray-900">{permitDetails.permitNo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Inspection Type</p>
                <p className="font-semibold text-gray-900">{permitDetails.type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Project Address</p>
                <p className="font-semibold text-gray-900">{permitDetails.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(permitDetails.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Contractor</p>
                <p className="font-semibold text-gray-900">{permitDetails.contractor}</p>
                <p className="text-sm text-gray-500">{permitDetails.contractorLicense}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <span className="status-badge bg-red-100 text-red-800">
                  {permitDetails.priority}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection Checklist */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspection Checklist</h2>
          <p className="text-sm text-gray-600 mb-6">
            Review each item and mark as complete. Required items must be checked to approve.
          </p>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  item.checked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-1 w-5 h-5 text-[var(--navy)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--navy)]"
                />
                <div className="flex-1">
                  <label htmlFor={item.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.label}</span>
                      {item.required && (
                        <span className="text-xs text-red-500">(Required)</span>
                      )}
                    </div>
                  </label>
                </div>
                {item.checked && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Inspection Notes</p>
            <textarea
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              rows={4}
              placeholder="Add any additional notes or observations from the inspection..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowRejectModal(true)}
            className="btn btn-danger flex-1 flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Request Revision
          </button>
          <button
            onClick={() => setShowApproveModal(true)}
            disabled={!allRequiredChecked}
            className="btn btn-success flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Inspected
          </button>
        </div>

        {!allRequiredChecked && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              ⚠️ All required items must be checked before approving the inspection.
            </p>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Inspection?</h3>
              <p className="text-gray-600">
                This will mark the inspection as completed and approved. Are you sure you want to proceed?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle approval
                  setShowApproveModal(false);
                  // Redirect or show success message
                }}
                className="flex-1 btn btn-success"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Revision?</h3>
              <p className="text-gray-600 mb-4">
                This will mark the inspection as requiring revisions. Please provide reason:
              </p>
              <textarea
                rows={4}
                placeholder="Reason for revision request..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle rejection
                  setShowRejectModal(false);
                }}
                className="flex-1 btn btn-danger"
              >
                Request Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
