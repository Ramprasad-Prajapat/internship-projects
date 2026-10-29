// FaceTrack AI — Mock demo accounts (frontend-only mode).
// No real auth. These power the mock login. All demo accounts share one
// password for convenience. `employeeId` links a login to an employee record
// (used by the employee self-service pages); null for org-wide roles. branchId
// is scoped to a populated Rajasthan branch so role-based filtering has data.

export const DEMO_PASSWORD = 'demo123';

export const MOCK_USERS = [
  { uid: 'u-super', name: 'Arjun Sharma', email: 'superadmin@demo.com', password: DEMO_PASSWORD, role: 'superAdmin', branchId: null, employeeId: null, avatarColor: '#00d4ff' },
  { uid: 'u-branch', name: 'Vikas Jain', email: 'branchadmin@demo.com', password: DEMO_PASSWORD, role: 'branchAdmin', branchId: 'BR002', employeeId: 'EMP006', avatarColor: '#14b8a6' },
  { uid: 'u-hr', name: 'Pooja Sharma', email: 'hr@demo.com', password: DEMO_PASSWORD, role: 'hr', branchId: 'BR006', employeeId: 'EMP012', avatarColor: '#eab308' },
  { uid: 'u-manager', name: 'Neeraj Verma', email: 'manager@demo.com', password: DEMO_PASSWORD, role: 'manager', branchId: 'BR001', employeeId: 'EMP004', avatarColor: '#f59e0b' },
  { uid: 'u-employee', name: 'Anjali Sharma', email: 'employee@demo.com', password: DEMO_PASSWORD, role: 'employee', branchId: 'BR001', employeeId: 'EMP005', avatarColor: '#00d4ff' },
];
