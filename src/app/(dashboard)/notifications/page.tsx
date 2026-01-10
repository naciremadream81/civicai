"use client";

import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Bell, CheckCircle, XCircle, Clock, FileText, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: "APPROVAL" | "REJECTION" | "INSPECTION" | "STATUS_UPDATE";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  permitId?: string;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "APPROVAL",
    title: "Permit Approved",
    message: "Your permit PER-2024-002 has been approved",
    timestamp: "2024-01-20T10:30:00",
    read: false,
    permitId: "2",
  },
  {
    id: "2",
    type: "INSPECTION",
    title: "Inspection Scheduled",
    message: "An inspection has been scheduled for PER-2024-001 on January 25, 2024",
    timestamp: "2024-01-19T14:15:00",
    read: false,
    permitId: "1",
  },
  {
    id: "3",
    type: "STATUS_UPDATE",
    title: "Status Updated",
    message: "Your permit PER-2024-003 status has been updated to In Review",
    timestamp: "2024-01-18T09:00:00",
    read: true,
    permitId: "3",
  },
];

const notificationIcons = {
  APPROVAL: CheckCircle,
  REJECTION: XCircle,
  INSPECTION: Clock,
  STATUS_UPDATE: FileText,
};

const notificationColors = {
  APPROVAL: "bg-green-100 text-green-600",
  REJECTION: "bg-red-100 text-red-600",
  INSPECTION: "bg-blue-100 text-blue-600",
  STATUS_UPDATE: "bg-amber-100 text-amber-600",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout 
      role="CONTRACTOR" 
      userName="John Contractor" 
      notificationCount={unreadCount}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary text-sm"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const colorClass = notificationColors[notification.type];

            return (
              <div
                key={notification.id}
                className={`card card-hover ${!notification.read ? "border-l-4 border-l-[var(--navy)]" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[var(--navy)] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="card">
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
