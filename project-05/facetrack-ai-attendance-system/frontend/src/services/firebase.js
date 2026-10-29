// FaceTrack AI — Firebase client initialization.
//
// ⚠️ PAUSED (frontend-only mode): this file is NOT imported at runtime. The app
// uses mock auth/data instead (services/mockAuthService.js, mockDataService.js).
// Kept as a placeholder for future backend integration. Do not wire this in
// until backend/database work is re-enabled.
//
// Initializes the Firebase Web SDK from environment variables and exports the
// auth / Firestore / storage handles used across services. Real credentials
// belong in `frontend/.env` (see `.env.example`).
//
// If the env vars are missing, we skip initialization so the app still loads
// (public pages render) instead of crashing with `auth/invalid-api-key`.
// Auth actions then report a friendly "Firebase not configured" error.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[FaceTrack AI] Firebase env not set — auth is disabled. ' +
      'Copy frontend/.env.example to frontend/.env and fill in your credentials.'
  );
}

export { auth, db, storage };
export default app;
