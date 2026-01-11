"use client";

/**
 * New Application Page
 * 
 * 3-step responsive permit application wizard for citizens.
 * Features:
 * - Step 1: Permit Details (Customer Name, Property ID, Property Address)
 * - Step 2: Contractor Selection (with ability to add new contractors)
 * - Step 3: Review & Submit
 * - Auto-save to localStorage
 * - Role protection (citizen only)
 * - Responsive design with Tailwind CSS
 */

import { useState, useEffect, useMemo } from "react";
import { useRole } from "@/context/RoleContext";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  User,
  Home,
  Building2,
  FileText,
  Plus,
  X,
} from "lucide-react";

// Form data interfaces
interface Step1Data {
  customerName: string;
  propertyId: string;
  propertyAddress: string;
}

interface Contractor {
  id: string;
  name: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  companyName?: string;
}

interface Step2Data {
  selectedContractorId: string;
  contractors: Contractor[];
}

interface FormData extends Step1Data, Step2Data {}

// LocalStorage keys
const STORAGE_KEYS = {
  step: "permit_app_step",
  customerName: "permit_app_customerName",
  propertyId: "permit_app_propertyId",
  propertyAddress: "permit_app_propertyAddress",
  selectedContractorId: "permit_app_selectedContractorId",
  contractors: "permit_app_contractors",
};

// Initial contractor list
const INITIAL_CONTRACTORS: Contractor[] = [
  { id: "1", name: "ABC Construction", licenseNumber: "LIC-001", phone: "555-0101", email: "info@abcconstruction.com", companyName: "ABC Construction LLC" },
  { id: "2", name: "XYZ Builders", licenseNumber: "LIC-002", phone: "555-0102", email: "contact@xyzbuilders.com", companyName: "XYZ Builders Inc" },
  { id: "3", name: "Smith & Sons Contracting", licenseNumber: "LIC-003", phone: "555-0103", email: "hello@smithsons.com", companyName: "Smith & Sons Contracting" },
  { id: "4", name: "Modern Home Solutions", licenseNumber: "LIC-004", phone: "555-0104", email: "info@modernhomes.com", companyName: "Modern Home Solutions LLC" },
];

