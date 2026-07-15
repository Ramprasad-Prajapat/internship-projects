// FaceTrack AI — Mock employees (frontend-only mode).
// Standardized IDs (EMP001…) spread across all six Rajasthan branches so no
// branch is empty. faceStatus: registered | pending | none. status: active |
// inactive. managerId references another employee id (or null for a lead).
// Display names are simple, readable Indian names (demo data only).

export const EMPLOYEES = [
  { id: 'EMP001', employeeCode: 'JOD-0001', name: 'Priya Sharma', email: 'zara@demo.com', phone: '+91 98300 11005', designation: 'Sales Executive', branchId: 'BR002', departmentId: 'DPT002', shiftId: 'SH002', managerId: 'EMP006', status: 'active', faceStatus: 'registered', joiningDate: '2023-03-30', avatarColor: '#ec4899' },
  { id: 'EMP002', employeeCode: 'JAI-0002', name: 'Rohit Kumar', email: 'hassan@demo.com', phone: '+91 98300 11002', designation: 'Software Engineer', branchId: 'BR001', departmentId: 'DPT001', shiftId: 'SH001', managerId: 'EMP004', status: 'active', faceStatus: 'registered', joiningDate: '2023-06-01', avatarColor: '#8b5cf6' },
  { id: 'EMP003', employeeCode: 'AJM-0003', name: 'Nisha Gupta', email: 'fatima@demo.com', phone: '+91 98300 11003', designation: 'HR Executive', branchId: 'BR006', departmentId: 'DPT006', shiftId: 'SH001', managerId: 'EMP012', status: 'active', faceStatus: 'pending', joiningDate: '2024-01-09', avatarColor: '#22c55e' },
  { id: 'EMP004', employeeCode: 'JAI-0004', name: 'Neeraj Verma', email: 'imran@demo.com', phone: '+91 98300 11004', designation: 'Engineering Manager', branchId: 'BR001', departmentId: 'DPT001', shiftId: 'SH001', managerId: null, status: 'active', faceStatus: 'registered', joiningDate: '2021-09-20', avatarColor: '#f59e0b' },
  { id: 'EMP005', employeeCode: 'EMP005', name: 'Anjali Sharma', email: 'employee@demo.com', phone: '+91 98300 11001', designation: 'Software Engineer', branchId: 'BR001', departmentId: 'DPT001', shiftId: 'SH001', managerId: 'EMP004', status: 'active', faceStatus: 'registered', joiningDate: '2023-02-14', avatarColor: '#00d4ff' },
  { id: 'EMP006', employeeCode: 'JOD-0006', name: 'Vikas Jain', email: 'bilal@demo.com', phone: '+91 98300 11006', designation: 'Branch Sales Lead', branchId: 'BR002', departmentId: 'DPT002', shiftId: 'SH002', managerId: null, status: 'active', faceStatus: 'registered', joiningDate: '2021-11-02', avatarColor: '#14b8a6' },
  { id: 'EMP007', employeeCode: 'JOD-0007', name: 'Amit Verma', email: 'usman@demo.com', phone: '+91 98300 11007', designation: 'Sales Executive', branchId: 'BR002', departmentId: 'DPT002', shiftId: 'SH002', managerId: 'EMP006', status: 'inactive', faceStatus: 'none', joiningDate: '2022-07-18', avatarColor: '#64748b' },
  { id: 'EMP008', employeeCode: 'UDR-0008', name: 'Meera Joshi', email: 'sana@demo.com', phone: '+91 98300 11008', designation: 'Operations Lead', branchId: 'BR003', departmentId: 'DPT003', shiftId: 'SH003', managerId: null, status: 'active', faceStatus: 'registered', joiningDate: '2022-04-11', avatarColor: '#3b82f6' },
  { id: 'EMP009', employeeCode: 'UDR-0009', name: 'Karan Verma', email: 'ahmedr@demo.com', phone: '+91 98300 11009', designation: 'Operations Associate', branchId: 'BR003', departmentId: 'DPT003', shiftId: 'SH003', managerId: 'EMP008', status: 'active', faceStatus: 'registered', joiningDate: '2024-02-26', avatarColor: '#a855f7' },
  { id: 'EMP010', employeeCode: 'KOT-0010', name: 'Sneha Mehta', email: 'maria@demo.com', phone: '+91 98300 11010', designation: 'Support Lead', branchId: 'BR004', departmentId: 'DPT004', shiftId: 'SH001', managerId: null, status: 'active', faceStatus: 'none', joiningDate: '2024-05-13', avatarColor: '#ef4444' },
  { id: 'EMP011', employeeCode: 'BKN-0011', name: 'Vivek Sharma', email: 'bilalh@demo.com', phone: '+91 98300 11011', designation: 'Security Supervisor', branchId: 'BR005', departmentId: 'DPT005', shiftId: 'SH003', managerId: null, status: 'active', faceStatus: 'registered', joiningDate: '2023-10-05', avatarColor: '#06b6d4' },
  { id: 'EMP012', employeeCode: 'AJM-0012', name: 'Pooja Sharma', email: 'hr@demo.com', phone: '+91 98300 11012', designation: 'HR Manager', branchId: 'BR006', departmentId: 'DPT006', shiftId: 'SH001', managerId: null, status: 'active', faceStatus: 'registered', joiningDate: '2021-08-16', avatarColor: '#eab308' },
  { id: 'EMP013', employeeCode: 'JAI-0013', name: 'Kavya Singh', email: 'saraiq@demo.com', phone: '+91 98300 11013', designation: 'UI/UX Designer', branchId: 'BR001', departmentId: 'DPT001', shiftId: 'SH001', managerId: 'EMP004', status: 'active', faceStatus: 'registered', joiningDate: '2023-12-01', avatarColor: '#f472b6' },
  { id: 'EMP014', employeeCode: 'KOT-0014', name: 'Rahul Jain', email: 'ahsan@demo.com', phone: '+91 98300 11014', designation: 'Support Agent', branchId: 'BR004', departmentId: 'DPT004', shiftId: 'SH002', managerId: 'EMP010', status: 'active', faceStatus: 'pending', joiningDate: '2024-03-22', avatarColor: '#34d399' },
];

// Frontend-only fallback for the Employee Profile page. Used when a selected
// employee record cannot be resolved from the mock store (e.g. a hand-typed
// reusable-route URL like /hr/employees/UNKNOWN/profile), so the page renders
// clean mock data instead of crashing or showing the wrong account. Mirrors
// EMP005 (Anjali Sharma) and is self-contained — no store/backend dependency.
export const FALLBACK_EMPLOYEE = {
  id: 'EMP005',
  employeeCode: 'EMP005',
  name: 'Anjali Sharma',
  email: 'employee@demo.com',
  phone: '+91 98300 11001',
  designation: 'Software Engineer',
  branchId: 'BR001',
  departmentId: 'DPT001',
  shiftId: 'SH001',
  managerId: 'EMP004',
  status: 'active',
  faceStatus: 'registered',
  joiningDate: '2023-02-14',
  avatarColor: '#00d4ff',
};
