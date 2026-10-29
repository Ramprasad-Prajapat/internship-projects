// FaceTrack AI — Derived-data selectors (frontend-only mode).
//
// Pure functions that turn raw store collections into role-scoped lists and
// dashboard/report aggregates. Components pass in data from useCollection(...)
// and memoize the result. No store/React imports here so this stays testable.

import { ROLES } from '../utils/constants';
import { todayISO } from '../utils/dateUtils';

/* ---------- role scoping ---------- */
export function scopeEmployees(employees, user) {
  if (!user) return [];
  switch (user.role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.HR:
      return employees;
    case ROLES.BRANCH_ADMIN:
      return employees.filter((e) => e.branchId === user.branchId);
    case ROLES.MANAGER:
      return employees.filter((e) => e.managerId === user.employeeId || e.id === user.employeeId);
    case ROLES.EMPLOYEE:
      return employees.filter((e) => e.id === user.employeeId);
    default:
      return [];
  }
}

export function scopeAttendance(attendance, scopedEmployees) {
  const ids = new Set(scopedEmployees.map((e) => e.id));
  return attendance.filter((a) => ids.has(a.employeeId));
}

/* ---------- lookups ---------- */
export const byId = (list, id) => list.find((x) => x.id === id) || null;
export const nameOf = (employees, id) => byId(employees, id)?.name || '—';

export function employeeView(emp, { branches = [], departments = [], shifts = [] }) {
  if (!emp) return null;
  return {
    ...emp,
    branchName: byId(branches, emp.branchId)?.name || '—',
    departmentName: byId(departments, emp.departmentId)?.name || '—',
    shiftName: byId(shifts, emp.shiftId)?.name || '—',
  };
}

/* ---------- dashboard metrics ---------- */
export function dashboardMetrics({ employees, attendance, suspiciousScans = [], correctionRequests = [], faceRegistrations = [] }) {
  const today = todayISO();
  const todays = attendance.filter((a) => a.date === today);
  const present = todays.filter((a) => a.status === 'present').length;
  const late = todays.filter((a) => a.status === 'late').length;
  const absent = todays.filter((a) => a.status === 'absent').length;
  const onLeave = todays.filter((a) => a.status === 'leave').length;
  const overtime = todays.filter((a) => a.overtimeMinutes > 0).length;
  const activeEmployees = employees.filter((e) => e.status === 'active').length;

  return {
    totalEmployees: employees.length,
    activeEmployees,
    present: present + late,
    onTime: present,
    late,
    absent,
    onLeave,
    overtime,
    pendingCorrections: correctionRequests.filter((c) => c.status === 'pending').length,
    pendingFaceApprovals: faceRegistrations.filter((f) => f.status === 'pending').length,
    suspiciousAlerts: suspiciousScans.filter((s) => s.status === 'pending').length,
    attendanceRate: activeEmployees ? Math.round(((present + late) / activeEmployees) * 100) : 0,
  };
}

// Stat cards for a role dashboard.
export function dashboardCards(role, metrics, selfSummary) {
  if (role === ROLES.EMPLOYEE) {
    return [
      { label: 'Status Today', value: selfSummary?.statusToday ?? '—', tone: selfSummary?.tone ?? 'primary' },
      { label: 'Check-in', value: selfSummary?.checkIn ?? '—', tone: 'primary' },
      { label: 'Present (Month)', value: selfSummary?.presentDays ?? 0, tone: 'success' },
      { label: 'Late (Month)', value: selfSummary?.lateDays ?? 0, tone: 'warning' },
      { label: 'Overtime (hrs)', value: selfSummary?.overtimeHours ?? 0, tone: 'accent' },
      { label: 'Pending Requests', value: selfSummary?.pendingRequests ?? 0, tone: 'primary' },
    ];
  }
  return [
    { label: 'Total Employees', value: metrics.totalEmployees, tone: 'primary' },
    { label: 'Present Today', value: metrics.present, tone: 'success' },
    { label: 'Absent', value: metrics.absent, tone: 'danger' },
    { label: 'Late', value: metrics.late, tone: 'warning' },
    { label: 'Overtime', value: metrics.overtime, tone: 'accent' },
    { label: 'Alerts', value: metrics.suspiciousAlerts, tone: 'danger' },
  ];
}

/* ---------- chart datasets ---------- */
export function presentAbsentSeries(attendance) {
  const today = todayISO();
  const t = attendance.filter((a) => a.date === today);
  return [
    { label: 'Present', value: t.filter((a) => a.status === 'present').length, color: 'var(--ft-green)' },
    { label: 'Late', value: t.filter((a) => a.status === 'late').length, color: 'var(--ft-yellow)' },
    { label: 'Absent', value: t.filter((a) => a.status === 'absent').length, color: 'var(--ft-red)' },
    { label: 'Leave', value: t.filter((a) => a.status === 'leave').length, color: 'var(--ft-accent)' },
  ];
}

export function attendanceTrend(attendance, days = 7) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const rows = attendance.filter((a) => a.date === iso);
    const dow = d.getDay();
    out.push({
      label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow],
      date: iso,
      present: rows.filter((a) => a.status === 'present' || a.status === 'late').length,
      absent: rows.filter((a) => a.status === 'absent').length,
    });
  }
  return out;
}

export function departmentBreakdown(employees, departments) {
  return departments.map((d) => ({
    label: d.name,
    value: employees.filter((e) => e.departmentId === d.id).length,
  }));
}

/* ---------- per-employee monthly summary ---------- */
export function employeeMonthSummary(attendance, employeeId) {
  const month = todayISO().slice(0, 7);
  const rows = attendance.filter((a) => a.employeeId === employeeId && a.date.startsWith(month));
  const today = rows.find((a) => a.date === todayISO());
  const statusMap = { present: 'Present', late: 'Late', absent: 'Absent', leave: 'On Leave' };
  const toneMap = { present: 'success', late: 'warning', absent: 'danger', leave: 'accent' };
  return {
    statusToday: today ? statusMap[today.status] : 'Not marked',
    tone: today ? toneMap[today.status] : 'primary',
    checkIn: today?.checkIn ?? '—',
    checkOut: today?.checkOut ?? '—',
    presentDays: rows.filter((a) => a.status === 'present' || a.status === 'late').length,
    lateDays: rows.filter((a) => a.status === 'late').length,
    absentDays: rows.filter((a) => a.status === 'absent').length,
    leaveDays: rows.filter((a) => a.status === 'leave').length,
    overtimeHours: Math.round((rows.reduce((s, a) => s + (a.overtimeMinutes || 0), 0) / 60) * 10) / 10,
  };
}
