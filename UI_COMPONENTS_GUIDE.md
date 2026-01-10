# Permit Management System - UI Components Guide
## Complete Component Reference and Usage Examples

**Created:** January 2025

---

## 📚 Component Library

### Shared Components

#### 1. DashboardLayout
**Location:** `src/components/shared/DashboardLayout.tsx`

**Purpose:** Main layout wrapper for all dashboard pages

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "CONTRACTOR" | "INSPECTOR" | "ADMIN";
  userName?: string;
  notificationCount?: number;
}
```

**Usage:**
```tsx
<DashboardLayout role="CONTRACTOR" userName="John Doe" notificationCount={3}>
  <YourPageContent />
</DashboardLayout>
```

**Features:**
- Manages sidebar and mobile navigation state
- Provides responsive layout structure
- Handles mobile/desktop viewport changes

---

#### 2. Sidebar
**Location:** `src/components/shared/Sidebar.tsx`

**Purpose:** Left sidebar navigation (desktop) or slide-out menu (mobile)

**Props:**
```typescript
interface SidebarProps {
  role: "CONTRACTOR" | "INSPECTOR" | "ADMIN";
  isOpen: boolean;
  onClose: () => void;
}
```

**Features:**
- Role-specific navigation links
- Active route highlighting
- Slide-out animation on mobile
- Close button overlay

**Navigation by Role:**
- **Contractor:** Dashboard, My Permits, Submit Permit, Notifications
- **Inspector:** Dashboard, Inspections, Assigned Permits, Notifications
- **Admin:** Dashboard, All Permits, User Management, Analytics, Settings, Audit Logs

---

#### 3. Header
**Location:** `src/components/shared/Header.tsx`

**Purpose:** Top header bar with user actions

**Props:**
```typescript
interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
}
```

**Features:**
- Profile dropdown menu
- Notification bell with count badge
- Dark/light mode toggle
- Mobile menu button
- Responsive layout

---

#### 4. MobileNav
**Location:** `src/components/shared/MobileNav.tsx`

**Purpose:** Bottom tab navigation for mobile devices

**Props:**
```typescript
interface MobileNavProps {
  role: "CONTRACTOR" | "INSPECTOR" | "ADMIN";
}
```

**Features:**
- Fixed bottom navigation (mobile only)
- Icon-based tabs
- Active state indication
- Touch-friendly layout

**Navigation Items:**
- Home (Dashboard)
- Permits (Permits/Inspections)
- Alerts (Notifications)
- Profile

---

## 🎨 CSS Classes Reference

### Cards
```tsx
<div className="card">Basic card</div>
<div className="card card-hover">Card with hover effect</div>
```

### Buttons
```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-success">Success</button>
<button className="btn btn-danger">Danger</button>
<button className="btn btn-warning">Warning</button>
```

### Status Badges
```tsx
<span className="status-badge status-pending">Pending</span>
<span className="status-badge status-approved">Approved</span>
<span className="status-badge status-rejected">Rejected</span>
<span className="status-badge bg-blue-100 text-blue-800">In Review</span>
```

### Navigation Links
```tsx
<a className="sidebar-link">Regular link</a>
<a className="sidebar-link sidebar-link-active">Active link</a>
```

### Mobile Navigation
```tsx
<a className="mobile-nav-item">Regular item</a>
<a className="mobile-nav-item mobile-nav-item-active">Active item</a>
```

---

## 📊 Chart Components (Recharts)

### Bar Chart Example
```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

### Line Chart Example
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

### Pie Chart Example
```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

---

## 🎯 Status Configurations

### Permit Status
```typescript
const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending", icon: Clock },
  APPROVED: { label: "Approved", color: "status-approved", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "status-rejected", icon: XCircle },
  IN_REVIEW: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: Clock },
};
```

### Inspection Status
```typescript
const statusConfig = {
  PENDING: { label: "Pending", color: "status-pending" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", color: "status-approved" },
  OVERDUE: { label: "Overdue", color: "status-rejected" },
};
```

### Priority Levels
```typescript
const priorityConfig = {
  HIGH: { label: "High", color: "bg-red-100 text-red-800" },
  MEDIUM: { label: "Medium", color: "bg-amber-100 text-amber-800" },
  LOW: { label: "Low", color: "bg-green-100 text-green-800" },
};
```

---

## 🎨 Color Palette

### Primary Colors
- **Navy Blue:** `#1e3a8a` (var(--navy))
- **Navy Dark:** `#1e40af` (var(--navy-dark))
- **Navy Light:** `#3b82f6` (var(--navy-light))

### Status Colors
- **Success/Green:** `#10b981` (var(--green))
- **Warning/Amber:** `#f59e0b` (var(--amber))
- **Error/Red:** `#ef4444` (var(--red))

### Gray Scale
- **Gray 50-900:** Standard Tailwind gray scale
- Used for backgrounds, borders, and text

---

## 📱 Responsive Breakpoints

- **Mobile:** `< 640px` - Single column, bottom nav
- **Tablet:** `640px - 1024px` - 2 columns, sidebar visible
- **Desktop:** `> 1024px` - 3-4 columns, full sidebar

---

## 🔧 Utility Functions

### Format File Size
```typescript
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
```

### Date Formatting
```typescript
new Date(dateString).toLocaleDateString()
new Date(dateString).toLocaleString()
```

---

## ✅ Best Practices

1. **Always use DashboardLayout** for dashboard pages
2. **Use status badges** for consistent status display
3. **Use card components** for content sections
4. **Implement loading states** for async operations
5. **Add error handling** for API calls
6. **Use TypeScript** for type safety
7. **Follow responsive design** patterns
8. **Accessibility:** Add ARIA labels and keyboard navigation
9. **Performance:** Use proper memoization for lists
10. **Testing:** Test all user interactions

---

**End of UI Components Guide**
