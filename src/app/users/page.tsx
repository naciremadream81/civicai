"use client";

/**
 * Users Page
 * 
 * Role-based users view:
 * - Admin: Manage users with user table and actions
 * - Citizen: Personal profile/account settings
 */

import { useRole } from "@/context/RoleContext";
import { Search, User as UserIcon, Mail, Phone, MapPin, Settings, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const { role } = useRole();
  const [searchQuery, setSearchQuery] = useState("");

  // Admin View
  if (role === "admin") {
    const users = [
      { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Citizen", status: "Active", phone: "(555) 123-4567" },
      { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Citizen", status: "Active", phone: "(555) 234-5678" },
      { id: 3, name: "Mike Chen", email: "mike.chen@example.com", role: "Citizen", status: "Active", phone: "(555) 345-6789" },
      { id: 4, name: "Emily Davis", email: "emily.davis@example.com", role: "Admin", status: "Active", phone: "(555) 456-7890" },
      { id: 5, name: "Robert Wilson", email: "r.wilson@example.com", role: "Citizen", status: "Inactive", phone: "(555) 567-8901" },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage system users and permissions</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Add New User
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users
                  .filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Citizen View - Personal Profile
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">John Doe</h2>
            <p className="text-sm text-gray-600 mb-4">Citizen</p>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
              <p className="text-base text-gray-900">john.doe@example.com</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change</button>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Phone Number</p>
              <p className="text-base text-gray-900">(555) 123-4567</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change</button>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
              <p className="text-base text-gray-900">123 Main Street, Springfield, ST 12345</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change</button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Account Settings
        </h3>
        <div className="space-y-3">
          <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Change Password</p>
            <p className="text-sm text-gray-500">Update your account password</p>
          </button>
          <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Notification Preferences</p>
            <p className="text-sm text-gray-500">Manage email and notification settings</p>
          </button>
          <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">Privacy Settings</p>
            <p className="text-sm text-gray-500">Control your privacy and data preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
}
