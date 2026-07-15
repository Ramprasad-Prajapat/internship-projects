// FaceTrack AI — Mock recent-activity feeds per role (frontend-only mode).
// Static demo timeline entries shown on the logged-in /home page.
// `tone` maps to an accent color in the consuming page. No backend.

export const MOCK_ACTIVITIES = {
  superAdmin: [
    { text: 'New branch “Ajmer Office” provisioned', time: '10m ago', tone: 'primary' },
    { text: 'HR approved 4 face registrations', time: '40m ago', tone: 'success' },
    { text: '3 suspicious scans flagged at Jodhpur branch', time: '1h ago', tone: 'danger' },
    { text: 'Monthly attendance report exported', time: '2h ago', tone: 'accent' },
    { text: 'Settings updated: late grace period → 10 min', time: 'Yesterday', tone: 'muted' },
  ],
  branchAdmin: [
    { text: 'Priya Sharma checked in on time', time: '8m ago', tone: 'success' },
    { text: '2 employees added to Evening shift', time: '55m ago', tone: 'primary' },
    { text: 'Amit Verma marked late', time: '1h ago', tone: 'warning' },
    { text: 'Branch attendance report generated', time: '3h ago', tone: 'accent' },
  ],
  hr: [
    { text: 'Nisha Gupta submitted a face registration', time: '12m ago', tone: 'primary' },
    { text: 'Approved leave request for Rohit Kumar', time: '35m ago', tone: 'success' },
    { text: 'Correction request pending review (×7)', time: '1h ago', tone: 'warning' },
    { text: 'Suspicious scan: low confidence at Udaipur', time: '2h ago', tone: 'danger' },
  ],
  manager: [
    { text: 'Anjali Sharma checked in on time', time: '6m ago', tone: 'success' },
    { text: 'Vivek Sharma requested a correction', time: '30m ago', tone: 'warning' },
    { text: 'Leave approval pending for Kavya Singh', time: '1h ago', tone: 'accent' },
    { text: 'Team attendance at 96% this week', time: 'Today', tone: 'primary' },
  ],
  employee: [
    { text: 'You checked in at 09:02 — on time', time: '3h ago', tone: 'success' },
    { text: 'Leave request submitted (Casual)', time: 'Yesterday', tone: 'accent' },
    { text: 'Face registration approved by HR', time: '2 days ago', tone: 'primary' },
    { text: 'Correction request resolved', time: '3 days ago', tone: 'muted' },
  ],
};

export function getActivities(role) {
  return MOCK_ACTIVITIES[role] || MOCK_ACTIVITIES.employee;
}
