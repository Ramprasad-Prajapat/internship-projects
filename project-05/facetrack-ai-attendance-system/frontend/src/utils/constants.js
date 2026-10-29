// FaceTrack AI — Shared constants (frontend-only mode).
// Roles (camelCase, per BUILD_PROMPT), route bases, redirect map, per-role
// sidebar navigation, and status → badge-tone maps used app-wide.

import {
  Home,
  LayoutDashboard,
  Users,
  UsersRound,
  Building2,
  Network,
  Clock,
  CalendarCheck,
  ScanFace,
  FileBarChart,
  ShieldAlert,
  ScrollText,
  Settings as SettingsIcon,
  UserCircle,
  Camera,
  Activity,
  ClipboardList,
  ClipboardCheck,
  CalendarDays,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';

export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  BRANCH_ADMIN: 'branchAdmin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.BRANCH_ADMIN]: 'Branch Admin',
  [ROLES.HR]: 'HR',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.EMPLOYEE]: 'Employee',
};

// URL prefix for each role's authenticated area.
export const ROLE_BASE = {
  [ROLES.SUPER_ADMIN]: '/super-admin',
  [ROLES.BRANCH_ADMIN]: '/branch-admin',
  [ROLES.HR]: '/hr',
  [ROLES.MANAGER]: '/manager',
  [ROLES.EMPLOYEE]: '/employee',
};

export const ROUTES = {
  LANDING: '/',
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  PRIVACY: '/privacy-policy',
  CONSENT: '/consent',
};

export const dashboardPathForRole = (role) =>
  ROLE_BASE[role] ? `${ROLE_BASE[role]}/dashboard` : ROUTES.LOGIN;

const p = (role, seg) => `${ROLE_BASE[role]}/${seg}`;

// Sidebar navigation per role. `to` is an absolute path; `icon` is a lucide cmp.
// The visible menu per role follows the agreed structure; every target resolves
// to an existing route (see routes/AppRoutes.jsx).
export const NAV_ITEMS = {
  [ROLES.SUPER_ADMIN]: [
    { label: 'Home', to: ROUTES.HOME, icon: Home },
    { label: 'Dashboard', to: p(ROLES.SUPER_ADMIN, 'dashboard'), icon: LayoutDashboard },
    { label: 'Branches', to: p(ROLES.SUPER_ADMIN, 'branches'), icon: Building2 },
    { label: 'Departments', to: p(ROLES.SUPER_ADMIN, 'departments'), icon: Network },
    { label: 'Employees', to: p(ROLES.SUPER_ADMIN, 'employees'), icon: Users },
    { label: 'HR Management', to: p(ROLES.SUPER_ADMIN, 'hr-management'), icon: Briefcase },
    { label: 'Reports', to: p(ROLES.SUPER_ADMIN, 'reports'), icon: FileBarChart },
    { label: 'Feature Control', to: p(ROLES.SUPER_ADMIN, 'feature-control'), icon: SlidersHorizontal },
    { label: 'Settings', to: p(ROLES.SUPER_ADMIN, 'settings'), icon: SettingsIcon },
    { label: 'Profile', to: p(ROLES.SUPER_ADMIN, 'profile'), icon: UserCircle },
  ],
  [ROLES.BRANCH_ADMIN]: [
    { label: 'Home', to: ROUTES.HOME, icon: Home },
    { label: 'Dashboard', to: p(ROLES.BRANCH_ADMIN, 'dashboard'), icon: LayoutDashboard },
    { label: 'Branch Employees', to: p(ROLES.BRANCH_ADMIN, 'employees'), icon: Users },
    { label: 'Departments', to: p(ROLES.BRANCH_ADMIN, 'departments'), icon: Network },
    { label: 'Shifts', to: p(ROLES.BRANCH_ADMIN, 'shifts'), icon: Clock },
    { label: 'Attendance', to: p(ROLES.BRANCH_ADMIN, 'attendance'), icon: CalendarCheck },
    { label: 'Reports', to: p(ROLES.BRANCH_ADMIN, 'reports'), icon: FileBarChart },
    { label: 'Profile', to: p(ROLES.BRANCH_ADMIN, 'profile'), icon: UserCircle },
  ],
  [ROLES.HR]: [
    { label: 'Home', to: ROUTES.HOME, icon: Home },
    { label: 'Dashboard', to: p(ROLES.HR, 'dashboard'), icon: LayoutDashboard },
    { label: 'Employees', to: p(ROLES.HR, 'employees'), icon: Users },
    { label: 'Attendance', to: p(ROLES.HR, 'attendance'), icon: CalendarCheck },
    { label: 'Leave Requests', to: p(ROLES.HR, 'leave-requests'), icon: CalendarDays },
    { label: 'Corrections', to: p(ROLES.HR, 'correction-requests'), icon: ClipboardList },
    { label: 'Reports', to: p(ROLES.HR, 'reports'), icon: FileBarChart },
    { label: 'Profile', to: p(ROLES.HR, 'profile'), icon: UserCircle },
  ],
  [ROLES.MANAGER]: [
    { label: 'Home', to: ROUTES.HOME, icon: Home },
    { label: 'Dashboard', to: p(ROLES.MANAGER, 'dashboard'), icon: LayoutDashboard },
    { label: 'Team Attendance', to: p(ROLES.MANAGER, 'attendance'), icon: CalendarCheck },
    { label: 'Team Members', to: p(ROLES.MANAGER, 'team-members'), icon: UsersRound },
    { label: 'Approvals', to: p(ROLES.MANAGER, 'leave-requests'), icon: ClipboardCheck },
    { label: 'Reports', to: p(ROLES.MANAGER, 'reports'), icon: FileBarChart },
    { label: 'Profile', to: p(ROLES.MANAGER, 'profile'), icon: UserCircle },
  ],
  [ROLES.EMPLOYEE]: [
    { label: 'Home', to: ROUTES.HOME, icon: Home },
    { label: 'Dashboard', to: p(ROLES.EMPLOYEE, 'dashboard'), icon: LayoutDashboard },
    { label: 'Face Check-In', to: p(ROLES.EMPLOYEE, 'mark-attendance'), icon: Camera },
    { label: 'My Attendance', to: p(ROLES.EMPLOYEE, 'my-attendance'), icon: CalendarCheck },
    { label: 'Leave', to: p(ROLES.EMPLOYEE, 'leave'), icon: CalendarDays },
    { label: 'Corrections', to: p(ROLES.EMPLOYEE, 'corrections'), icon: ClipboardList },
    { label: 'Profile', to: p(ROLES.EMPLOYEE, 'profile'), icon: UserCircle },
  ],
};

