// FaceTrack AI — Mock auth service (frontend-only mode).
//
// No Firebase, no API, no .env. Validates against demo users (data/users.js)
// plus any locally-registered users, and keeps the session in localStorage.
// Passwords are never written into the session object.

import { MOCK_USERS } from '../data/users';

const SESSION_KEY = 'ft_session_user';
const REGISTERED_KEY = 'ft_registered_users';

function readRegistered() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_KEY)) || [];
  } catch {
    return [];
  }
}

function writeRegistered(list) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(list));
}

function allUsers() {
  return [...MOCK_USERS, ...readRegistered()];
}

function persistSession(user) {
  const safe = { ...user };
  delete safe.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  return safe;
}

// Restore the current session (or null). For demo accounts, reconcile the
// stored display name/avatar with the current MOCK_USERS so renamed demo people
// show up without requiring a re-login. This is display-only — it never changes
// the email/role/auth, so the mock login session stays valid.
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const demo = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === String(session.email).toLowerCase()
    );
    if (demo && demo.name !== session.name) {
      const refreshed = { ...session, name: demo.name, avatarColor: demo.avatarColor ?? session.avatarColor };
      localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
      return refreshed;
    }
    return session;
  } catch {
    return null;
  }
}

// Mock email/password login.
export async function login({ email, password }) {
  const found = allUsers().find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!found || found.password !== password) {
    const err = new Error('Invalid email or password.');
    err.code = 'auth/invalid-credential';
    throw err;
  }
  return persistSession(found);
}

// Mock registration — stores the new user locally.
export async function register({ name, email, password, role }) {
  const exists = allUsers().some(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (exists) {
    const err = new Error('An account with this email already exists.');
    err.code = 'auth/email-already-in-use';
    throw err;
  }
  const user = { uid: `reg-${Date.now()}`, name, email, password, role };
  const registered = readRegistered();
  registered.push(user);
  writeRegistered(registered);
  return persistSession(user);
}

// One-click demo login as a given role (uses the matching demo user).
export function loginAsRole(role) {
  const demo =
    MOCK_USERS.find((u) => u.role === role) || {
      uid: `dev-${role}`,
      name: `Test ${role}`,
      email: `${role}@demo.com`,
      role,
    };
  return persistSession(demo);
}

// Clear the session.
export async function logout() {
  localStorage.removeItem(SESSION_KEY);
}
