// FaceTrack AI — Mock data service (frontend-only mode).
//
// Thin, non-reactive read API over the store (services/mockStore) plus a couple
// of derived helpers. Reactive components should prefer hooks/useStore +
// services/selectors; this exists for one-off reads and back-compat.

import * as store from './mockStore';
import { scopeEmployees, scopeAttendance, dashboardMetrics, dashboardCards, employeeMonthSummary } from './selectors';

export const getBranches = () => store.getAll('branches');
export const getDepartments = () => store.getAll('departments');
export const getShifts = () => store.getAll('shifts');
export const getEmployees = () => store.getAll('employees');
export const getAttendance = () => store.getAll('attendance');
export const getNotifications = () => store.getAll('notifications');
export const getSuspiciousScans = () => store.getAll('suspiciousScans');
export const getCorrectionRequests = () => store.getAll('correctionRequests');
export const getLeaveRequests = () => store.getAll('leaveRequests');
export const getFaceRegistrations = () => store.getAll('faceRegistrations');
export const getAuditLogs = () => store.getAll('auditLogs');

// Role-scoped dashboard stat cards (back-compat helper).
export function getDashboardSummary(role, user) {
  const u = user || { role };
  const employees = scopeEmployees(store.getAll('employees'), u);
  const attendance = scopeAttendance(store.getAll('attendance'), employees);
  if (role === 'employee') {
    return dashboardCards(role, {}, employeeMonthSummary(store.getAll('attendance'), u.employeeId));
  }
  const metrics = dashboardMetrics({
    employees,
    attendance,
    suspiciousScans: store.getAll('suspiciousScans'),
    correctionRequests: store.getAll('correctionRequests'),
    faceRegistrations: store.getAll('faceRegistrations'),
  });
  return dashboardCards(role, metrics);
}
