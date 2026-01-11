"use client";

/**
 * Approvals Page
 * 
 * Role-based approvals view:
 * - Admin: Approval Queue UI with review actions
 * - Citizen: Status message about approvals
 */

import { useRole } from "@/context/RoleContext";
import { Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default function ApprovalsPage() {
  const { role } = useRole();

  // Admin View
  if (role === "admin") {
    const approvalQueue = [
      { id: "PMT-2024-050", applicant: "John Smith", type: "Building", priority: "high", submitted: "2024-01-17" },
      { id: "PMT-2024-049", applicant: "Sarah Johnson", type: "Electrical", priority: "medium", submitted: "2024-01-16" },
      { id: "PMT-2024-048", applicant: "Mike Chen", type: "Plumbing", priority: "high", submitted: "2024-01-15" },
      { id: "PMT-2024-047", applicant: "Emily Davis", type: "HVAC", priority: "low", submitted: "2024-01-14" },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
          <p className="text-gray-600 mt-1">Review and approve pending applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvalQueue.length}</p>
                <p className="text-xs text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {approvalQueue.filter(a => a.priority === "high").length}
                </p>
                <p className="text-xs text-gray-600">High Priority</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-600">Approved Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <p className="text-sm text-gray-500 mt-1">{approvalQueue.length} items require review</p>
          </div>

          <div className="divide-y divide-gray-200">
            {approvalQueue.map((item) => (
              <div
                key={item.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  item.priority === "high" ? "border-l-4 border-red-500" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.id}</h3>
                      {item.priority === "high" && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          High Priority
                        </span>
                      )}
                      {item.priority === "medium" && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          Medium Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Applicant: {item.applicant}</p>
                    <p className="text-sm text-gray-600 mb-1">Type: {item.type}</p>
                    <p className="text-xs text-gray-500">Submitted: {item.submitted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Citizen View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Approval Status</h1>
        <p className="text-gray-600 mt-1">Information about your application approvals</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Your Applications Are Under Review</h2>
            <p className="text-sm text-blue-700 mb-4">
              Your permit applications are currently being reviewed by city officials. You will receive a notification
              once the review is complete and a decision has been made.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Current Status:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>PMT-2024-046 - Building Permit: In Review</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>PMT-2024-045 - Electrical Permit: Approved</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>PMT-2024-044 - Plumbing Permit: Pending</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-blue-600 mt-4">
              Typical review time: 3-5 business days. You'll be notified via email when a decision is made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
