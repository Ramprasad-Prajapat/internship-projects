// FaceTrack AI — HR service (frontend-only mode).
//
// Derives the HR "People Operations + Attendance Control Center" data from the
// SHARED mock store collections — it does NOT introduce a separate/duplicate
// mock-data system (same store the rest of the app uses). Read functions are
// pure: components pass in the same arrays they read reactively via
// hooks/useStore (employees, attendance, leaveRequests, correctionRequests,
// faceRegistrations, suspiciousScans, departments). HR scope is ORG-WIDE +
// DEPARTMENT-level — deliberately different from the team-level managerService.
//
// Write helpers route approve/reject through services/mockStore so actions
// persist to localStorage and write an audit log. Future backend: replace the
// read derivations with API reads and the write helpers with API calls — the HR
// UI does not change.

import * as store from './mockStore';
import { scopeEmployees, nameOf } from './selectors';
import { todayISO, prettyDate } from '../utils/dateUtils';

// A department is flagged for review when its today attendance dips below this.
const REVIEW_THRESHOLD = 85;

/* ---------------- reads (pure derivations over the shared store) ---------------- */

// Every employee HR can see — reuses the shared role-scoping selector (HR → all)
// so scope rules stay in one place.
export function hrEmployees(employees, user) {
  return scopeEmployees(employees, user);
}

// Today's attendance row for an employee (or null).
export function todayRowFor(attendance, empId, today = todayISO()) {
  return attendance.find((a) => a.employeeId === empId && a.date === today) || null;
}

// Org-wide people-operations overview for today + pending-action counts.
export function hrOverview(
  employees,
  attendance,
  { leaveRequests = [], correctionRequests = [], faceRegistrations = [], suspiciousScans = [], departments = [] } = {}
) {
  const today = todayISO();
  // Count today's attendance only for ACTIVE employees, so the numerator
  // (present/late) and the denominator (active employees) use the SAME
  // population. Otherwise a present/late row belonging to an inactive employee
  // could push the attendance rate above 100%.
  const activeEmployees = employees.filter((e) => e.status === 'active');
  const activeIds = new Set(activeEmployees.map((e) => e.id));
  const todays = attendance.filter((a) => a.date === today && activeIds.has(a.employeeId));
  const onTime = todays.filter((a) => a.status === 'present').length;
  const late = todays.filter((a) => a.status === 'late').length;
  const absent = todays.filter((a) => a.status === 'absent').length;
  const onLeave = todays.filter((a) => a.status === 'leave').length;
  const present = onTime + late;
  const active = activeEmployees.length;

  const markedIds = new Set(todays.map((a) => a.employeeId));
  const notMarked = employees.filter((e) => e.status === 'active' && !markedIds.has(e.id)).length;

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length;
  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending').length;
  const pendingFaceApprovals = faceRegistrations.filter((r) => r.status === 'pending').length;
  const suspiciousAlerts = suspiciousScans.filter((s) => s.status === 'pending').length;

  return {
    totalEmployees: employees.length,
    activeEmployees: active,
    present,
    onTime,
    late,
    absent,
    onLeave,
    notMarked,
    pendingLeaves,
    pendingCorrections,
    pendingFaceApprovals,
    suspiciousAlerts,
    departmentsActive: departments.filter((d) => d.status === 'active').length,
    departmentsTotal: departments.length,
    pendingActions: pendingLeaves + pendingCorrections + pendingFaceApprovals,
    attendanceRate: active ? Math.round((present / active) * 100) : 0,
  };
}

// Department-wise operations summary (org-wide, today + pending requests).
// Distinct from the manager team view: every department is rolled up here.
export function departmentSummary(
  employees,
  departments,
  attendance,
  { leaveRequests = [], correctionRequests = [] } = {}
) {
  const today = todayISO();
  return departments.map((d) => {
    const members = employees.filter((e) => e.departmentId === d.id);
    // Same-population rule as hrOverview: derive today's present/late counts from
    // ACTIVE members only so the department attendance rate can't exceed 100%.
    const activeMembers = members.filter((m) => m.status === 'active');
    const ids = new Set(activeMembers.map((m) => m.id));
    const todays = attendance.filter((a) => a.date === today && ids.has(a.employeeId));
    const onTime = todays.filter((a) => a.status === 'present').length;
    const late = todays.filter((a) => a.status === 'late').length;
    const absent = todays.filter((a) => a.status === 'absent').length;
    const onLeave = todays.filter((a) => a.status === 'leave').length;
    const present = onTime + late;
    const activeCount = activeMembers.length;
    const leaves = leaveRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
    const corrections = correctionRequests.filter((r) => ids.has(r.employeeId) && r.status === 'pending').length;
    const rate = activeCount ? Math.round((present / activeCount) * 100) : 0;
    return {
      id: d.id,
      name: d.name,
      total: members.length,
      active: activeCount,
      present,
      late,
      absent,
      onLeave,
      leaveRequests: leaves,
      correctionsPending: corrections,
      attendanceRate: rate,
      needsReview: activeCount > 0 && rate < REVIEW_THRESHOLD,
    };
  });
}

