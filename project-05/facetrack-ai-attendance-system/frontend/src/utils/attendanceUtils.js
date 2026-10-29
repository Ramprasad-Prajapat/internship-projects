// FaceTrack AI — Attendance calculation helpers (frontend-only mode).
// Pure functions for late/overtime classification, working hours, and the
// (mock) branch-radius distance check used by the employee Mark-Attendance flow.

export function parseHHMM(t) {
  if (!t) return null;
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + m;
}

export function minutesToHHMM(mins) {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

// Classify a check-in against its shift: present | late, with lateMinutes.
export function classifyCheckIn(checkInHHMM, shift) {
  const ci = parseHHMM(checkInHHMM);
  if (ci == null || !shift) return { status: 'absent', lateMinutes: 0 };
  const start = parseHHMM(shift.start);
  const grace = shift.graceMinutes ?? 0;
  const lateMinutes = Math.max(0, ci - (start + grace));
  return { status: lateMinutes > 0 ? 'late' : 'present', lateMinutes };
}

// Overtime minutes past shift end (handles a shift ending after midnight).
export function computeOvertimeMinutes(checkOutHHMM, shift) {
  const co = parseHHMM(checkOutHHMM);
  const end = parseHHMM(shift?.end);
  if (co == null || end == null) return 0;
  let diff = co - end;
  if (diff < -720) diff += 1440;
  return Math.max(0, diff);
}

export function computeTotalHours(checkInHHMM, checkOutHHMM) {
  const ci = parseHHMM(checkInHHMM);
  const co = parseHHMM(checkOutHHMM);
  if (ci == null || co == null) return 0;
  let diff = co - ci;
  if (diff < 0) diff += 1440;
  return Math.round((diff / 60) * 10) / 10;
}

// Great-circle distance in metres (haversine). a/b are {lat, lng}.
export function haversineMeters(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// Inside the branch's allowed radius?
export function checkRadius(coords, branch) {
  if (!coords || !branch) return { inside: false, distance: Infinity };
  const distance = haversineMeters(coords, { lat: branch.lat, lng: branch.lng });
  return { inside: distance <= branch.radiusMeters, distance };
}
