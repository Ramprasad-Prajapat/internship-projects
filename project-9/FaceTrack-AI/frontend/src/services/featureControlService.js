// FaceTrack AI — Feature Control service (frontend-only mode).
//
// A reactive, localStorage-backed feature-flag store that powers the Super Admin
// "Website Feature Control Center". A fixed CATALOG describes every controllable
// website feature/module; per-feature OVERRIDES (status / visibility / allowed
// roles) are persisted under one localStorage key and merged over the catalog.
// Components read it reactively via hooks/useFeatures.js. Every change writes a
// mock audit-log entry through services/mockStore. No backend / Firebase / API —
// swap the persistence for a real settings API later (same function shapes).
//
// Enforcement: route-segment features (key === route segment) are enforced by
// <FeatureGate/> (route) + the Sidebar (nav). Other catalog entries are mock
// toggles (persist + audit + summary) shown in the control center.

import * as store from './mockStore';

const KEY = 'ft_feature_flags_v1';

// Roles used for access badges (+ a 'public' pseudo-role for public pages).
export const ALL_ROLES = ['superAdmin', 'branchAdmin', 'hr', 'manager', 'employee'];

// route: this key equals a real route segment and is enforced in routing + nav.
// mock: catalog-only toggle (persists + audits + counts) with no deep wiring.
const f = (key, name, module, allowedRoles, opts = {}) => ({
  key,
  name,
  module,
  allowedRoles,
  route: !!opts.route,
  isProtected: !!opts.isProtected,
});

export const FEATURE_CATALOG = [
  // ---- Public website ----
  f('public-landing', 'Landing Page Sections', 'Public', ['public']),
  f('public-navbar', 'Public Navbar Links', 'Public', ['public']),
  f('public-demo-access', 'Login Demo Access Dropdown', 'Public', ['public']),
  f('public-privacy', 'Privacy Page', 'Public', ['public']),
  f('public-consent', 'Consent Page', 'Public', ['public']),

  // ---- Employee ----
  f('mark-attendance', 'Face Check-In', 'Employee', ['employee'], { route: true }),
  f('my-attendance', 'My Attendance', 'Employee', ['employee'], { route: true }),
  f('leave', 'Leave', 'Employee', ['employee'], { route: true }),
  f('corrections', 'Corrections', 'Employee', ['employee'], { route: true }),
  f('employee-profile-cards', 'Employee Profile Cards', 'Employee', ['employee']),
  f('employee-quick-actions', 'Employee Quick Actions', 'Employee', ['employee']),

  // ---- Manager ----
  f('team-members', 'Team Members', 'Manager', ['manager'], { route: true }),
  f('manager-activity-timeline', 'Team Activity Timeline', 'Manager', ['manager']),
  f('manager-approval-actions', 'Approval Actions', 'Manager', ['manager']),

  // ---- HR ----
  f('face-approvals', 'Face Approval', 'HR', ['hr'], { route: true }),
  f('live-monitor', 'Live Monitor', 'HR', ['hr'], { route: true }),
  f('hr-department-summary', 'HR Department Summary', 'HR', ['hr']),

  // ---- Branch Admin ----
  f('branch-radius-card', 'Branch Radius / Location Card', 'Branch Admin', ['branchAdmin']),

  // ---- Shared (multi-role route features) ----
  f('attendance', 'Attendance Records', 'Shared', ['superAdmin', 'branchAdmin', 'hr', 'manager'], { route: true }),
  f('reports', 'Reports', 'Shared', ['superAdmin', 'branchAdmin', 'hr', 'manager'], { route: true }),
  f('leave-requests', 'Leave Requests / Approvals', 'Shared', ['hr', 'manager'], { route: true }),
  f('correction-requests', 'Correction Requests', 'Shared', ['hr'], { route: true }),
  f('employees', 'Employees', 'Shared', ['superAdmin', 'branchAdmin', 'hr'], { route: true }),
  f('departments', 'Departments', 'Shared', ['superAdmin', 'branchAdmin', 'hr'], { route: true }),
  f('shifts', 'Shifts', 'Shared', ['superAdmin', 'branchAdmin', 'hr'], { route: true }),
  f('suspicious-scans', 'Suspicious Scans', 'Shared', ['superAdmin', 'hr'], { route: true }),
  f('profile', 'Profile (all roles)', 'Shared', ['superAdmin', 'branchAdmin', 'hr', 'manager', 'employee'], { route: true }),

  // ---- Super Admin ----
  f('branches', 'Branches', 'Super Admin', ['superAdmin'], { route: true }),
  f('hr-management', 'HR Management', 'Super Admin', ['superAdmin'], { route: true }),
  f('audit-logs', 'Audit Logs', 'Super Admin', ['superAdmin'], { route: true }),
  f('sa-data-quality', 'Data Quality Checker', 'Super Admin', ['superAdmin']),
  f('sa-branch-performance', 'Branch Performance', 'Super Admin', ['superAdmin']),
  f('sa-role-access', 'Role Access Control', 'Super Admin', ['superAdmin']),
  f('settings', 'System Settings', 'Super Admin', ['superAdmin', 'branchAdmin', 'hr'], { route: true, isProtected: true }),
  f('feature-control', 'Feature Control Center', 'Super Admin', ['superAdmin'], { route: true, isProtected: true }),

  // ---- Dashboards ----
  f('employee-dashboard', 'Employee Dashboard', 'Dashboards', ['employee']),
  f('manager-dashboard', 'Manager Dashboard', 'Dashboards', ['manager']),
  f('hr-dashboard', 'HR Dashboard', 'Dashboards', ['hr']),
  f('branch-dashboard', 'Branch Admin Dashboard', 'Dashboards', ['branchAdmin']),
  f('super-admin-dashboard', 'Super Admin Dashboard', 'Dashboards', ['superAdmin'], { isProtected: true }),

  // ---- System (protected) ----
  f('login', 'Login', 'System', ['public'], { isProtected: true }),
  f('logout', 'Logout', 'System', ['public'], { isProtected: true }),
];

