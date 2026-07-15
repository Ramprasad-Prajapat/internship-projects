// FaceTrack AI — Mock role metadata (frontend-only mode).
// Display metadata + per-role "quick actions" used on the logged-in /home page.
// `icon` is a string key mapped to a lucide component in the consuming page so
// this file stays a pure data module (no React imports). `to` is a real route.

export const ROLE_META = {
  superAdmin: {
    label: 'Super Admin',
    tagline: 'Global control across every branch, role and setting.',
    accent: '#00d4ff',
    quickActions: [
      { label: 'Branches', to: '/super-admin/branches', icon: 'branches', tone: 'primary' },
      { label: 'Employees', to: '/super-admin/employees', icon: 'employees', tone: 'accent' },
      { label: 'HR Management', to: '/super-admin/hr-management', icon: 'hr', tone: 'success' },
      { label: 'Reports', to: '/super-admin/reports', icon: 'reports', tone: 'warning' },
    ],
  },
  branchAdmin: {
    label: 'Branch Admin',
    tagline: 'Run your branch — people, shifts and attendance.',
    accent: '#14b8a6',
    quickActions: [
      { label: 'Branch Employees', to: '/branch-admin/employees', icon: 'employees', tone: 'primary' },
      { label: 'Attendance', to: '/branch-admin/attendance', icon: 'attendance', tone: 'success' },
      { label: 'Shifts', to: '/branch-admin/shifts', icon: 'shifts', tone: 'accent' },
      { label: 'Reports', to: '/branch-admin/reports', icon: 'reports', tone: 'warning' },
    ],
  },
  hr: {
    label: 'HR',
    tagline: 'Approvals, attendance and people operations.',
    accent: '#eab308',
    quickActions: [
      { label: 'Employees', to: '/hr/employees', icon: 'employees', tone: 'primary' },
      { label: 'Attendance', to: '/hr/attendance', icon: 'attendance', tone: 'success' },
      { label: 'Leave Requests', to: '/hr/leave-requests', icon: 'leave', tone: 'accent' },
      { label: 'Corrections', to: '/hr/correction-requests', icon: 'corrections', tone: 'warning' },
    ],
  },
  manager: {
    label: 'Manager',
    tagline: 'Keep your team on track and approve requests.',
    accent: '#f59e0b',
    quickActions: [
      { label: 'Team Attendance', to: '/manager/attendance', icon: 'attendance', tone: 'primary' },
      { label: 'Team Members', to: '/manager/team-members', icon: 'team', tone: 'accent' },
      { label: 'Approvals', to: '/manager/leave-requests', icon: 'approvals', tone: 'success' },
      { label: 'Reports', to: '/manager/reports', icon: 'reports', tone: 'warning' },
    ],
  },
  employee: {
    label: 'Employee',
    tagline: 'Check in with your face and manage your attendance.',
    accent: '#00d4ff',
    quickActions: [
      { label: 'Face Check-In', to: '/employee/mark-attendance', icon: 'checkin', tone: 'primary' },
      { label: 'My Attendance', to: '/employee/my-attendance', icon: 'attendance', tone: 'success' },
      { label: 'Leave', to: '/employee/leave', icon: 'leave', tone: 'accent' },
      { label: 'Corrections', to: '/employee/corrections', icon: 'corrections', tone: 'warning' },
    ],
  },
};

export function getRoleMeta(role) {
  return ROLE_META[role] || ROLE_META.employee;
}
