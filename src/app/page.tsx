"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ClipboardCheck, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // In a real app, this would check authentication and redirect based on role
  // For now, we'll show a landing page with role selection

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[var(--navy)]" />
              <h1 className="text-2xl font-bold text-[var(--navy)]">Permit Management System</h1>
            </div>
            <Link href="/dashboard" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Permit Processing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your permit applications, inspections, and approvals with our comprehensive management system.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contractor Card */}
          <Link href="/contractor/dashboard" className="card card-hover cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-[var(--navy)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contractor</h3>
              <p className="text-gray-600 mb-4">
                Submit permit applications, track status, and manage your projects.
              </p>
              <span className="text-sm text-[var(--navy)] font-medium">Access Dashboard →</span>
            </div>
          </Link>

          {/* Inspector Card */}
          <Link href="/inspector/dashboard" className="card card-hover cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="w-8 h-8 text-[var(--green)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inspector</h3>
              <p className="text-gray-600 mb-4">
                Review permits, conduct inspections, and manage your assigned tasks.
              </p>
              <span className="text-sm text-[var(--navy)] font-medium">Access Dashboard →</span>
            </div>
          </Link>

          {/* Admin Card */}
          <Link href="/admin/dashboard" className="card card-hover cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Administrator</h3>
              <p className="text-gray-600 mb-4">
                Manage users, view analytics, and configure system settings.
              </p>
              <span className="text-sm text-[var(--navy)] font-medium">Access Dashboard →</span>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Or navigate directly:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contractor/dashboard" className="btn btn-secondary">
              Contractor Dashboard
            </Link>
            <Link href="/inspector/dashboard" className="btn btn-secondary">
              Inspector Dashboard
            </Link>
            <Link href="/admin/dashboard" className="btn btn-secondary">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Permit Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
