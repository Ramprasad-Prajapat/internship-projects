// FaceTrack AI — Auth service (real Firebase).
//
// ⚠️ PAUSED (frontend-only mode): NOT imported at runtime. Replaced by
// services/mockAuthService.js. Kept as a placeholder for future backend work.
//
// Wraps Firebase Authentication (email/password) and the `users` collection
// that stores each account's role. Role is required so the app can redirect
// users to the correct dashboard after login.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const USERS = 'users';

// Guard: surface a friendly, mappable error when Firebase env is missing.
function ensureConfigured() {
  if (!auth || !db) {
    const err = new Error('Firebase is not configured. Add frontend/.env.');
    err.code = 'auth/invalid-api-key';
    throw err;
  }
}

// Register a new account and persist its profile (with role) to Firestore.
export async function registerUser({ name, email, password, role }) {
  ensureConfigured();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile = {
    uid: cred.user.uid,
    name,
    email,
    role,
    active: true,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, USERS, cred.user.uid), profile);
  return cred.user;
}

// Sign in with email/password.
export async function loginUser({ email, password }) {
  ensureConfigured();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Sign out the current user.
export function logoutUser() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

// Fetch a user's Firestore profile document (contains role).
export async function fetchUserProfile(uid) {
  if (!db) return null;
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? snap.data() : null;
}
