// FaceTrack AI — Mock data barrel (frontend-only mode).
// Central re-export of all static demo datasets + seed generators. No backend.

export { MOCK_USERS, DEMO_PASSWORD } from './users';
export { ROLE_META, getRoleMeta } from './mockRoles';
export { MOCK_USER_PROFILES, getUserProfile } from './mockUsers';
export { MOCK_DASHBOARD_DATA, getDashboardData } from './mockDashboardData';
export { MOCK_ACTIVITIES, getActivities } from './mockActivities';
export { BRANCHES } from './branches';
export { DEPARTMENTS } from './departments';
export { SHIFTS } from './shifts';
export { EMPLOYEES } from './employees';
export { SETTINGS } from './settings';
export { FACE_SCANS } from './faceScans';
export {
  generateAttendance,
  CORRECTION_REQUESTS,
  LEAVE_REQUESTS,
  FACE_REGISTRATIONS,
  SUSPICIOUS_SCANS,
  AUDIT_LOGS,
  NOTIFICATIONS,
} from './seed';
