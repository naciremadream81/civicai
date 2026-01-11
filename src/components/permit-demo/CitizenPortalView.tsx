"use client";

/**
 * Citizen Portal View Component
 * 
 * Citizen-facing interface featuring:
 * - Welcome banner with user avatar and introduction
 * - Progress tracker for application steps
 * - Status cards for different permit states
 * - Document upload section with file browser
 * - Submit new permit button
 * 
 * Designed for simplicity and ease of use with clear visual guidance.
 */

import { 
  User,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  File,
  Plus
} from "lucide-react";
import { useState } from "react";

// Mock data
const myApplications = [
  {
    id: "PMT-2024-045",
    type: "Building Permit",
    status: "approved",
    submitted: "2024-01-10",
    currentStep: "Approved",
    progress: 100,
  },
  {
    id: "PMT-2024-046",
    type: "Electrical Permit",
    status: "in-review",
    submitted: "2024-01-15",
    currentStep: "In Review",
    progress: 60,
  },
  {
    id: "PMT-2024-047",
    type: "Plumbing Permit",
    status: "pending",
    submitted: "2024-01-16",
    currentStep: "Submitted",
    progress: 30,
  },
];

const applicationSteps = [
  { id: "submitted", label: "Submitted", icon: FileText },
  { id: "in-review", label: "In Review", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
];

// Status Card Component
function StatusCard({ status, count }: { status: string; count: number }) {
  const baseClasses = "rounded-xl border-2 p-3 lg:p-4 flex items-center gap-3 lg:gap-4";
  switch (status) {
    case "in-review":
      return (
        <div className={`${baseClasses} border-blue-200 bg-blue-50`}>
          <div className="p-2 lg:p-3 bg-blue-100 rounded-lg shrink-0">
            <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-600">In Review</p>
            <p className="text-xl lg:text-2xl font-bold text-blue-700">{count}</p>
          </div>
        </div>
      );
    case "approved":
      return (
        <div className={`${baseClasses} border-green-200 bg-green-50`}>
          <div className="p-2 lg:p-3 bg-green-100 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Approved</p>
            <p className="text-xl lg:text-2xl font-bold text-green-700">{count}</p>
          </div>
        </div>
      );
    case "rejected":
      return (
        <div className={`${baseClasses} border-red-200 bg-red-50`}>
          <div className="p-2 lg:p-3 bg-red-100 rounded-lg shrink-0">
            <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Rejected</p>
            <p className="text-xl lg:text-2xl font-bold text-red-700">{count}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function CitizenPortalView() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inReviewCount = myApplications.filter((a) => a.status === "in-review").length;
  const approvedCount = myApplications.filter((a) => a.status === "approved").length;
  const rejectedCount = 0; // Mock data

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full overflow-hidden" style={{ minHeight: '600px', height: '100%' }}>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4 lg:p-5 xl:p-6 shrink-0 flex-shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-green-600 rounded-full flex items-center justify-center shadow-md shrink-0">
            <User className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1 truncate" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              Welcome, John Doe
            </h2>
            <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">
              Track your permit applications and submit new requests easily.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 xl:p-5 space-y-4 lg:space-y-5">
        {/* Progress Tracker Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Application Progress
          </h3>
          
          {myApplications.map((application) => (
            <div key={application.id} className="mb-4 lg:mb-5 last:mb-0 pb-4 lg:pb-5 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">{application.id}</p>
                  <p className="text-xs lg:text-sm text-gray-500 mt-0.5">{application.type}</p>
                </div>
                <span className="text-[10px] lg:text-xs text-gray-500 whitespace-nowrap shrink-0">Submitted: {application.submitted}</span>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-1 lg:gap-2 mb-2">
                {applicationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const stepStatus = 
                    application.currentStep === step.label ? "current"
                    : index < applicationSteps.findIndex((s) => s.label === application.currentStep) ? "completed"
                    : "upcoming";

                  return (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div className="flex items-center gap-1 lg:gap-2 flex-1">
                        <div
                          className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                            stepStatus === "completed"
                              ? "bg-green-500 border-green-500 text-white"
                              : stepStatus === "current"
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-gray-100 border-gray-300 text-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                        </div>
                        {index < applicationSteps.length - 1 && (
                          <div
                            className={`flex-1 h-1 rounded transition-colors ${
                              stepStatus === "completed"
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Labels */}
              <div className="flex justify-between mt-2 text-[10px] lg:text-xs text-gray-600">
                {applicationSteps.map((step) => (
                  <span key={step.id} className="text-center max-w-[70px] lg:max-w-[80px] truncate">
                    {step.label}
                  </span>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] lg:text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-[10px] lg:text-xs font-medium text-gray-900">{application.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                  <div
                    className="bg-blue-600 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${application.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-2 lg:gap-3">
          <StatusCard status="in-review" count={inReviewCount} />
          <StatusCard status="approved" count={approvedCount} />
          <StatusCard status="rejected" count={rejectedCount} />
        </div>

        {/* Upload Document Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5 xl:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Upload Documents
          </h3>
          <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
            Upload required documents for your permit application (PDF, JPG, PNG)
          </p>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 lg:p-6 xl:p-8 text-center hover:border-green-400 transition-colors bg-gray-50">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-2 lg:gap-3">
                <div className="p-3 lg:p-4 bg-green-100 rounded-full">
                  <Upload className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900 mb-1">
                    Click to browse or drag and drop files here
                  </p>
                  <p className="text-[10px] lg:text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs lg:text-sm font-medium cursor-pointer shadow-sm"
                  >
                    <File className="w-3 h-3 lg:w-4 lg:h-4" />
                    Browse Files
                  </label>
                </div>
              </div>
            </label>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-3 lg:mt-4 space-y-2">
              <p className="text-xs lg:text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                    <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg shrink-0">
                      <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-[10px] lg:text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1.5 lg:p-2 hover:bg-gray-200 rounded-lg transition-colors shrink-0 ml-2"
                    aria-label="Remove file"
                  >
                    <XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit New Permit Button */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5 xl:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4">
            <div className="flex-1">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Ready to Apply?
              </h3>
              <p className="text-xs lg:text-sm text-gray-600">
                Start a new permit application with our simple step-by-step process.
              </p>
            </div>
            <button className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg text-sm lg:text-base" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              Submit New Permit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}