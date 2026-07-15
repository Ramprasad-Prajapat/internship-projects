// FaceTrack AI — Mock dashboard stats per role (frontend-only mode).
// Static demo numbers shown on the logged-in /home page snapshot. The live role
// dashboards still derive their own numbers from the reactive store; these are a
// lightweight, role-aware "at a glance" set for the home screen.
// `tone` maps to a MetricCard/badge tone. No backend.

export const MOCK_DASHBOARD_DATA = {
  superAdmin: [
    { key: 'totalEmployees', label: 'Total Employees', value: 248, tone: 'primary', icon: 'employees' },
    { key: 'presentToday', label: 'Present Today', value: 214, tone: 'success', icon: 'present' },
    { key: 'lateCheckins', label: 'Late Check-ins', value: 12, tone: 'warning', icon: 'late' },
    { key: 'pendingCorrections', label: 'Pending Corrections', value: 7, tone: 'accent', icon: 'corrections' },
    { key: 'branchAttendance', label: 'Branch Attendance', value: '92%', tone: 'primary', icon: 'branch' },
  ],
  branchAdmin: [
    { key: 'totalEmployees', label: 'Branch Employees', value: 64, tone: 'primary', icon: 'employees' },
    { key: 'presentToday', label: 'Present Today', value: 58, tone: 'success', icon: 'present' },
    { key: 'lateCheckins', label: 'Late Check-ins', value: 4, tone: 'warning', icon: 'late' },
    { key: 'pendingCorrections', label: 'Pending Corrections', value: 2, tone: 'accent', icon: 'corrections' },
    { key: 'branchAttendance', label: 'Branch Attendance', value: '94%', tone: 'primary', icon: 'branch' },
  ],
  hr: [
    { key: 'totalEmployees', label: 'Total Employees', value: 248, tone: 'primary', icon: 'employees' },
    { key: 'presentToday', label: 'Present Today', value: 214, tone: 'success', icon: 'present' },
    { key: 'lateCheckins', label: 'Late Check-ins', value: 12, tone: 'warning', icon: 'late' },
    { key: 'leaveRequests', label: 'Leave Requests', value: 9, tone: 'accent', icon: 'leave' },
    { key: 'pendingCorrections', label: 'Pending Corrections', value: 7, tone: 'danger', icon: 'corrections' },
  ],
  manager: [
    { key: 'teamSize', label: 'Team Size', value: 8, tone: 'primary', icon: 'team' },
    { key: 'presentToday', label: 'Present Today', value: 7, tone: 'success', icon: 'present' },
    { key: 'lateCheckins', label: 'Late Check-ins', value: 1, tone: 'warning', icon: 'late' },
    { key: 'approvals', label: 'Pending Approvals', value: 3, tone: 'accent', icon: 'approvals' },
    { key: 'teamAttendance', label: 'Team Attendance', value: '96%', tone: 'primary', icon: 'branch' },
  ],
  employee: [
    { key: 'statusToday', label: 'Status Today', value: 'Present', tone: 'success', icon: 'present' },
    { key: 'presentMonth', label: 'Present (Month)', value: 18, tone: 'primary', icon: 'attendance' },
    { key: 'lateMonth', label: 'Late (Month)', value: 2, tone: 'warning', icon: 'late' },
    { key: 'overtime', label: 'Overtime (hrs)', value: 6, tone: 'accent', icon: 'overtime' },
    { key: 'pendingRequests', label: 'Pending Requests', value: 1, tone: 'danger', icon: 'corrections' },
  ],
};

export function getDashboardData(role) {
  return MOCK_DASHBOARD_DATA[role] || MOCK_DASHBOARD_DATA.employee;
}
