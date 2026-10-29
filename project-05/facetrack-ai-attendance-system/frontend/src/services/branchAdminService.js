// FaceTrack AI — Branch Admin service (frontend-only mode).
//
// Derives the Branch Admin "Branch Operations + Attendance Control Center" data
// from the SHARED mock store collections — it does NOT introduce a separate /
// duplicate mock-data system (same store the rest of the app uses), and is
// separate from the Firebase-era `services/branchService.js` placeholder. Read
// functions are pure: components pass in the same arrays they read reactively
// via hooks/useStore (employees, attendance, departments, shifts,
// correctionRequests, …). Scope is BRANCH-level — deliberately different from
// the org-wide hrService and the team-level managerService.
//
// No writes here (branch CRUD lives in the existing shared pages); future
// backend: replace the read derivations with API reads — the UI does not change.

import { scopeEmployees, byId, nameOf } from './selectors';
import { todayISO, prettyDate } from '../utils/dateUtils';

const REVIEW_THRESHOLD = 85; // a department below this today is flagged for review
const ATTENDANCE_TARGET = 90; // branch attendance target

/* ---------------- reads (pure derivations over the shared store) ---------------- */

// Every employee in the admin's branch — reuses the shared role-scoping selector
// (branchAdmin → employees whose branchId matches), so scope rules stay in one place.
export function branchEmployees(employees, user) {
  return scopeEmployees(employees, user);
}

// The admin's branch record (or null).
export function branchInfo(branches, user) {
  return byId(branches, user?.branchId) || null;
}

// Today's attendance row for an employee (or null).
export function todayRowFor(attendance, empId, today = todayISO()) {
  return attendance.find((a) => a.employeeId === empId && a.date === today) || null;
}

// Branch operations overview for today + pending counts (branch-scoped).
export function branchOverview(emps, attendance, { correctionRequests = [], departments = [], shifts = [] } = {}) {
  const today = todayISO();
  const ids = new Set(emps.map((e) => e.id));
  const todays = attendance.filter((a) => ids.has(a.employeeId) && a.date === today);
  const onTime = todays.filter((a) => a.status === 'present').length;
  const late = todays.filter((a) => a.status === 'late').length;
  const absent = todays.filter((a) => a.status === 'absent').length;
  const onLeave = todays.filter((a) => a.status === 'leave').length;
  const present = onTime + late;
  const active = emps.filter((e) => e.status === 'active').length;

  const markedIds = new Set(todays.map((a) => a.employeeId));
  const notMarked = emps.filter((e) => e.status === 'active' && !markedIds.has(e.id)).length;
  const notCheckedOut = todays.filter((a) => a.checkIn && !a.checkOut).length;
  const pendingCorrections = correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;

  const deptIds = new Set(emps.map((e) => e.departmentId));
  const shiftIds = new Set(emps.map((e) => e.shiftId));
  const departmentsActive = departments.filter((d) => deptIds.has(d.id) && d.status !== 'inactive').length;
  const shiftsActive = shifts.filter((s) => shiftIds.has(s.id) && s.status === 'active').length;

  const attendanceRate = active ? Math.round((present / active) * 100) : 0;

  return {
    totalEmployees: emps.length,
    activeEmployees: active,
    present,
    onTime,
    late,
    absent,
    onLeave,
    notMarked,
    notCheckedOut,
    pendingCorrections,
    departmentsActive,
    shiftsActive,
    attendanceRate,
    belowTarget: active > 0 && attendanceRate < ATTENDANCE_TARGET,
  };
}

// Department-wise branch summary (only departments that have branch employees).
export function departmentSummary(emps, departments, attendance, { correctionRequests = [], employees = [] } = {}) {
  const today = todayISO();
  const deptIds = new Set(emps.map((e) => e.departmentId));
  const headPool = employees.length ? employees : emps;
  return departments
    .filter((d) => deptIds.has(d.id))
    .map((d) => {
      const members = emps.filter((e) => e.departmentId === d.id);
      const ids = new Set(members.map((m) => m.id));
      const todays = attendance.filter((a) => a.date === today && ids.has(a.employeeId));
      const onTime = todays.filter((a) => a.status === 'present').length;
      const late = todays.filter((a) => a.status === 'late').length;
      const absent = todays.filter((a) => a.status === 'absent').length;
      const present = onTime + late;
      const activeCount = members.filter((m) => m.status === 'active').length;
      const corrections = correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
      const rate = activeCount ? Math.round((present / activeCount) * 100) : 0;
      return {
        id: d.id,
        name: d.name,
        head: nameOf(headPool, d.managerId),
        total: members.length,
        active: activeCount,
        present,
        late,
        absent,
        correctionsPending: corrections,
        attendanceRate: rate,
        needsReview: activeCount > 0 && rate < REVIEW_THRESHOLD,
      };
    });
}

