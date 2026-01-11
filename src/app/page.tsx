"use client";

/**
 * Dashboard Page
 * 
 * Role-based dashboard:
 * - Admin: Shows 4 stat cards (Total Applications, Pending, Approved, Overdue)
 * - Citizen: Shows status card + Next Step info
 */

import { useRole } from "@/context/RoleContext";
import { FileText, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { role } = useRole();

  // Admin Dashboard
  if (role === "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage permits and applications</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Applications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">247</p>
            <p className="text-xs text-green-600">+12% from last month</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mb-2">18</p>
            <p className="text-xs text-gray-500">Requires review</p>
          </div>

          {/* Approved */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600 mb-2">198</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600 mb-2">31</p>
            <p className="text-xs text-red-600">Action required</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">New application submitted</p>
                <p className="text-xs text-gray-500">PMT-2024-050 by John Smith</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Application approved</p>
                <p className="text-xs text-gray-500">PMT-2024-049 by Sarah Johnson</p>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Citizen Dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your permit applications</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Application Status</h2>
            <p className="text-sm text-gray-600">Building Permit #PMT-2024-046</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            In Review
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">60%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Submitted</span>
          </div>
          <div className="flex-1 h-1 bg-green-500 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">In Review</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
        </div>
      </div>

      {/* Next Step Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Step</h3>
            <p className="text-sm text-blue-700 mb-3">
              Your application is currently being reviewed by city officials. You will receive a notification once the review is complete.
            </p>
            <p className="text-xs text-blue-600">
              Estimated completion: 3-5 business days
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/new-application"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Submit New Application</h3>
          <p className="text-sm text-gray-600">Start a new permit application</p>
        </Link>
        <Link
          href="/applications"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-1">View All Applications</h3>
          <p className="text-sm text-gray-600">Check status of all your permits</p>
        </Link>
      </div>
    </div>
  );
}
