// FaceTrack AI — Application routes.
// Public pages + role-scoped feature routes behind auth + role guards. The
// feature table maps each nav segment to the page component and the roles that
// may reach it (role-prefixed URLs per BUILD_PROMPT).

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Layout from '../components/layout/Layout';
import FeatureGate from '../components/common/FeatureGate';
import { ROLES, ROLE_BASE, ROUTES } from '../utils/constants';

// Public
import LandingPage from '../pages/public/LandingPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import ConsentPage from '../pages/public/ConsentPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFound from '../pages/NotFound';
import HomePage from '../pages/home/HomePage';

// Role dashboards
import SuperAdminDashboard from '../pages/superAdmin/SuperAdminDashboard';
import BranchAdminDashboard from '../pages/branchAdmin/BranchAdminDashboard';
import HRDashboard from '../pages/hr/HRDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';

// Shared feature pages
import EmployeesPage from '../pages/features/EmployeesPage';
import BranchesPage from '../pages/features/BranchesPage';
import DepartmentsPage from '../pages/features/DepartmentsPage';
import ShiftsPage from '../pages/features/ShiftsPage';
import AttendancePage from '../pages/features/AttendancePage';
import LiveMonitorPage from '../pages/features/LiveMonitorPage';
import FaceApprovalsPage from '../pages/features/FaceApprovalsPage';
import CorrectionRequestsPage from '../pages/features/CorrectionRequestsPage';
import LeaveRequestsPage from '../pages/features/LeaveRequestsPage';
import SuspiciousScansPage from '../pages/features/SuspiciousScansPage';
import AuditLogsPage from '../pages/features/AuditLogsPage';
import ReportsPage from '../pages/features/ReportsPage';
import SettingsPage from '../pages/features/SettingsPage';
import ProfilePage from '../pages/features/ProfilePage';
import HRManagementPage from '../pages/features/HRManagementPage';

// Manager
import TeamMembersPage from '../pages/manager/TeamMembersPage';
import ManagerProfilePage from '../pages/manager/ManagerProfilePage';

// HR
import HRProfilePage from '../pages/hr/HRProfilePage';

// Branch Admin
import BranchAdminProfilePage from '../pages/branchAdmin/BranchAdminProfilePage';

// Super Admin
import SuperAdminProfilePage from '../pages/superAdmin/SuperAdminProfilePage';
import FeatureControlPage from '../pages/superAdmin/FeatureControlPage';

// Employee self-service
import MarkAttendancePage from '../pages/employee/MarkAttendancePage';
import FaceTestPage from '../pages/employee/FaceTestPage';
import FaceRegistrationPage from '../pages/employee/FaceRegistrationPage';
import MonthlySummaryPage from '../pages/employee/MonthlySummaryPage';
import MyAttendancePage from '../pages/employee/MyAttendancePage';
import MyCorrectionsPage from '../pages/employee/MyCorrectionsPage';
import MyLeavePage from '../pages/employee/MyLeavePage';

const { SUPER_ADMIN: S, BRANCH_ADMIN: B, HR: H, MANAGER: M, EMPLOYEE: E } = ROLES;

const DASHBOARDS = {
  [S]: SuperAdminDashboard,
  [B]: BranchAdminDashboard,
  [H]: HRDashboard,
  [M]: ManagerDashboard,
  [E]: EmployeeDashboard,
};

// segment -> component + roles allowed to reach it.
const FEATURES = [
  { seg: 'employees', C: EmployeesPage, roles: [S, B, H] },
  { seg: 'branches', C: BranchesPage, roles: [S] },
  { seg: 'departments', C: DepartmentsPage, roles: [S, B, H] },
  { seg: 'shifts', C: ShiftsPage, roles: [S, B, H] },
  { seg: 'attendance', C: AttendancePage, roles: [S, B, H, M] },
  { seg: 'live-monitor', C: LiveMonitorPage, roles: [H] },
  { seg: 'face-approvals', C: FaceApprovalsPage, roles: [H] },
  { seg: 'correction-requests', C: CorrectionRequestsPage, roles: [H] },
  { seg: 'leave-requests', C: LeaveRequestsPage, roles: [H, M] },
  { seg: 'suspicious-scans', C: SuspiciousScansPage, roles: [S, H] },
  { seg: 'audit-logs', C: AuditLogsPage, roles: [S] },
  { seg: 'reports', C: ReportsPage, roles: [S, B, H, M] },
  { seg: 'settings', C: SettingsPage, roles: [S, B, H] },
  { seg: 'profile', C: ProfilePage, roles: [E] },
  { seg: 'profile', C: ManagerProfilePage, roles: [M] },
  { seg: 'profile', C: HRProfilePage, roles: [H] },
  { seg: 'profile', C: BranchAdminProfilePage, roles: [B] },
  { seg: 'profile', C: SuperAdminProfilePage, roles: [S] },
  { seg: 'employees/:employeeId/profile', C: ProfilePage, roles: [S, B, H, M] },
  { seg: 'hr-management', C: HRManagementPage, roles: [S] },
  { seg: 'feature-control', C: FeatureControlPage, roles: [S] },
  { seg: 'team-members', C: TeamMembersPage, roles: [M] },
  // employee self-service
  { seg: 'mark-attendance', C: MarkAttendancePage, roles: [E] },
  { seg: 'face-test', C: FaceTestPage, roles: [E] },
  { seg: 'face-registration', C: FaceRegistrationPage, roles: [E] },
  { seg: 'my-attendance', C: MyAttendancePage, roles: [E] },
  { seg: 'corrections', C: MyCorrectionsPage, roles: [E] },
  { seg: 'leave', C: MyLeavePage, roles: [E] },
  { seg: 'monthly-summary', C: MonthlySummaryPage, roles: [E] },
];

// auth guard -> role guard -> app layout.
function guarded(role, element) {
  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={[role]}>
        <Layout>{element}</Layout>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LANDING} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
      <Route path={ROUTES.CONSENT} element={<ConsentPage />} />

      {/* Logged-in home — any authenticated role, dashboard chrome */}
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Dashboards */}
      {Object.entries(DASHBOARDS).map(([role, C]) => (
        <Route key={role} path={`${ROLE_BASE[role]}/dashboard`} element={guarded(role, <C />)} />
      ))}

      {/* Feature pages — each wrapped in a FeatureGate so Super Admin can disable
          it (frontend mock) without removing the route. */}
      {FEATURES.flatMap((f) =>
        f.roles.map((role) => (
          <Route
            key={`${role}-${f.seg}`}
            path={`${ROLE_BASE[role]}/${f.seg}`}
            element={guarded(role, <FeatureGate featureKey={f.seg} role={role}><f.C /></FeatureGate>)}
          />
        ))
      )}

      {/* Bare role base -> dashboard */}
      {Object.keys(DASHBOARDS).map((role) => (
        <Route key={`${role}-base`} path={ROLE_BASE[role]} element={<Navigate to={`${ROLE_BASE[role]}/dashboard`} replace />} />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