// Shift-wise branch summary (only shifts used by branch employees).
export function shiftSummary(emps, shifts, attendance) {
  const today = todayISO();
  const shiftIds = new Set(emps.map((e) => e.shiftId));
  return shifts
    .filter((s) => shiftIds.has(s.id))
    .map((s) => {
      const members = emps.filter((e) => e.shiftId === s.id);
      const ids = new Set(members.map((m) => m.id));
      const todays = attendance.filter((a) => a.date === today && ids.has(a.employeeId));
      const onTime = todays.filter((a) => a.status === 'present').length;
      const late = todays.filter((a) => a.status === 'late').length;
      const present = onTime + late;
      const activeCount = members.filter((m) => m.status === 'active').length;
      const rate = activeCount ? Math.round((present / activeCount) * 100) : 0;
      return {
        id: s.id,
        name: s.name,
        start: s.start,
        end: s.end,
        graceMinutes: s.graceMinutes,
        assigned: members.length,
        active: activeCount,
        lateToday: late,
        attendanceRate: rate,
        status: s.status,
      };
    });
}

// Compact branch alert lines derived from the overview + department summary.
export function branchAlerts(overview, deptSummaries = []) {
  const alerts = [];
  const plural = (n) => (n > 1 ? 's' : '');

  if (overview.late > 0) alerts.push({ tone: 'warning', text: `${overview.late} late check-in${plural(overview.late)} today` });
  if (overview.pendingCorrections > 0) alerts.push({ tone: 'info', text: `${overview.pendingCorrections} pending correction${plural(overview.pendingCorrections)}` });
  const review = deptSummaries.filter((d) => d.needsReview).length;
  if (review > 0) alerts.push({ tone: 'danger', text: `${review} department${plural(review)} need attendance review` });
  if (overview.notCheckedOut > 0) alerts.push({ tone: 'accent', text: `${overview.notCheckedOut} employee${plural(overview.notCheckedOut)} not checked out` });
  if (overview.belowTarget) alerts.push({ tone: 'danger', text: `Branch attendance below target (${overview.attendanceRate}%)` });

  if (!alerts.length) alerts.push({ tone: 'success', text: 'All clear — no branch alerts right now.' });
  return alerts;
}

// Branch recent activity timeline (branch-scoped). Shape matches <RecentActivity/>.
export function branchActivity(emps, { employees = [], attendance = [], leaveRequests = [], correctionRequests = [], faceRegistrations = [] }, limit = 8) {
  const ids = new Set(emps.map((e) => e.id));
  const who = (id) => nameOf(employees, id);

  const feed = [
    ...attendance
      .filter((a) => ids.has(a.employeeId) && a.checkIn)
      .map((a) => ({
        sort: `${a.date} ${a.checkIn || ''}`,
        time: a.date === todayISO() ? a.checkIn : prettyDate(a.date),
        text: `${who(a.employeeId)} ${a.status === 'late' ? 'marked late attendance' : 'marked attendance'}`,
        color: a.status === 'late' ? 'var(--ft-yellow)' : 'var(--ft-green)',
      })),
    ...leaveRequests
      .filter((r) => ids.has(r.employeeId))
      .map((r) => ({ sort: r.createdAt, time: prettyDate(r.createdAt), text: `Leave ${r.status} — ${who(r.employeeId)} (${r.leaveType})`, color: 'var(--ft-accent)' })),
    ...correctionRequests
      .filter((r) => ids.has(r.employeeId))
      .map((r) => ({ sort: r.createdAt, time: prettyDate(r.createdAt), text: `Correction ${r.status} — ${who(r.employeeId)}`, color: 'var(--ft-blue)' })),
    ...faceRegistrations
      .filter((r) => ids.has(r.employeeId))
      .map((r) => ({ sort: r.capturedAt, time: prettyDate(r.capturedAt), text: `Face profile ${r.status} — ${who(r.employeeId)}`, color: 'var(--ft-primary)' })),
  ];

  return feed
    .filter((x) => x.sort)
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0))
    .slice(0, limit);
}

// Branch Admin's own activity for the Profile timeline. Prefers the admin's real
// logged audit actions, falls back to branch activity, then a static line.
export function branchActivityOwn(auditLogs, user, emps, collections, limit = 6) {
  const own = auditLogs
    .filter((l) => l.actor && user?.name && l.actor === user.name)
    .map((l) => ({ sort: l.time, time: prettyDate(l.time), text: l.description || l.action, color: 'var(--ft-primary)' }))
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
  if (own.length) return own.slice(0, limit);

  const feed = branchActivity(emps, collections, limit);
  if (feed.length) return feed;

  return [{ time: 'Today', text: 'Opened the branch dashboard', color: 'var(--ft-primary)' }];
}
