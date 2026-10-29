// FaceTrack AI — Manager service (frontend-only mode).
//
// Derives the manager's "Team Monitoring + Approval" data from the SHARED mock
// store collections — it does NOT introduce a separate/duplicate mock-data
// system. Read functions are pure: components pass in the same arrays they read
// reactively via hooks/useStore (employees, attendance, leaveRequests,
// correctionRequests, faceRegistrations, shifts), so all previous frontend-only
// mock-mode work stays connected. Write helpers route approve/reject through
// services/mockStore so actions persist to localStorage and write an audit log.
//
// Future backend: replace the read derivations with API reads and the write
// helpers with API calls — the dashboard UI does not change.

import * as store from './mockStore';
import { scopeEmployees, byId, nameOf } from './selectors';
import { todayISO, daysAgoISO, prettyDate } from '../utils/dateUtils';

/* ---------------- reads (pure derivations over the shared store) ---------------- */

// The manager's direct reports (excludes the manager themselves), reusing the
// shared role-scoping selector so scope rules stay in one place.
export function managerTeam(employees, user) {
  return scopeEmployees(employees, user).filter((e) => e.id !== user?.employeeId);
}

// Today's attendance row for an employee (or null).
export function todayRowFor(attendance, empId, today = todayISO()) {
  return attendance.find((a) => a.employeeId === empId && a.date === today) || null;
}

// Today's attendance rows for the whole team (one synthetic row per member so
// people who never checked in still appear).
export function teamTodayRows(team, attendance) {
  const today = todayISO();
  return team.map((emp) => {
    const row = attendance.find((a) => a.employeeId === emp.id && a.date === today) || null;
    return { emp, row };
  });
}

