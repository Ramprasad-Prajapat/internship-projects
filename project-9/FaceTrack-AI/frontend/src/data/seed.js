// FaceTrack AI — Seed generators (frontend-only mode).
//
// Produces a rich, stable-ish dataset at first load: ~3 weeks of attendance
// for every active employee, plus correction/leave requests, a face-approval
// queue, suspicious-scan logs, audit logs and notifications. Dates are anchored
// to the real "today" so dashboards always look live. A small seeded PRNG keeps
// the generated values deterministic per (employee, day).

import { EMPLOYEES } from './employees';
import { SHIFTS } from './shifts';

const DAYS_BACK = 21;

/* ---------- tiny deterministic PRNG (mulberry32) ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- date + time helpers ---------- */
function isoDaysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function dayOfWeek(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.getDay(); // 0 Sun … 6 Sat
}
function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function toHHMM(mins) {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
const shiftById = (id) => SHIFTS.find((s) => s.id === id);

/* ---------- attendance generator ---------- */
export function generateAttendance() {
  const rows = [];
  const active = EMPLOYEES.filter((e) => e.status === 'active');

  active.forEach((emp, ei) => {
    const shift = shiftById(emp.shiftId);
    const startMin = toMin(shift.start);
    const endMin = toMin(shift.end) > startMin ? toMin(shift.end) : toMin(shift.end) + 1440;
    const workMin = endMin - startMin;

    for (let off = 0; off <= DAYS_BACK; off++) {
      const dow = dayOfWeek(off);
      if (dow === 0 || dow === 6) continue; // weekends off

      const r = rng(ei * 1000 + off + 7);
      const date = isoDaysAgo(off);
      const roll = r();
      const isToday = off === 0;

      // Status distribution
      let status;
      if (roll < 0.05) status = 'absent';
      else if (roll < 0.07) status = 'leave';
      else if (roll < 0.22) status = 'late';
      else status = 'present';

      if (status === 'absent' || status === 'leave') {
        rows.push({
          id: `att-${emp.id}-${date}`,
          employeeId: emp.id,
          branchId: emp.branchId,
          departmentId: emp.departmentId,
          shiftId: emp.shiftId,
          date,
          checkIn: null,
          checkOut: null,
          status,
          lateMinutes: 0,
          overtimeMinutes: 0,
          totalHours: 0,
          confidence: null,
          location: null,
          markedBy: status === 'leave' ? 'system' : 'auto',
          manualEditReason: null,
        });
        continue;
      }

      const grace = shift.graceMinutes;
      const lateBy = status === 'late' ? grace + 1 + Math.floor(r() * 38) : Math.floor(r() * (grace + 8)) - 6;
      const checkInMin = startMin + lateBy;
      const lateMinutes = Math.max(0, checkInMin - (startMin + grace));

      // Some of today's people are still working (no checkout yet).
      const stillWorking = isToday && r() < 0.45;
      let checkOutMin = null;
      let overtimeMinutes = 0;
      let totalHours = 0;
      if (!stillWorking) {
        const otRoll = r();
        const ot = otRoll < 0.18 ? 30 + Math.floor(r() * 110) : Math.floor(r() * 12) - 6;
        checkOutMin = endMin + ot;
        overtimeMinutes = Math.max(0, checkOutMin - endMin);
        totalHours = Math.round(((checkOutMin - checkInMin) / 60) * 10) / 10;
      }

      const conf = Math.round((0.82 + r() * 0.17) * 100) / 100;
      const outside = r() < 0.05;

      rows.push({
        id: `att-${emp.id}-${date}`,
        employeeId: emp.id,
        branchId: emp.branchId,
        departmentId: emp.departmentId,
        shiftId: emp.shiftId,
        date,
        checkIn: toHHMM(checkInMin),
        checkOut: checkOutMin == null ? null : toHHMM(checkOutMin),
        status,
        lateMinutes,
        overtimeMinutes,
        totalHours: totalHours || (stillWorking ? Math.round((workMin / 60) * 10) / 10 : 0),
        confidence: conf,
        location: {
          status: outside ? 'outsideRadius' : 'insideRadius',
          distanceMeters: outside ? 200 + Math.floor(r() * 400) : Math.floor(r() * 130),
        },
        markedBy: 'face',
        manualEditReason: null,
      });
    }
  });

  return rows;
}

/* ---------- correction requests ---------- */
export const CORRECTION_REQUESTS = [
  { id: 'cr-001', employeeId: 'EMP002', date: isoDaysAgo(2), type: 'missedCheckOut', reason: 'Forgot to check out, left at 6:10 PM.', requestedCheckIn: null, requestedCheckOut: '18:10', status: 'pending', hrRemark: '', createdAt: isoDaysAgo(2) },
  { id: 'cr-002', employeeId: 'EMP001', date: isoDaysAgo(4), type: 'faceScanFailed', reason: 'Camera would not detect my face in low light.', requestedCheckIn: '14:03', requestedCheckOut: null, status: 'pending', hrRemark: '', createdAt: isoDaysAgo(4) },
  { id: 'cr-003', employeeId: 'EMP009', date: isoDaysAgo(6), type: 'wrongTime', reason: 'Check-in time recorded 20 minutes late incorrectly.', requestedCheckIn: '21:58', requestedCheckOut: null, status: 'approved', hrRemark: 'Verified with branch lead.', createdAt: isoDaysAgo(6) },
  { id: 'cr-004', employeeId: 'EMP005', date: isoDaysAgo(8), type: 'locationIssue', reason: 'Was on-site but GPS placed me outside the radius.', requestedCheckIn: null, requestedCheckOut: null, status: 'rejected', hrRemark: 'No supporting record found.', createdAt: isoDaysAgo(8) },
  { id: 'cr-005', employeeId: 'EMP011', date: isoDaysAgo(1), type: 'missedCheckIn', reason: 'App crashed during check-in this morning.', requestedCheckIn: '09:05', requestedCheckOut: null, status: 'pending', hrRemark: '', createdAt: isoDaysAgo(1) },
];

/* ---------- leave requests ---------- */
export const LEAVE_REQUESTS = [
  { id: 'lv-001', employeeId: 'EMP003', leaveType: 'Sick', startDate: isoDaysAgo(1), endDate: isoDaysAgo(0), reason: 'Fever and rest advised.', status: 'pending', approvedBy: null, createdAt: isoDaysAgo(2) },
  { id: 'lv-002', employeeId: 'EMP001', leaveType: 'Casual', startDate: isoDaysAgo(-3), endDate: isoDaysAgo(-3), reason: 'Family function.', status: 'pending', approvedBy: null, createdAt: isoDaysAgo(1) },
  { id: 'lv-003', employeeId: 'EMP010', leaveType: 'Annual', startDate: isoDaysAgo(-10), endDate: isoDaysAgo(-6), reason: 'Vacation.', status: 'approved', approvedBy: 'EMP012', createdAt: isoDaysAgo(5) },
  { id: 'lv-004', employeeId: 'EMP002', leaveType: 'Casual', startDate: isoDaysAgo(9), endDate: isoDaysAgo(9), reason: 'Personal work.', status: 'rejected', approvedBy: 'EMP012', createdAt: isoDaysAgo(11) },
];

/* ---------- face registration queue ---------- */
export const FACE_REGISTRATIONS = [
  { id: 'fr-001', employeeId: 'EMP003', status: 'pending', confidence: 0.91, capturedAt: isoDaysAgo(1), reviewedBy: null, note: '' },
  { id: 'fr-002', employeeId: 'EMP014', status: 'pending', confidence: 0.88, capturedAt: isoDaysAgo(0), reviewedBy: null, note: '' },
  { id: 'fr-003', employeeId: 'EMP009', status: 'approved', confidence: 0.95, capturedAt: isoDaysAgo(12), reviewedBy: 'EMP012', note: 'Clear capture.' },
  { id: 'fr-004', employeeId: 'EMP007', status: 'rejected', confidence: 0.52, capturedAt: isoDaysAgo(20), reviewedBy: 'EMP012', note: 'Low quality, re-register required.' },
];

/* ---------- suspicious scans ---------- */
export const SUSPICIOUS_SCANS = [
  { id: 'ss-001', employeeId: 'EMP006', reason: 'lowConfidence', confidence: 0.41, multipleFaces: false, time: '14:35', date: isoDaysAgo(0), location: 'Jodhpur Branch', status: 'pending', reviewedBy: null },
  { id: 'ss-002', employeeId: 'EMP002', reason: 'multipleFaces', confidence: 0.62, multipleFaces: true, time: '09:22', date: isoDaysAgo(0), location: 'Jaipur HQ', status: 'pending', reviewedBy: null },
  { id: 'ss-003', employeeId: 'EMP009', reason: 'outsideRadius', confidence: 0.88, multipleFaces: false, time: '22:00', date: isoDaysAgo(1), location: 'Udaipur Office', status: 'reviewed', reviewedBy: 'EMP012' },
  { id: 'ss-004', employeeId: null, reason: 'faceNotMatched', confidence: 0.33, multipleFaces: false, time: '17:48', date: isoDaysAgo(2), location: 'Jaipur HQ', status: 'pending', reviewedBy: null },
  { id: 'ss-005', employeeId: 'EMP001', reason: 'repeatedFailedAttempts', confidence: 0.49, multipleFaces: false, time: '14:12', date: isoDaysAgo(3), location: 'Jodhpur Branch', status: 'ignored', reviewedBy: 'EMP012' },
];

/* ---------- audit logs ---------- */
export const AUDIT_LOGS = [
  { id: 'au-001', actor: 'Pooja Sharma', role: 'hr', action: 'attendanceEdited', target: 'EMP009 · ' + isoDaysAgo(6), description: 'Corrected check-in time after approval.', time: isoDaysAgo(6) },
  { id: 'au-002', actor: 'Pooja Sharma', role: 'hr', action: 'faceApproved', target: 'EMP009', description: 'Approved face registration.', time: isoDaysAgo(12) },
  { id: 'au-003', actor: 'Arjun Sharma', role: 'superAdmin', action: 'branchUpdated', target: 'BR003', description: 'Updated allowed radius to 150m.', time: isoDaysAgo(15) },
  { id: 'au-004', actor: 'Pooja Sharma', role: 'hr', action: 'employeeCreated', target: 'EMP014', description: 'Onboarded new support agent.', time: isoDaysAgo(18) },
  { id: 'au-005', actor: 'Pooja Sharma', role: 'hr', action: 'correctionRejected', target: 'cr-004', description: 'Rejected location correction request.', time: isoDaysAgo(8) },
];

/* ---------- notifications ---------- */
export const NOTIFICATIONS = [
  { id: 'nt-001', type: 'warning', title: 'Late check-in', text: 'Rohit Kumar checked in late (09:22).', time: '09:23', read: false },
  { id: 'nt-002', type: 'danger', title: 'Suspicious scan', text: 'Low-confidence scan flagged at Jodhpur Branch.', time: '10:10', read: false },
  { id: 'nt-003', type: 'info', title: 'Face approval', text: 'Nisha Gupta face registration pending approval.', time: '11:02', read: false },
  { id: 'nt-004', type: 'success', title: 'Overtime approved', text: 'Overtime approved for Neeraj Verma (1.5h).', time: '18:45', read: true },
  { id: 'nt-005', type: 'info', title: 'Correction request', text: 'New correction request from Vivek Sharma.', time: '08:40', read: false },
];
