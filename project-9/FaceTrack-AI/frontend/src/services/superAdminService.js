// FaceTrack AI — Super Admin service (frontend-only mode).
//
// Derives the Super Admin "Global Control + Branch Monitoring + Role Management"
// data from the SHARED mock store collections — it does NOT introduce a separate
// / duplicate mock-data system (same store the rest of the app uses). Read
// functions are pure: components pass in the arrays they read reactively via
// hooks/useStore (employees, attendance, branches, departments, shifts,
// leaveRequests, correctionRequests, faceRegistrations, suspiciousScans,
// auditLogs). Scope is GLOBAL / all-branches — deliberately different from the
// org-wide HR, branch-level Branch Admin, and team-level Manager services.
//
// No writes here (global CRUD lives on the existing shared pages); future
// backend: replace the read derivations with API reads — the UI does not change.

import { byId, nameOf } from './selectors';
import { todayISO, prettyDate } from '../utils/dateUtils';
import { MOCK_USERS } from '../data/users';

const ATTENDANCE_TARGET = 90; // a branch below this today is flagged for review

/* ---------------- helpers ---------------- */

// HR staff = anyone in an HR-named department or with an HR designation
// (mirrors the read-only HR Management page so counts stay consistent).
export function hrStaff(employees, departments) {
  const hrDeptIds = departments.filter((d) => /hr|human/i.test(d.name)).map((d) => d.id);
  return employees.filter(
    (e) => hrDeptIds.includes(e.departmentId) || /\bhr\b|human resource/i.test(e.designation || '')
  );
}

/* ---------------- global overview ---------------- */

export function globalOverview(
  employees,
  attendance,
  { branches = [], departments = [], shifts = [], leaveRequests = [], correctionRequests = [], faceRegistrations = [], suspiciousScans = [] } = {}
) {
  const today = todayISO();
  const todays = attendance.filter((a) => a.date === today);
  const onTime = todays.filter((a) => a.status === 'present').length;
  const late = todays.filter((a) => a.status === 'late').length;
  const absent = todays.filter((a) => a.status === 'absent').length;
  const onLeave = todays.filter((a) => a.status === 'leave').length;
  const present = onTime + late;
  const active = employees.filter((e) => e.status === 'active').length;

  const activeHR = hrStaff(employees, departments).filter((e) => e.status === 'active').length;
  const managerIds = new Set(departments.map((d) => d.managerId).filter(Boolean));
  const activeManagers = employees.filter((e) => managerIds.has(e.id) && e.status === 'active').length;
  const activeBranchAdmins = branches.filter((b) => b.branchAdminId).length;

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length;
  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending').length;
  const pendingFaceApprovals = faceRegistrations.filter((r) => r.status === 'pending').length;
  const suspiciousAlerts = suspiciousScans.filter((s) => s.status === 'pending').length;

  return {
    totalBranches: branches.length,
    activeBranches: branches.filter((b) => b.status === 'active').length,
    inactiveBranches: branches.filter((b) => b.status !== 'active').length,
    totalDepartments: departments.length,
    totalEmployees: employees.length,
    activeEmployees: active,
    activeHR,
    activeManagers,
    activeBranchAdmins,
    present,
    onTime,
    late,
    absent,
    onLeave,
    pendingLeaves,
    pendingCorrections,
    pendingFaceApprovals,
    suspiciousAlerts,
    pendingRequests: pendingLeaves + pendingCorrections + pendingFaceApprovals,
    attendanceRate: active ? Math.round((present / active) * 100) : 0,
  };
}

/* ---------------- branch performance / network ---------------- */

