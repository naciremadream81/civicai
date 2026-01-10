"use client";

/**
 * Citizen View Component
 * 
 * This component represents the citizen-facing interface for the Permit Management System.
 * It features:
 * - Application progress tracking with visual indicators
 * - Simple submission tools for new permit applications
 * - Status overview of existing permits
 * - Streamlined, user-friendly interface
 * 
 * Design Philosophy:
 * - Simplified interface focused on clarity
 * - Emphasis on user guidance and progress visibility
 * - Less information density than admin view
 * - Clear calls-to-action for common tasks
 * - Muted color tones matching admin view for consistency
 */

import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Upload,
  MapPin,
  Calendar
} from "lucide-react";

// Mock data for demonstration
const myPermits = [
  {
    id: "PMT-2024-045",
    type: "Building Permit",
    status: "approved",
    submitted: "2024-01-10",
    approved: "2024-01-14",
    progress: 100,
  },
  {
    id: "PMT-2024-046",
    type: "Electrical Permit",
    status: "in-review",
    submitted: "2024-01-15",
    approved: null,
    progress: 60,
  },
  {
    id: "PMT-2024-047",
    type: "Plumbing Permit",
    status: "pending",
    submitted: "2024-01-16",
    approved: null,
    progress: 30,
  },
];

const permitTypes = [
  { id: "building", name: "Building Permit", description: "Construction and renovation projects", icon: FileText },
  { id: "electrical", name: "Electrical Permit", description: "Electrical installations and repairs", icon: FileCheck },
  { id: "plumbing", name: "Plumbing Permit", description: "Plumbing installations and modifications", icon: FileText },
  { id: "hvac", name: "HVAC Permit", description: "Heating, ventilation, and air conditioning", icon: FileCheck },
];

export default function CitizenView() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Permit Portal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Submit new permit applications, track your existing permits, and stay updated on approval status.
        </p>
        <button className="btn btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>Start New Application</span>
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active Permits Card */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Active Permits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{myPermits.length}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Applications in progress</p>
        </div>

        {/* Pending Reviews Card */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">In Review</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {myPermits.filter(p => p.status === "in-review" || p.status === "pending").length}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Awaiting approval</p>
        </div>
      </div>

      {/* Application Progress Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">My Permit Applications</h3>
          <p className="text-sm text-gray-500 mt-1">Track the status of your submitted permits</p>
        </div>

        <div className="p-4 space-y-4">
          {myPermits.map((permit) => (
            <div
              key={permit.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              {/* Permit Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{permit.id}</h4>
                    <span
                      className={`status-badge ${
                        permit.status === "approved"
                          ? "status-approved"
                          : permit.status === "in-review"
                          ? "status-in-review"
                          : "status-pending"
                      }`}
                    >
                      {permit.status === "approved"
                        ? "Approved"
                        : permit.status === "in-review"
                        ? "In Review"
                        : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{permit.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="text-sm font-medium text-gray-900">{permit.submitted}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-900">{permit.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      permit.status === "approved"
                        ? "bg-green-500"
                        : permit.status === "in-review"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${permit.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Details */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                {permit.status === "approved" && permit.approved && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span>Approved on {permit.approved}</span>
                  </div>
                )}
                {permit.status === "in-review" && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Under review by inspector</span>
                  </div>
                )}
                {permit.status === "pending" && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Awaiting initial review</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {myPermits.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">No permit applications yet</p>
            <button className="btn btn-primary text-sm">Submit Your First Application</button>
          </div>
        )}
      </div>

      {/* Submission Tools Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Submit New Application</h3>
          <p className="text-sm text-gray-500 mt-1">Choose a permit type to begin</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {permitTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  className="border border-gray-200 rounded-lg p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-900">
                        {type.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Application Form Preview */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Application Form</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Project Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter project address"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Permit Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  >
                    <option>Select permit type</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estimated Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Attach Documents <span className="text-gray-400">(PDF, Images)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="btn btn-primary flex-1 sm:flex-none">Submit Application</button>
                <button className="btn btn-secondary text-sm">Save as Draft</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}