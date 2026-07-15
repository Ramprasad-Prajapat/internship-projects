// FaceTrack AI — Legacy static attendance sample (frontend-only mode).
// NOTE: NOT used at runtime — the store seeds attendance via data/seed.js
// (generateAttendance). Kept only as a simple reference sample; IDs are aligned
// with the standardized EMP… ids for consistency.
// status: present | late | absent. overtimeHours = hours beyond shift end.

export const ATTENDANCE = [
  { id: 'att-001', employeeId: 'EMP001', date: '2026-06-19', checkIn: '08:58', checkOut: '17:05', status: 'present', overtimeHours: 0 },
  { id: 'att-002', employeeId: 'EMP002', date: '2026-06-19', checkIn: '09:22', checkOut: '17:40', status: 'late', overtimeHours: 0 },
  { id: 'att-003', employeeId: 'EMP003', date: '2026-06-19', checkIn: null, checkOut: null, status: 'absent', overtimeHours: 0 },
  { id: 'att-004', employeeId: 'EMP004', date: '2026-06-19', checkIn: '08:45', checkOut: '18:30', status: 'present', overtimeHours: 1.5 },
  { id: 'att-005', employeeId: 'EMP005', date: '2026-06-19', checkIn: '14:05', checkOut: '22:10', status: 'present', overtimeHours: 0 },
  { id: 'att-006', employeeId: 'EMP006', date: '2026-06-19', checkIn: '14:35', checkOut: '23:15', status: 'late', overtimeHours: 1.25 },
  { id: 'att-007', employeeId: 'EMP008', date: '2026-06-19', checkIn: '22:02', checkOut: '06:10', status: 'present', overtimeHours: 0 },
  { id: 'att-008', employeeId: 'EMP009', date: '2026-06-19', checkIn: null, checkOut: null, status: 'absent', overtimeHours: 0 },
  { id: 'att-009', employeeId: 'EMP010', date: '2026-06-19', checkIn: '09:03', checkOut: '17:00', status: 'present', overtimeHours: 0 },
];