// Pending overtime "requests" — today-ish team attendance rows that logged
// overtime and have not been decided yet. Derived from real attendance data,
// so approving/rejecting just patches the row (no separate collection).
export function pendingOvertimeRows(team, attendance, days = 7) {
  const ids = new Set(team.map((e) => e.id));
  const cutoff = daysAgoISO(days);
  return attendance
    .filter(
      (a) =>
        ids.has(a.employeeId) &&
        (a.overtimeMinutes || 0) > 0 &&
        a.overtimeApproved == null &&
        a.date >= cutoff
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Team overtime rows (attendance rows that logged overtime), optionally filtered
// by decision status. Mirrors the leave/correction queues so a decided overtime
// stays visible with a "Reviewed" state instead of silently vanishing.
//   status ''         → all overtime rows in range
//   status 'pending'  → overtimeApproved == null (not yet decided)
//   status 'approved' → overtimeApproved === true
//   status 'rejected' → overtimeApproved === false
export function teamOvertimeRows(team, attendance, status = '', days = 7) {
  const ids = new Set(team.map((e) => e.id));
  const cutoff = daysAgoISO(days);
  return attendance
    .filter((a) => ids.has(a.employeeId) && (a.overtimeMinutes || 0) > 0 && a.date >= cutoff)
    .filter((a) => {
      if (!status) return true;
      if (status === 'pending') return a.overtimeApproved == null;
      if (status === 'approved') return a.overtimeApproved === true;
      if (status === 'rejected') return a.overtimeApproved === false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Team KPI overview for today + pending-approval counts (team-scoped).
export function teamOverview(team, attendance, { leaveRequests = [], correctionRequests = [] } = {}) {
  const today = todayISO();
  const ids = new Set(team.map((e) => e.id));
  const todays = attendance.filter((a) => ids.has(a.employeeId) && a.date === today);
  const onTime = todays.filter((a) => a.status === 'present').length;
  const late = todays.filter((a) => a.status === 'late').length;
  const absent = todays.filter((a) => a.status === 'absent').length;
  const onLeave = todays.filter((a) => a.status === 'leave').length;
  const present = onTime + late;

  const pendingLeaves = leaveRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
  const pendingCorrections = correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
  const pendingOvertime = pendingOvertimeRows(team, attendance).length;

  return {
    teamSize: team.length,
    present,
    onTime,
    late,
    absent,
    onLeave,
    notMarked: Math.max(0, team.length - todays.length),
    pendingLeaves,
    pendingCorrections,
    pendingOvertime,
    pendingApprovals: pendingLeaves + pendingCorrections + pendingOvertime,
    attendanceRate: team.length ? Math.round((present / team.length) * 100) : 0,
  };
}

// Team members who are late today or have not checked in (excludes those on
// approved leave). Adds a monthly late count + a derived badge state.
export function lateOrMissing(team, attendance, shifts) {
  const today = todayISO();
  const month = today.slice(0, 7);
  return team
    .map((emp) => {
      const row = attendance.find((a) => a.employeeId === emp.id && a.date === today) || null;
      const shift = byId(shifts, emp.shiftId);
      const monthlyLate = attendance.filter(
        (a) => a.employeeId === emp.id && a.date.startsWith(month) && a.status === 'late'
      ).length;

      let state = null;
      if (row && row.status === 'leave') state = null; // on leave — not an alert
      else if (!row || !row.checkIn) state = 'notCheckedIn';
      else if (row.status === 'late') state = monthlyLate >= 3 ? 'repeatedLate' : 'late';

      return { emp, row, shift, monthlyLate, state };
    })
    .filter((x) => x.state);
}

// Team monthly snapshot (current month, team-scoped).
export function teamMonthlySnapshot(team, attendance, { leaveRequests = [], correctionRequests = [] } = {}) {
  const month = todayISO().slice(0, 7);
  const ids = new Set(team.map((e) => e.id));
  const rows = attendance.filter((a) => ids.has(a.employeeId) && a.date.startsWith(month));
  const present = rows.filter((a) => a.status === 'present' || a.status === 'late').length;
  const workingMarked = rows.filter((a) => a.status !== 'leave').length;

  return {
    avgAttendance: workingMarked ? Math.round((present / workingMarked) * 100) : 0,
    lateMarks: rows.filter((a) => a.status === 'late').length,
    absents: rows.filter((a) => a.status === 'absent').length,
    leaves: rows.filter((a) => a.status === 'leave').length,
    overtimeHours: Math.round((rows.reduce((s, a) => s + (a.overtimeMinutes || 0), 0) / 60) * 10) / 10,
    pendingRequests:
      leaveRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length +
      correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length,
  };
}

// Recent team activity timeline (merges attendance, leave, correction and face
// events for the team, most recent first). Shape matches <RecentActivity/>.
export function teamActivity(
  team,
  { employees = [], attendance = [], leaveRequests = [], correctionRequests = [], faceRegistrations = [] },
  limit = 8
) {
  const ids = new Set(team.map((e) => e.id));
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
      .map((r) => ({
        sort: r.createdAt,
        time: prettyDate(r.createdAt),
        text: `Leave ${r.status} — ${who(r.employeeId)} (${r.leaveType})`,
        color: 'var(--ft-accent)',
      })),
    ...correctionRequests
      .filter((r) => ids.has(r.employeeId))
      .map((r) => ({
        sort: r.createdAt,
        time: prettyDate(r.createdAt),
        text: `Correction request ${r.status} — ${who(r.employeeId)}`,
        color: 'var(--ft-blue)',
      })),
    ...faceRegistrations
      .filter((r) => ids.has(r.employeeId))
      .map((r) => ({
        sort: r.capturedAt,
        time: prettyDate(r.capturedAt),
        text: `Face profile ${r.status} — ${who(r.employeeId)}`,
        color: 'var(--ft-primary)',
      })),
  ];

  return feed
    .filter((x) => x.sort)
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0))
    .slice(0, limit);
}

// Compact manager alert lines derived from the overview + late/missing list.
export function teamAlerts(overview, lateMissing) {
  const notChecked = lateMissing.filter((x) => x.state === 'notCheckedIn').length;
  const alerts = [];
  const plural = (n) => (n > 1 ? 's' : '');

  if (overview.late > 0) alerts.push({ tone: 'warning', text: `${overview.late} employee${plural(overview.late)} late today` });
  if (overview.pendingCorrections > 0) alerts.push({ tone: 'info', text: `${overview.pendingCorrections} correction request${plural(overview.pendingCorrections)} pending` });
  if (overview.pendingLeaves > 0) alerts.push({ tone: 'info', text: `${overview.pendingLeaves} leave request${plural(overview.pendingLeaves)} pending` });
  if (overview.pendingOvertime > 0) alerts.push({ tone: 'accent', text: `${overview.pendingOvertime} overtime request${plural(overview.pendingOvertime)} pending` });
  if (notChecked > 0) alerts.push({ tone: 'danger', text: `${notChecked} employee${plural(notChecked)} not checked in` });

  if (!alerts.length) alerts.push({ tone: 'success', text: 'All clear — no pending team alerts.' });
  return alerts;
}

// Manager's own recent activity for the Manager Profile timeline. Prefers the
// manager's real logged audit actions (approvals etc.), falls back to recent
// team activity, then a static line — so it always shows something sensible.
export function managerActivity(auditLogs, user, team, collections, limit = 6) {
  const own = auditLogs
    .filter((l) => l.actor && user?.name && l.actor === user.name)
    .map((l) => ({ sort: l.time, time: prettyDate(l.time), text: l.description || l.action, color: 'var(--ft-primary)' }))
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
  if (own.length) return own.slice(0, limit);

  const feed = teamActivity(team, collections, limit);
  if (feed.length) return feed;

  return [{ time: 'Today', text: 'Viewed the team dashboard', color: 'var(--ft-primary)' }];
}

/* ---------------- writes (persist to the shared store + audit) ---------------- */

export function decideLeave(request, decision, actor) {
  store.update('leaveRequests', request.id, { status: decision, approvedBy: actor?.employeeId ?? null });
  store.addAudit({
    actor: actor?.name ?? 'Manager',
    role: actor?.role ?? 'manager',
    action: decision === 'approved' ? 'leaveApproved' : 'leaveRejected',
    target: request.id,
    description: `${decision === 'approved' ? 'Approved' : 'Rejected'} ${request.leaveType} leave (manager).`,
  });
}

export function decideCorrection(request, decision, actor) {
  store.update('correctionRequests', request.id, { status: decision, reviewedBy: actor?.employeeId ?? null });
  store.addAudit({
    actor: actor?.name ?? 'Manager',
    role: actor?.role ?? 'manager',
    action: decision === 'approved' ? 'correctionApproved' : 'correctionRejected',
    target: request.id,
    description: `${decision === 'approved' ? 'Approved' : 'Rejected'} correction request (manager).`,
  });
}

export function decideOvertime(row, decision, actor, employees = []) {
  store.update('attendance', row.id, { overtimeApproved: decision === 'approved' });
  store.addAudit({
    actor: actor?.name ?? 'Manager',
    role: actor?.role ?? 'manager',
    action: decision === 'approved' ? 'overtimeApproved' : 'overtimeRejected',
    target: row.id,
    description: `${decision === 'approved' ? 'Approved' : 'Rejected'} overtime for ${nameOf(employees, row.employeeId)} (${row.date}).`,
  });
}
