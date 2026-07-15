// FaceTrack AI — Mock face-scan simulation (frontend-only mode).
// Stands in for real face matching (no biometric data is ever stored). Returns
// a plausible confidence score + outcome so the UI flows can be demonstrated.

// outcome: 'matched' | 'lowConfidence' | 'multipleFaces'
export function mockScan() {
  const r = Math.random();
  if (r < 0.1) {
    return { confidence: Math.round((0.4 + Math.random() * 0.22) * 100) / 100, ok: false, reason: 'lowConfidence', multipleFaces: false };
  }
  if (r < 0.16) {
    return { confidence: Math.round((0.55 + Math.random() * 0.2) * 100) / 100, ok: false, reason: 'multipleFaces', multipleFaces: true };
  }
  return { confidence: Math.round((0.85 + Math.random() * 0.14) * 100) / 100, ok: true, reason: 'matched', multipleFaces: false };
}

// A registration capture is more forgiving (user is cooperating).
export function mockRegistrationCapture() {
  return { confidence: Math.round((0.86 + Math.random() * 0.13) * 100) / 100, ok: true };
}