export default function NewApplicationPage() {
  const { role } = useRole();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    propertyId: "",
    propertyAddress: "",
    selectedContractorId: "",
    contractors: INITIAL_CONTRACTORS,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNewContractorForm, setShowNewContractorForm] = useState(false);
  const [newContractor, setNewContractor] = useState<Omit<Contractor, "id">>({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    companyName: "",
  });
  const [newContractorErrors, setNewContractorErrors] = useState<Partial<Record<keyof Contractor, string>>>({});

  // Load form data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem(STORAGE_KEYS.step);
      if (savedStep) {
        const stepNum = parseInt(savedStep) as 1 | 2 | 3;
        if ([1, 2, 3].includes(stepNum)) {
          setStep(stepNum);
        }
      }

      const savedCustomerName = localStorage.getItem(STORAGE_KEYS.customerName) || "";
      const savedPropertyId = localStorage.getItem(STORAGE_KEYS.propertyId) || "";
      const savedPropertyAddress = localStorage.getItem(STORAGE_KEYS.propertyAddress) || "";
      const savedSelectedContractorId = localStorage.getItem(STORAGE_KEYS.selectedContractorId) || "";
      const savedContractors = localStorage.getItem(STORAGE_KEYS.contractors);
      const contractors = savedContractors ? JSON.parse(savedContractors) : INITIAL_CONTRACTORS;

      setFormData({
        customerName: savedCustomerName,
        propertyId: savedPropertyId,
        propertyAddress: savedPropertyAddress,
        selectedContractorId: savedSelectedContractorId,
        contractors: contractors.length > 0 ? contractors : INITIAL_CONTRACTORS,
      });
    }
  }, []);

  // Save step to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.step, step.toString());
    }
  }, [step]);

  // Save form data to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.customerName, formData.customerName);
      localStorage.setItem(STORAGE_KEYS.propertyId, formData.propertyId);
      localStorage.setItem(STORAGE_KEYS.propertyAddress, formData.propertyAddress);
      localStorage.setItem(STORAGE_KEYS.selectedContractorId, formData.selectedContractorId);
      localStorage.setItem(STORAGE_KEYS.contractors, JSON.stringify(formData.contractors));
    }
  }, [formData]);

  // Memoized contractor list for dropdown
  const contractorList = useMemo(() => formData.contractors, [formData.contractors]);

  // Role guard: Only citizens can access this page
  if (role !== "citizen") {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-700 mb-4">
            This page is only accessible to citizen users. Please switch to Citizen view to submit a permit application.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof Step1Data, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.propertyId.trim()) {
      newErrors.propertyId = "Property ID is required";
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = "Property address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    if (!formData.selectedContractorId) {
      return false;
    }
    return true;
  };

  // Validate new contractor form
  const validateNewContractor = (): boolean => {
    const newErrors: Partial<Record<keyof Contractor, string>> = {};

    if (!newContractor.name.trim()) {
      newErrors.name = "Contractor name is required";
    }

    if (!newContractor.licenseNumber?.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!newContractor.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!newContractor.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContractor.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setNewContractorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1 field changes
  const handleStep1Change = (field: keyof Step1Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  // Handle add new contractor
  const handleAddNewContractor = () => {
    if (validateNewContractor()) {
      const newId = (formData.contractors.length + 1).toString();
      const contractorToAdd: Contractor = {
        id: newId,
        ...newContractor,
      };

      const updatedContractors = [...formData.contractors, contractorToAdd];
      setFormData((prev) => ({
        ...prev,
        contractors: updatedContractors,
        selectedContractorId: newId,
      }));

      // Reset form
      setNewContractor({
        name: "",
        licenseNumber: "",
        phone: "",
        email: "",
        companyName: "",
      });
      setNewContractorErrors({});
      setShowNewContractorForm(false);
    }
  };

  // Handle submit application
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.step);
      localStorage.removeItem(STORAGE_KEYS.customerName);
      localStorage.removeItem(STORAGE_KEYS.propertyId);
      localStorage.removeItem(STORAGE_KEYS.propertyAddress);
      localStorage.removeItem(STORAGE_KEYS.selectedContractorId);
      localStorage.removeItem(STORAGE_KEYS.contractors);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Get selected contractor
  const selectedContractor = contractorList.find((c) => c.id === formData.selectedContractorId);

  // Progress bar steps
  const steps = [
    { number: 1, label: "Permit Details", icon: FileText },
    { number: 2, label: "Contractor", icon: Building2 },
    { number: 3, label: "Review & Submit", icon: CheckCircle2 },
  ];

  // Success message
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your permit application has been submitted. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => {
              window.location.href = "/applications";
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-8">
      {/* Progress Indicator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step >= stepItem.number;
            const isCurrent = step === stepItem.number;

            return (
              <div key={stepItem.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isCurrent ? "text-blue-600" : isActive ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      step > stepItem.number ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Permit Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Permit Details</h2>
            <p className="text-gray-600">Please provide information about your permit application</p>
          </div>

          <div className="space-y-5">
            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleStep1Change("customerName", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.customerName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter customer name"
                />
              </div>
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
            </div>

            {/* Property ID */}
            <div>
              <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-2">
                Property ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => handleStep1Change("propertyId", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.propertyId ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter property ID"
                />
              </div>
              {errors.propertyId && <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>}
            </div>

            {/* Property Address */}
            <div>
              <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Property Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => handleStep1Change("propertyAddress", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none ${
                  errors.propertyAddress ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter full property address"
              />
              {errors.propertyAddress && <p className="mt-1 text-sm text-red-600">{errors.propertyAddress}</p>}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!formData.customerName.trim() || !formData.propertyId.trim() || !formData.propertyAddress.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Contractor Selection */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contractor Selection</h2>
            <p className="text-gray-600">Select a contractor or add a new one</p>
          </div>

          <div className="space-y-5">
            {/* Contractor Dropdown */}
            <div>
              <label htmlFor="contractor" className="block text-sm font-medium text-gray-700 mb-2">
                Select Contractor <span className="text-red-500">*</span>
              </label>
              <select
                id="contractor"
                value={formData.selectedContractorId}
                onChange={(e) => setFormData((prev) => ({ ...prev, selectedContractorId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Choose a contractor...</option>
                {contractorList.map((contractor) => (
                  <option key={contractor.id} value={contractor.id}>
                    {contractor.name} {contractor.licenseNumber ? `(${contractor.licenseNumber})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Contractor Button */}
            {!showNewContractorForm && (
              <div>
                <button
                  onClick={() => setShowNewContractorForm(true)}
                  className="flex items-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add New Contractor
                </button>
              </div>
            )}

            {/* New Contractor Form */}
            {showNewContractorForm && (
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">New Contractor Information</h3>
                  <button
                    onClick={() => {
                      setShowNewContractorForm(false);
                      setNewContractor({
                        name: "",
                        licenseNumber: "",
                        phone: "",
                        email: "",
                        companyName: "",
                      });
                      setNewContractorErrors({});
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contractor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newContractor.name}
                      onChange={(e) => setNewContractor((prev) => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        newContractorErrors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter contractor name"
                    />
                    {newContractorErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{newContractorErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newContractor.licenseNumber}
                      onChange={(e) => setNewContractor((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        newContractorErrors.licenseNumber ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter license number"
                    />
                    {newContractorErrors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">{newContractorErrors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newContractor.phone}
                      onChange={(e) => setNewContractor((prev) => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        newContractorErrors.phone ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                    />
                    {newContractorErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{newContractorErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newContractor.email}
                      onChange={(e) => setNewContractor((prev) => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        newContractorErrors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                    {newContractorErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{newContractorErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={newContractor.companyName}
                      onChange={(e) => setNewContractor((prev) => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter company name (optional)"
                    />
                  </div>

                  <button
                    onClick={handleAddNewContractor}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Contractor
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.selectedContractorId}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review & Submit</h2>
            <p className="text-gray-600">Please review your information before submitting</p>
          </div>

          {/* Review Summary */}
          <div className="space-y-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="text-base text-gray-900 font-medium">{formData.customerName}</p>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Property Information
              </h3>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Property ID:</span>
                  <p className="text-base text-gray-900 font-medium">{formData.propertyId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Address:</span>
                  <p className="text-base text-gray-900">{formData.propertyAddress}</p>
                </div>
              </div>
            </div>

            {/* Contractor Info */}
            {selectedContractor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Selected Contractor
                </h3>
                <div className="bg-white rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="text-base text-gray-900 font-medium">{selectedContractor.name}</p>
                  </div>
                  {selectedContractor.licenseNumber && (
                    <div>
                      <span className="text-sm text-gray-600">License Number:</span>
                      <p className="text-base text-gray-900">{selectedContractor.licenseNumber}</p>
                    </div>
                  )}
                  {selectedContractor.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="text-base text-gray-900">{selectedContractor.phone}</p>
                    </div>
                  )}
                  {selectedContractor.email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="text-base text-gray-900">{selectedContractor.email}</p>
                    </div>
                  )}
                  {selectedContractor.companyName && (
                    <div>
                      <span className="text-sm text-gray-600">Company:</span>
                      <p className="text-base text-gray-900">{selectedContractor.companyName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}