// Secondary routes that remain reachable (deep links / dashboard shortcuts) but
// are intentionally kept out of the primary sidebar menu above. Listed here so
// the structure is documented and nothing is orphaned.
export const SECONDARY_NAV = {
  [ROLES.SUPER_ADMIN]: ['shifts', 'attendance', 'suspicious-scans', 'audit-logs'],
  [ROLES.BRANCH_ADMIN]: ['settings'],
  [ROLES.HR]: ['live-monitor', 'face-approvals', 'suspicious-scans', 'settings'],
  [ROLES.MANAGER]: [],
  [ROLES.EMPLOYEE]: ['face-registration', 'face-test', 'monthly-summary'],
};

/* ---------- status → badge tone maps ---------- */
export const ATTENDANCE_STATUS = {
  present: { label: 'Present', tone: 'success' },
  late: { label: 'Late', tone: 'warning' },
  absent: { label: 'Absent', tone: 'danger' },
  leave: { label: 'On Leave', tone: 'accent' },
};

export const REQUEST_STATUS = {
  pending: { label: 'Pending', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
  reviewed: { label: 'Reviewed', tone: 'success' },
  ignored: { label: 'Ignored', tone: 'muted' },
};

export const FACE_STATUS = {
  registered: { label: 'Registered', tone: 'success' },
  pending: { label: 'Pending', tone: 'info' },
  none: { label: 'Not Registered', tone: 'muted' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export const EMPLOYEE_STATUS = {
  active: { label: 'Active', tone: 'success' },
  inactive: { label: 'Inactive', tone: 'muted' },
};

export const SCAN_REASON_LABELS = {
  lowConfidence: 'Low confidence',
  multipleFaces: 'Multiple faces',
  faceNotMatched: 'Face not matched',
  outsideRadius: 'Outside radius',
  cameraPermissionDenied: 'Camera denied',
  locationPermissionDenied: 'Location denied',
  repeatedFailedAttempts: 'Repeated failures',
};

export const LEAVE_TYPES = ['Casual', 'Sick', 'Annual', 'Unpaid'];
export const CORRECTION_TYPES = [
  { value: 'missedCheckIn', label: 'Missed Check-In' },
  { value: 'missedCheckOut', label: 'Missed Check-Out' },
  { value: 'wrongTime', label: 'Wrong Time' },
  { value: 'locationIssue', label: 'Location Issue' },
  { value: 'faceScanFailed', label: 'Face Scan Failed' },
];
