// FaceTrack AI — Mock departments (frontend-only mode).
// One focal department per Rajasthan branch so every branch has staff. managerId
// points to the lead employee of that department (see employees.js).

export const DEPARTMENTS = [
  { id: 'DPT001', name: 'Engineering', branchId: 'BR001', managerId: 'EMP004', status: 'active' },
  { id: 'DPT002', name: 'Sales', branchId: 'BR002', managerId: 'EMP006', status: 'active' },
  { id: 'DPT003', name: 'Operations', branchId: 'BR003', managerId: 'EMP008', status: 'active' },
  { id: 'DPT004', name: 'Support', branchId: 'BR004', managerId: 'EMP010', status: 'active' },
  { id: 'DPT005', name: 'Security', branchId: 'BR005', managerId: 'EMP011', status: 'active' },
  { id: 'DPT006', name: 'Human Resources', branchId: 'BR006', managerId: 'EMP012', status: 'active' },
];
