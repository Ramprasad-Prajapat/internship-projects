// FaceTrack AI — Mock user profiles (frontend-only mode).
// Re-exports the demo login accounts (single source of truth in users.js) and
// adds per-role display profile extras used to enrich the logged-in /home card.
// No backend / no real auth.

export { MOCK_USERS, DEMO_PASSWORD } from './users';

// Extra display info layered on top of the logged-in session user, keyed by role.
export const MOCK_USER_PROFILES = {
  superAdmin: { jobTitle: 'Platform Administrator', scope: 'All Rajasthan branches', location: 'HQ · Jaipur' },
  branchAdmin: { jobTitle: 'Branch Administrator', scope: 'Jodhpur branch', location: 'Jodhpur' },
  hr: { jobTitle: 'HR Manager', scope: 'Org-wide HR', location: 'Ajmer' },
  manager: { jobTitle: 'Engineering Manager', scope: 'Engineering team', location: 'Jaipur' },
  employee: { jobTitle: 'Software Engineer', scope: 'Engineering', location: 'Jaipur' },
};

export function getUserProfile(role) {
  return MOCK_USER_PROFILES[role] || null;
}
