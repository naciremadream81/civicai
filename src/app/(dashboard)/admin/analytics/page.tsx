"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown, Download, Clock, ClipboardCheck } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyPermits = [
  { month: "Jan", submitted: 45, approved: 38, rejected: 7 },
  { month: "Feb", submitted: 52, approved: 46, rejected: 6 },
  { month: "Mar", submitted: 48, approved: 42, rejected: 6 },
  { month: "Apr", submitted: 61, approved: 54, rejected: 7 },
  { month: "May", submitted: 55, approved: 49, rejected: 6 },
  { month: "Jun", submitted: 67, approved: 59, rejected: 8 },
];

const permitTypeDistribution = [
  { type: "Building", count: 123, color: "#3b82f6" },
  { type: "Electrical", count: 87, color: "#10b981" },
  { type: "Plumbing", count: 65, color: "#f59e0b" },
  { type: "HVAC", count: 42, color: "#ef4444" },
];

const inspectorPerformance = [
  { name: "Inspector A", inspections: 45, completed: 42, avgTime: 2.3 },
  { name: "Inspector B", inspections: 38, completed: 36, avgTime: 2.5 },
  { name: "Inspector C", inspections: 52, completed: 48, avgTime: 2.1 },
  { name: "Inspector D", inspections: 41, completed: 39, avgTime: 2.7 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");

  const stats = {
    totalPermits: 317,
    approvalRate: 88.5,
    avgProcessingTime: 3.2,
    totalInspections: 176,
    avgInspectionTime: 2.4,
  };

  return (
    <DashboardLayout role="ADMIN" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive system analytics and insights</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Permits</p>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPermits}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last period
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approvalRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Above average</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg Processing</p>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime} days</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -0.5 days
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Inspections</p>
              <ClipboardCheck className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalInspections}</p>
            <p className="text-xs text-gray-500 mt-1">This period</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg Inspection</p>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgInspectionTime} hrs</p>
            <p className="text-xs text-gray-500 mt-1">Per inspection</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Permit Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPermits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Permit Type Distribution */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Permits by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={permitTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const percent = props.percent || 0;
                    const type = props.type || props.payload?.type || '';
                    return `${type}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                >
                  {permitTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inspector Performance */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Inspector Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="inspections" fill="#3b82f6" name="Assigned" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