export function branchPerformance(employees, branches, attendance, { correctionRequests = [] } = {}) {
  const today = todayISO();
  return branches.map((b) => {
    const members = employees.filter((e) => e.branchId === b.id);
    const ids = new Set(members.map((m) => m.id));
    const todays = attendance.filter((a) => a.date === today && ids.has(a.employeeId));
    const onTime = todays.filter((a) => a.status === 'present').length;
    const late = todays.filter((a) => a.status === 'late').length;
    const absent = todays.filter((a) => a.status === 'absent').length;
    const present = onTime + late;
    const active = members.filter((m) => m.status === 'active').length;
    const corrections = correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
    const rate = active ? Math.round((present / active) * 100) : 0;
    // Branch admin name resolves from a demo MOCK_USER uid first, then (so Super
    // Admin can assign any employee as branch admin in mock mode) from an employee id.
    const adminUser = MOCK_USERS.find((u) => u.uid === b.branchAdminId);
    const adminEmp = !adminUser && b.branchAdminId ? employees.find((e) => e.id === b.branchAdminId) : null;
    return {
      id: b.id,
      name: b.name,
      city: b.city,
      admin: adminUser?.name || adminEmp?.name || 'Unassigned',
      adminAssigned: !!b.branchAdminId,
      total: members.length,
      active,
      present,
      absent,
      late,
      correctionsPending: corrections,
      attendanceRate: rate,
      radiusMeters: b.radiusMeters,
      status: b.status,
      needsReview: active > 0 && rate < ATTENDANCE_TARGET,
    };
  });
}

/* ---------------- role & access control ---------------- */

export function roleAccessSummary(overview) {
  return [
    { role: 'superAdmin', name: 'Super Admin', users: 1, access: 'Global', permissions: 'Full system control · all branches, roles & settings', status: 'active' },
    { role: 'branchAdmin', name: 'Branch Admin', users: overview.activeBranchAdmins, access: 'Branch', permissions: 'Branch employees, attendance, departments, shifts, reports', status: 'active' },
    { role: 'hr', name: 'HR', users: overview.activeHR, access: 'Org-wide', permissions: 'Employees, leave, corrections, face approvals, reports', status: 'active' },
    { role: 'manager', name: 'Manager', users: overview.activeManagers, access: 'Team', permissions: 'Team monitoring & leave/correction/overtime approvals', status: 'active' },
    { role: 'employee', name: 'Employee', users: overview.activeEmployees, access: 'Self', permissions: 'Own attendance, leave, corrections, profile', status: 'active' },
  ];
}

/* ---------------- data quality / missing-setup checker ---------------- */

function qualityTone(count) {
  if (count === 0) return { tone: 'success', statusLabel: 'Good' };
  if (count <= 2) return { tone: 'warning', statusLabel: 'Warning' };
  if (count <= 4) return { tone: 'accent', statusLabel: 'Needs Review' };
  return { tone: 'danger', statusLabel: 'Critical' };
}

export function dataQuality(employees, branches, departments, shifts, { faceRegistrations = [] } = {}) {
  const shiftIds = new Set(shifts.map((s) => s.id));
  const checks = [
    { key: 'noBranch', label: 'Employees without branch', count: employees.filter((e) => !e.branchId).length },
    { key: 'noShift', label: 'Employees without shift', count: employees.filter((e) => !e.shiftId || !shiftIds.has(e.shiftId)).length },
    { key: 'deptNoManager', label: 'Departments without manager', count: departments.filter((d) => !d.managerId).length },
    { key: 'branchNoAdmin', label: 'Branches without branch admin', count: branches.filter((b) => !b.branchAdminId).length },
    { key: 'pendingFace', label: 'Users pending face registration', count: employees.filter((e) => e.faceStatus === 'pending').length },
    { key: 'noFace', label: 'Users not face-registered', count: employees.filter((e) => e.faceStatus === 'none').length },
    { key: 'inactive', label: 'Inactive users', count: employees.filter((e) => e.status === 'inactive').length },
    { key: 'noPhone', label: 'Missing phone numbers', count: employees.filter((e) => !e.phone).length },
  ];
  return checks.map((c) => ({ ...c, ...qualityTone(c.count) }));
}

/* ---------------- platform health ---------------- */

