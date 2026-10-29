// FaceTrack AI — Legacy static notifications sample (frontend-only mode).
// NOTE: NOT used at runtime — live notifications are seeded via data/seed.js
// (NOTIFICATIONS) and served through the store. Kept only as a reference sample.
// type: info | success | warning | danger

export const NOTIFICATIONS = [
  { id: 'nt-001', type: 'warning', text: 'Rohit Kumar checked in late (09:22).', time: '09:23' },
  { id: 'nt-002', type: 'danger', text: 'Suspicious scan flagged at Jodhpur Branch.', time: '10:10' },
  { id: 'nt-003', type: 'info', text: 'Nisha Gupta face registration pending approval.', time: '11:02' },
  { id: 'nt-004', type: 'success', text: 'Overtime approved for Neeraj Verma (1.5h).', time: '18:45' },
];
