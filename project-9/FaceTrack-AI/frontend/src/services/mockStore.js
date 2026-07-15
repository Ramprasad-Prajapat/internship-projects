// FaceTrack AI — Mock store (frontend-only mode).
//
// A tiny reactive, localStorage-backed data store that stands in for Firestore.
// Seeds itself from src/data on first load, exposes CRUD + subscribe, and
// persists every mutation. Components read it reactively via hooks/useStore.js.
// No backend, no network — swap these for real Firebase services later.

import {
  BRANCHES,
  DEPARTMENTS,
  SHIFTS,
  EMPLOYEES,
  SETTINGS,
  generateAttendance,
  CORRECTION_REQUESTS,
  LEAVE_REQUESTS,
  FACE_REGISTRATIONS,
  SUSPICIOUS_SCANS,
  AUDIT_LOGS,
  NOTIFICATIONS,
} from '../data';

// Bumped to v3 when the data graph moved to the Rajasthan branch network +
// standardized IDs (BR001/EMP001/…). Bumped to v5 when demo people were renamed
// to simple readable Indian names. Bumping invalidates any cached store so
// returning browsers re-seed instead of serving the old names/branches.
const KEY = 'ft_store_v5';
const SEED_VERSION = 5;

function buildSeed() {
  return {
    version: SEED_VERSION,
    branches: BRANCHES,
    departments: DEPARTMENTS,
    shifts: SHIFTS,
    employees: EMPLOYEES,
    attendance: generateAttendance(),
    correctionRequests: CORRECTION_REQUESTS,
    leaveRequests: LEAVE_REQUESTS,
    faceRegistrations: FACE_REGISTRATIONS,
    suspiciousScans: SUSPICIOUS_SCANS,
    auditLogs: AUDIT_LOGS,
    notifications: NOTIFICATIONS,
    settings: SETTINGS,
  };
}

function persist(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === SEED_VERSION) return parsed;
    }
  } catch {
    /* fall through to fresh seed */
  }
  const seed = buildSeed();
  persist(seed);
  return seed;
}

let state = load();
const listeners = new Set();

function emit() {
  persist(state);
  listeners.forEach((l) => l());
}

/* ---------- subscription (for useSyncExternalStore) ---------- */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getState() {
  return state;
}

/* ---------- reads ---------- */
export function getAll(key) {
  return state[key] || [];
}
export function getById(key, id) {
  return (state[key] || []).find((x) => x.id === id) || null;
}

/* ---------- writes (each replaces only the touched slice) ---------- */
export function insert(key, item) {
  state = { ...state, [key]: [item, ...(state[key] || [])] };
  emit();
  return item;
}
export function update(key, id, patch) {
  state = {
    ...state,
    [key]: (state[key] || []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
  };
  emit();
  return getById(key, id);
}
export function remove(key, id) {
  state = { ...state, [key]: (state[key] || []).filter((x) => x.id !== id) };
  emit();
}
export function replaceAll(key, items) {
  state = { ...state, [key]: items };
  emit();
}
export function patchSettings(patch) {
  state = { ...state, settings: { ...state.settings, ...patch } };
  emit();
}
export function resetStore() {
  state = buildSeed();
  emit();
}

/* ---------- helpers ---------- */
export function genId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// Append an audit-log entry (used by HR/admin mutating actions).
export function addAudit({ actor, role, action, target, description }) {
  insert('auditLogs', {
    id: genId('au'),
    actor,
    role,
    action,
    target,
    description,
    time: new Date().toISOString().slice(0, 10),
  });
}
