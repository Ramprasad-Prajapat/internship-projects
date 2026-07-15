// FaceTrack AI — Mock face scan samples (frontend-only mode).
// Kept for backward-compat; live suspicious-scan data now lives in data/seed.js
// (SUSPICIOUS_SCANS) and is served via the store.
// reason: low-confidence | multiple-faces | outside-radius | ok

export const FACE_SCANS = [
  { id: 'fs-001', employeeId: 'EMP005', confidence: 0.94, reason: 'ok', suspicious: false, time: '14:05' },
  { id: 'fs-002', employeeId: 'EMP006', confidence: 0.41, reason: 'low-confidence', suspicious: true, time: '14:35' },
  { id: 'fs-003', employeeId: 'EMP002', confidence: 0.62, reason: 'multiple-faces', suspicious: true, time: '09:22' },
  { id: 'fs-004', employeeId: 'EMP009', confidence: 0.88, reason: 'outside-radius', suspicious: true, time: '22:00' },
];