export function platformHealth(overview, dataQualityResults = [], branchPerf = []) {
  const critical = dataQualityResults.filter((d) => d.tone === 'danger').reduce((s, d) => s + d.count, 0);
  const warn = dataQualityResults.filter((d) => d.tone === 'warning' || d.tone === 'accent').reduce((s, d) => s + d.count, 0);
  const lowBranches = branchPerf.filter((b) => b.needsReview).length;
  const penalty = Math.min(40, critical * 4 + warn * 2 + lowBranches * 3);
  const score = Math.round(overview.attendanceRate * 0.4 + (100 - penalty) * 0.6);
  return Math.max(60, Math.min(100, score));
}

/* ---------------- system alerts center ---------------- */

export function systemAlerts(overview, branchPerf = [], dataQualityResults = []) {
  const dq = (key) => dataQualityResults.find((d) => d.key === key)?.count || 0;
  const plural = (n) => (n > 1 ? 's' : '');
  const lowBranches = branchPerf.filter((b) => b.needsReview).length;

  const alerts = [
    lowBranches && { id: 'lowBranches', title: `${lowBranches} branch${lowBranches > 1 ? 'es' : ''} below ${ATTENDANCE_TARGET}% attendance`, category: 'Attendance', severity: 'warning' },
    overview.pendingCorrections && { id: 'pendingCorrections', title: `${overview.pendingCorrections} pending correction${plural(overview.pendingCorrections)}`, category: 'Requests', severity: 'info' },
    overview.pendingFaceApprovals && { id: 'pendingFace', title: `${overview.pendingFaceApprovals} face approval${plural(overview.pendingFaceApprovals)} pending`, category: 'Face', severity: 'accent' },
    overview.pendingLeaves && { id: 'pendingLeaves', title: `${overview.pendingLeaves} leave request${plural(overview.pendingLeaves)} pending`, category: 'Requests', severity: 'info' },
    dq('branchNoAdmin') && { id: 'branchNoAdmin', title: `${dq('branchNoAdmin')} branch${dq('branchNoAdmin') > 1 ? 'es' : ''} without a branch admin`, category: 'Setup', severity: 'danger' },
    dq('deptNoManager') && { id: 'deptNoManager', title: `${dq('deptNoManager')} department${plural(dq('deptNoManager'))} without a manager`, category: 'Setup', severity: 'warning' },
    dq('noShift') && { id: 'noShift', title: `${dq('noShift')} employee${plural(dq('noShift'))} without a shift`, category: 'Setup', severity: 'warning' },
    dq('pendingFace') && { id: 'pendingFaceReg', title: `${dq('pendingFace')} user${plural(dq('pendingFace'))} pending face registration`, category: 'Face', severity: 'info' },
    overview.suspiciousAlerts && { id: 'suspicious', title: `${overview.suspiciousAlerts} suspicious scan${plural(overview.suspiciousAlerts)} flagged`, category: 'Security', severity: 'danger' },
  ].filter(Boolean);

  if (!alerts.length) alerts.push({ id: 'allClear', title: 'All clear — no platform alerts right now.', category: 'System', severity: 'success' });
  return alerts;
}

/* ---------------- global activity timeline ---------------- */

// The global trail is the audit log (real recorded admin actions), newest first.
export function globalActivity(auditLogs, limit = 8) {
  return auditLogs
    .slice()
    .sort((a, b) => (a.time < b.time ? 1 : a.time > b.time ? -1 : 0))
    .slice(0, limit)
    .map((l) => ({ time: prettyDate(l.time), text: `${l.actor || 'System'} — ${l.description || l.action}`, color: 'var(--ft-primary)' }));
}

// Super Admin's own activity for the Profile timeline (own audit actions →
// global activity → static fallback).
export function superAdminActivityOwn(auditLogs, user, limit = 6) {
  const own = auditLogs
    .filter((l) => l.actor && user?.name && l.actor === user.name)
    .map((l) => ({ sort: l.time, time: prettyDate(l.time), text: l.description || l.action, color: 'var(--ft-primary)' }))
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
  if (own.length) return own.slice(0, limit);

  const feed = globalActivity(auditLogs, limit);
  if (feed.length) return feed;

  return [{ time: 'Today', text: 'Opened the global control dashboard', color: 'var(--ft-primary)' }];
}

// Re-export for convenience where a name lookup is needed in pages.
export { byId, nameOf };