// Compact HR alert lines derived from the overview + department summary.
export function hrAlerts(overview, deptSummaries = []) {
  const alerts = [];
  const plural = (n) => (n > 1 ? 's' : '');

  if (overview.late > 0) alerts.push({ tone: 'warning', text: `${overview.late} late check-in${plural(overview.late)} today` });
  if (overview.pendingLeaves > 0) alerts.push({ tone: 'info', text: `${overview.pendingLeaves} leave request${plural(overview.pendingLeaves)} pending` });
  if (overview.pendingCorrections > 0) alerts.push({ tone: 'info', text: `${overview.pendingCorrections} correction request${plural(overview.pendingCorrections)} pending` });
  if (overview.pendingFaceApprovals > 0) alerts.push({ tone: 'accent', text: `${overview.pendingFaceApprovals} face approval${plural(overview.pendingFaceApprovals)} pending` });

  const review = deptSummaries.filter((d) => d.needsReview).length;
  if (review > 0) alerts.push({ tone: 'danger', text: `${review} department${plural(review)} need attendance review` });

  if (!alerts.length) alerts.push({ tone: 'success', text: 'All clear — no pending HR actions right now.' });
  return alerts;
}

// Org-wide recent activity timeline (merges attendance, leave, correction and
// face events, most recent first). Shape matches <RecentActivity/>.
export function hrActivity(
  { employees = [], attendance = [], leaveRequests = [], correctionRequests = [], faceRegistrations = [] },
  limit = 8
) {
  const who = (id) => nameOf(employees, id);

  const feed = [
    ...attendance
      .filter((a) => a.checkIn)
      .map((a) => ({
        sort: `${a.date} ${a.checkIn || ''}`,
        time: a.date === todayISO() ? a.checkIn : prettyDate(a.date),
        text: `${who(a.employeeId)} ${a.status === 'late' ? 'marked late attendance' : 'marked attendance'}`,
        color: a.status === 'late' ? 'var(--ft-yellow)' : 'var(--ft-green)',
      })),
    ...leaveRequests.map((r) => ({
      sort: r.createdAt,
      time: prettyDate(r.createdAt),
      text: `Leave ${r.status} — ${who(r.employeeId)} (${r.leaveType})`,
      color: 'var(--ft-accent)',
    })),
    ...correctionRequests.map((r) => ({
      sort: r.createdAt,
      time: prettyDate(r.createdAt),
      text: `Correction ${r.status} — ${who(r.employeeId)}`,
      color: 'var(--ft-blue)',
    })),
    ...faceRegistrations.map((r) => ({
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

// HR's own recent activity for the HR Profile timeline. Prefers the HR user's
// real logged audit actions (approvals, edits etc.), falls back to org-wide
// activity, then a static line — so it always shows something sensible.
export function hrActivityOwn(auditLogs, user, collections, limit = 6) {
  const own = auditLogs
    .filter((l) => l.actor && user?.name && l.actor === user.name)
    .map((l) => ({ sort: l.time, time: prettyDate(l.time), text: l.description || l.action, color: 'var(--ft-primary)' }))
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
  if (own.length) return own.slice(0, limit);

  const feed = hrActivity(collections, limit);
  if (feed.length) return feed;

  return [{ time: 'Today', text: 'Opened the HR dashboard', color: 'var(--ft-primary)' }];
}

/* ---------------- writes (persist to the shared store + audit) ---------------- */

// Inline leave decision from the HR dashboard. The dedicated Corrections / Face
// Approval pages keep their richer review flows (remarks, attendance reflow) —
// this mirrors LeaveRequestsPage so dashboard approvals stay consistent.
export function decideLeave(request, decision, actor, employees = []) {
  store.update('leaveRequests', request.id, {
    status: decision,
    approvedBy: actor?.employeeId ?? null,
  });
  store.addAudit({
    actor: actor?.name ?? 'HR',
    role: actor?.role ?? 'hr',
    action: decision === 'approved' ? 'leaveApproved' : 'leaveRejected',
    target: request.id,
    description: `${decision === 'approved' ? 'Approved' : 'Rejected'} ${request.leaveType} leave for ${nameOf(
      employees,
      request.employeeId
    )} (HR).`,
  });
}
