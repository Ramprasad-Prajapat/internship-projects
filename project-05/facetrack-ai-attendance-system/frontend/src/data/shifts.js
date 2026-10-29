// FaceTrack AI — Mock shifts (frontend-only mode).
// graceMinutes = allowed late window before a check-in is marked "late".
// overtimeAfterMinutes = minutes past shift end before overtime needs approval.

export const SHIFTS = [
  { id: 'SH001', name: 'Morning', start: '09:00', end: '17:00', graceMinutes: 10, overtimeAfterMinutes: 60, status: 'active' },
  { id: 'SH002', name: 'Evening', start: '14:00', end: '22:00', graceMinutes: 10, overtimeAfterMinutes: 60, status: 'active' },
  { id: 'SH003', name: 'Night', start: '22:00', end: '06:00', graceMinutes: 15, overtimeAfterMinutes: 60, status: 'active' },
];
