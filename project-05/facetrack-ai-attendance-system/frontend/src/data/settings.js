// FaceTrack AI — Mock org/branch settings (frontend-only mode).

export const SETTINGS = {
  orgName: 'FaceTrack AI Corp',
  defaultGraceMinutes: 10,
  overtimeApprovalAfterMinutes: 60,
  autoAbsentEnabled: true,
  checkOutReminderEnabled: true,
  faceConfidenceThreshold: 0.75,
  requireConsentBeforeFace: true,
  notifications: {
    lateAlerts: true,
    suspiciousScanAlerts: true,
    overtimeApprovals: true,
    weeklySummary: false,
  },
};