/* ---------- reactive state ---------- */
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let overrides = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}
function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getOverrides() {
  return overrides;
}

/* ---------- merge + reads ---------- */
export function mergeFeature(cat, o) {
  return {
    ...cat,
    status: o?.status ?? 'enabled',
    visibility: o?.visibility ?? 'shown',
    allowedRoles: o?.allowedRoles ?? cat.allowedRoles,
    lastUpdated: o?.lastUpdated ?? null,
    updatedBy: o?.updatedBy ?? null,
  };
}
export function getFeatures() {
  return FEATURE_CATALOG.map((cat) => mergeFeature(cat, overrides[cat.key]));
}
export function getFeature(key) {
  const cat = FEATURE_CATALOG.find((x) => x.key === key);
  return cat ? mergeFeature(cat, overrides[key]) : null;
}

/* ---------- enforcement helpers (key === route segment) ---------- */
export function isFeatureEnabledForRole(features, seg, role) {
  const feat = features.find((x) => x.key === seg);
  if (!feat) return true; // uncontrolled segment → always allowed
  if (feat.isProtected) return true; // protected → never blocked
  return feat.status === 'enabled' && feat.allowedRoles.includes(role);
}
export function isNavVisible(features, seg, role) {
  const feat = features.find((x) => x.key === seg);
  if (!feat) return true;
  if (feat.isProtected) return true;
  return feat.status === 'enabled' && feat.visibility === 'shown' && feat.allowedRoles.includes(role);
}
export function featureBySeg(features, seg) {
  return features.find((x) => x.key === seg) || null;
}

/* ---------- summary ---------- */
export function summary(features) {
  const total = features.length;
  const enabled = features.filter((x) => x.status === 'enabled').length;
  const protectedCount = features.filter((x) => x.isProtected).length;
  const lastUpdated = features.map((x) => x.lastUpdated).filter(Boolean).sort().slice(-1)[0] || null;
  return { total, enabled, disabled: total - enabled, protected: protectedCount, lastUpdated };
}

/* ---------- writes (persist + audit) ---------- */
function writeAudit(actor, key, description) {
  store.addAudit({
    actor: actor?.name || 'Super Admin',
    role: actor?.role || 'superAdmin',
    action: 'featureControl',
    target: key,
    description,
  });
}

function apply(key, patch, actor, description) {
  const cat = FEATURE_CATALOG.find((x) => x.key === key);
  if (!cat) return { ok: false };
  overrides = {
    ...overrides,
    [key]: { ...(overrides[key] || {}), ...patch, lastUpdated: new Date().toISOString(), updatedBy: actor?.name || 'Super Admin' },
  };
  emit();
  writeAudit(actor, key, description);
  return { ok: true };
}

export function setStatus(key, status, actor) {
  const feat = getFeature(key);
  if (!feat) return { ok: false };
  if (feat.isProtected && status === 'disabled') return { ok: false, protectedBlocked: true };
  return apply(key, { status }, actor, `${actor?.name || 'Super Admin'} ${status === 'disabled' ? 'disabled' : 'enabled'} ${feat.name}`);
}

export function setVisibility(key, visibility, actor) {
  const feat = getFeature(key);
  if (!feat) return { ok: false };
  if (feat.isProtected && visibility === 'hidden') return { ok: false, protectedBlocked: true };
  return apply(key, { visibility }, actor, `${actor?.name || 'Super Admin'} set ${feat.name} to ${visibility === 'hidden' ? 'hidden' : 'visible'}`);
}

export function setAllowedRoles(key, roles, actor) {
  const feat = getFeature(key);
  if (!feat) return { ok: false };
  if (feat.isProtected) return { ok: false, protectedBlocked: true };
  // A feature must stay accessible to at least one role — saving an empty list
  // would silently hide the feature from everyone with no way back from the UI.
  if (!Array.isArray(roles) || roles.length === 0) return { ok: false, emptyRoles: true };
  return apply(key, { allowedRoles: roles }, actor, `${actor?.name || 'Super Admin'} updated role access for ${feat.name}`);
}

export function resetFeature(key, actor) {
  const cat = FEATURE_CATALOG.find((x) => x.key === key);
  if (!cat) return { ok: false };
  const next = { ...overrides };
  delete next[key];
  overrides = next;
  emit();
  writeAudit(actor, key, `${actor?.name || 'Super Admin'} reset ${cat.name} to default`);
  return { ok: true };
}

export function resetAll(actor) {
  overrides = {};
  emit();
  writeAudit(actor, 'all', `${actor?.name || 'Super Admin'} reset all feature controls to default`);
  return { ok: true };
}
