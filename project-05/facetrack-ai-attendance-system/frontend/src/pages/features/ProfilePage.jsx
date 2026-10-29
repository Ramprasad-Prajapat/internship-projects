// FaceTrack AI — Profile page (all roles).
// Shows the employee identity + attendance control center. Org-level
// accounts with no employee record see a reduced view.
// Support optional employeeId parameter for cross-role profiles.

import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Pencil,
  UserCircle,
  ScanFace,
  Building,
  Clock,
  Calendar,
  History,
  Phone,
  Mail,
  User,
  Shield,
  FileText,
  MapPin,
  CheckCircle,
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  XCircle,
  Timer
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  Modal,
  StatusBadge,
  Avatar,
  TextField,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { useToast } from '../../hooks/useToast';
import { byId, employeeMonthSummary } from '../../services/selectors';
import { ROLE_LABELS, FACE_STATUS, EMPLOYEE_STATUS, ATTENDANCE_STATUS, ROLE_BASE } from '../../utils/constants';
import { prettyDate, todayISO, formatMinutes } from '../../utils/dateUtils';
import { FALLBACK_EMPLOYEE } from '../../data/employees';

// One key/value line in the meta grid.
function MetaItem({ label, children, valueStyle = {} }) {
  return (
    <div className="ft-meta-item" style={{ marginBottom: 12 }}>
      <span className="ft-meta-key" style={{ fontSize: '0.8rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span className="ft-meta-val" style={{ display: 'block', marginTop: 2, fontWeight: 500, ...valueStyle }}>{children}</span>
    </div>
  );
}

// One monthly-snapshot stat tile (status icon + label + value).
function SnapStat({ icon: Icon, label, value, color }) {
  return (
    <div style={{ padding: 12, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 10, border: '1px solid var(--ft-card-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      {Icon ? <Icon size={18} style={{ color, flexShrink: 0 }} /> : null}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color }}>{value}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, role } = useAuth();
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const employees = useCollection('employees');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const attendance = useCollection('attendance');
  const faceRegistrations = useCollection('faceRegistrations');
  const correctionRequests = useCollection('correctionRequests');
  const leaveRequests = useCollection('leaveRequests');

  // Resolve target employee record. For a cross-role view (employeeId in URL),
  // if the record can't be found in the mock store, fall back to clean mock data
  // so the reusable profile route renders instead of crashing / showing the wrong
  // account. Own-profile org accounts (no employeeId) keep the reduced view.
  const empId = employeeId || user?.employeeId;
  const resolvedEmp = empId ? byId(employees, empId) : null;
  const emp = resolvedEmp || (employeeId ? FALLBACK_EMPLOYEE : null);

  const isCrossRoleView = !!employeeId;

  // State for own profile edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const openEdit = () => {
    setName(emp?.name ?? '');
    setPhone(emp?.phone ?? '');
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!emp) return;
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Name is required');
      return;
    }
    store.update('employees', emp.id, { name: trimmed, phone: phone.trim() });
    store.addAudit({
      actor: user?.name ?? 'Unknown',
      role,
      action: 'profileUpdated',
      target: emp.id,
      description: `Updated own profile (${trimmed}).`,
    });
    toast.success('Profile updated');
    setEditOpen(false);
  };

  // Back path for cross-role profile viewers
  let backPath = '';
  if (role === 'hr') backPath = '/hr/employees';
  else if (role === 'superAdmin') backPath = '/super-admin/employees';
  else if (role === 'branchAdmin') backPath = '/branch-admin/employees';
  else if (role === 'manager') backPath = '/manager/team-members';

  const backAction = isCrossRoleView && backPath ? (
    <button
      className="ft-btn ft-btn--ghost"
      type="button"
      onClick={() => navigate(backPath)}
      style={{ marginRight: 8 }}
    >
      &larr; Back to list
    </button>
  ) : null;

  // Reduced view for organization-level accounts that are not employees
  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader
          title="My Profile"
          subtitle="Your account and employment details."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginTop: 24 }}>
          <SectionCard icon={UserCircle} title="Account">
            <div className="ft-id-cell" style={{ alignItems: 'center', gap: 16 }}>
              <Avatar name={user?.name ?? 'Unknown'} color={user?.avatarColor || 'var(--ft-primary)'} size="lg" />
              <div className="ft-id-name">
                <span className="ft-cell-strong" style={{ fontSize: '1.15rem' }}>{user?.name ?? 'Unknown user'}</span>
                <span className="ft-id-sub">{ROLE_LABELS[role] ?? role}</span>
                <span className="ft-id-sub">{user?.email ?? '—'}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Organisation account">
            <div className="ft-meta-grid">
              <MetaItem label="Role">{ROLE_LABELS[role] ?? role}</MetaItem>
              <MetaItem label="Email">{user?.email ?? '—'}</MetaItem>
            </div>
            <p className="ft-note" style={{ marginTop: 16 }}>
              This is an organisation-level account and is not linked to an employee
              record, so there are no employment details to show.
            </p>
          </SectionCard>
        </div>
      </section>
    );
  }

  // --- Identity resolution (live mock store, no name-based special-casing) ---
  const displayName = emp.name;
  const displayIdCode = emp.employeeCode || emp.id;
  const displayEmail = emp.email || '—';
  const displayPhone = emp.phone || '—';
  const avatarColor = emp.avatarColor || 'var(--ft-primary)';

  const branch = byId(branches, emp.branchId);
  const dept = byId(departments, emp.departmentId);
  const shift = byId(shifts, emp.shiftId);

  const branchName = branch?.name ?? '—';
  const departmentName = dept?.name ?? '—';
  const shiftName = shift?.name ?? '—';

  // Assigned branch details (real branch record, or em-dash when unassigned)
  const branchIdVal = branch?.id ?? '—';
  const branchCity = branch?.city ?? '—';
  const branchAddress = branch?.address ?? '—';
  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${mStr} ${ampm}`;
  };

  const branchRadius = branch?.radiusMeters ? `${branch.radiusMeters}m` : '—';
  const shiftTiming = shift ? `${formatTime12h(shift.start)} - ${formatTime12h(shift.end)}` : '—';
  
  // Manager resolution (from the live store).
  let managerName = '—';
  if (emp.managerId) {
    const m = byId(employees, emp.managerId);
    if (m) managerName = m.name;
  }

  // --- Attendance Identity card — derived from the live mock store ---
  // No real biometric storage, no GPS, no backend. Face status comes from the
  // employee record; last scan time + confidence from the latest (mock) face
  // registration for this employee, if any. Updates after a Face Registration.
  const myFaceRegs = faceRegistrations
    .filter((f) => f.employeeId === emp.id)
    .sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : a.capturedAt > b.capturedAt ? -1 : 0));
  const latestFace = myFaceRegs[0] || null;
  const faceStatusValue = emp.faceStatus || latestFace?.status || 'none';
  const lastFaceScan = latestFace?.capturedAt ? prettyDate(latestFace.capturedAt) : '—';
  const faceConfidence = latestFace?.confidence != null ? `${Math.round(latestFace.confidence * 100)}%` : '—';

  // --- Assigned Branch / Office card — display label (frontend-only) ---
  // The real assigned shift stays the source of truth; the badge just appends
  // "Shift" for readability (Morning -> "Morning Shift"). Shared shift seed unchanged.
  const officeShiftBadge = /shift$/i.test(shiftName) ? shiftName : `${shiftName} Shift`;

  // --- Today Attendance — derived from the live store (updates after check-in) ---
  const todayRow = attendance.find((a) => a.employeeId === emp.id && a.date === todayISO()) || null;
  const todayInfo = todayRow
    ? ATTENDANCE_STATUS[todayRow.status] || { label: todayRow.status, tone: 'muted' }
    : { label: 'Not marked', tone: 'muted' };
  const todayStatusLabel = todayInfo.label;
  const todayStatusTone = todayInfo.tone;
  const checkInTime = todayRow?.checkIn ? formatTime12h(todayRow.checkIn) : '—';
  const checkOutTime = todayRow?.checkOut ? formatTime12h(todayRow.checkOut) : 'Pending';
  const workingHours = todayRow?.totalHours ? `${todayRow.totalHours}h` : '—';
  const isLate = todayRow && todayRow.lateMinutes > 0 ? 'Yes' : 'No';
  const overtimeStatus =
    todayRow && todayRow.overtimeMinutes > 0
      ? formatMinutes(todayRow.overtimeMinutes)
      : todayRow?.checkOut
        ? 'No'
        : 'Pending';

  // --- Monthly snapshot — derived from the live store ---
  const monthSummary = employeeMonthSummary(attendance, emp.id);
  const presentDays = monthSummary.presentDays;
  const absentDays = monthSummary.absentDays;
  const lateMarks = monthSummary.lateDays;
  const leaveDays = monthSummary.leaveDays;
  const overtimeHours = `${monthSummary.overtimeHours}h`;
  const correctionCount = correctionRequests.filter((c) => c.employeeId === emp.id).length;

  // --- Derived consent / location (from the live mock store) ---
  // There is no separate consent table, so instead of always showing a positive
  // value these are derived from real signals:
  //   • Biometric consent ← face-registration status
  //   • Location status   ← the location stamped on the latest attendance scan
  // Privacy / data-usage acceptance is treated as part of completing face
  // registration, so it tracks the same signal.
  const faceRegistered = faceStatusValue === 'registered' || faceStatusValue === 'approved';
  const biometricConsent = faceRegistered
    ? { tone: 'success', label: 'Accepted' }
    : faceStatusValue === 'pending'
      ? { tone: 'warning', label: 'Pending' }
      : { tone: 'muted', label: 'Not provided' };

  const latestLocRow =
    (todayRow && todayRow.location ? todayRow : null) ||
    attendance
      .filter((a) => a.employeeId === emp.id && a.location)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))[0] ||
    null;
  const locationStatus = latestLocRow?.location
    ? latestLocRow.location.status === 'insideRadius'
      ? { tone: 'success', label: 'Inside Radius' }
      : { tone: 'danger', label: 'Outside Radius' }
    : { tone: 'muted', label: 'No location data' };
  const locationCaptured = !!latestLocRow?.location;
  const lastConsentUpdate = latestFace?.capturedAt ? prettyDate(latestFace.capturedAt) : '—';

  // --- Profile completion — computed from the fields we actually hold ---
  const completionChecks = [
    emp.name,
    emp.email,
    emp.phone,
    emp.designation,
    emp.branchId,
    emp.departmentId,
    emp.shiftId,
    faceRegistered ? 'face' : '',
  ];
  const profileCompletion = Math.round(
    (completionChecks.filter((v) => v != null && String(v).trim() !== '').length /
      completionChecks.length) *
      100
  );

  // --- Demo-only profile fields (not part of the mock employee schema) ---
  // No backend stores these, so they show neutral, non-person-specific
  // placeholders. (The old name-based "isAyesha" branching was removed.)
  const dob = '—';
  const gender = '—';
  const personalAddress = '—';
  const joiningDateVal = prettyDate(emp.joiningDate);

  const emergencyName = '—';
  const emergencyRelation = '—';
  const emergencyPhone = '—';
  const emergencyAlternate = '—';

  // Document checklist is not in the mock schema, so it is shown as "Not
  // uploaded" rather than implying verified paperwork that doesn't exist.
  const docs = [
    { name: 'ID Proof', status: 'Not uploaded', tone: 'muted' },
    { name: 'Offer Letter', status: 'Not uploaded', tone: 'muted' },
    { name: 'Employee Agreement', status: 'Not uploaded', tone: 'muted' },
    { name: 'Salary Slip', status: 'Not uploaded', tone: 'muted' },
    { name: 'Attendance Policy', status: 'Not uploaded', tone: 'muted' },
  ];

  // --- Recent activity timeline — built from the live store ---
  // Merges this employee's attendance, correction, leave and face-registration
  // events (most recent first) so the timeline reflects real mock activity.
  const activityFeed = [
    ...attendance
      .filter((a) => a.employeeId === emp.id && a.checkIn)
      .map((a) => ({ date: a.date, time: prettyDate(a.date), text: `Attendance marked (${ATTENDANCE_STATUS[a.status]?.label || a.status}) via Face + Location` })),
    ...correctionRequests
      .filter((c) => c.employeeId === emp.id)
      .map((c) => ({ date: c.createdAt, time: prettyDate(c.createdAt), text: `Correction request — ${c.status}` })),
    ...leaveRequests
      .filter((l) => l.employeeId === emp.id)
      .map((l) => ({ date: l.createdAt, time: prettyDate(l.createdAt), text: `Leave request (${l.leaveType}) — ${l.status}` })),
    ...myFaceRegs.map((f) => ({ date: f.capturedAt, time: prettyDate(f.capturedAt), text: `Face profile ${f.status}` })),
  ]
    .filter((x) => x.date)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 6);
  const activities = activityFeed.length
    ? activityFeed
    : [{ time: 'No recent activity', text: 'Your attendance and requests will appear here.' }];

  return (
    <section className="ft-page">
      <PageHeader
        title={isCrossRoleView ? `${displayName}'s Control Center` : "Employee Identity & Attendance Control Center"}
        subtitle="Manage employee identification, geolocation parameters, and log roster."
        actions={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {backAction}
            {!isCrossRoleView && (
              <button className="ft-btn ft-btn--primary" type="button" onClick={openEdit}>
                <Pencil size={16} /> Edit Profile
              </button>
            )}
          </div>
        }
      />

      {/* Profile Header Summary */}
      <div style={{ marginTop: 24 }}>
        <SectionCard>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
              <Avatar name={displayName} color={avatarColor} size="lg" />
              <div>
                <h2 className="ft-cell-strong" style={{ fontSize: '1.4rem', margin: 0 }}>{displayName}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: 'var(--ft-text-dim)', fontSize: '0.9rem' }}>{emp.designation} · {departmentName}</span>
                  <StatusBadge map={EMPLOYEE_STATUS} value={emp.status} />
                </div>
              </div>
            </div>
            
            <div style={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--ft-text-dim)' }}>Profile Completion</span>
                <span className="ft-cell-strong" style={{ color: 'var(--ft-primary)', fontWeight: 600 }}>{profileCompletion}%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, var(--ft-primary) 0%, var(--ft-accent) 100%)', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--ft-card-border)', margin: '20px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <UserCircle size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Employee ID</div>
                <div style={{ fontWeight: 600 }}>{displayIdCode}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Mail size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontWeight: 600 }}>{displayEmail}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Phone size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontWeight: 600 }}>{displayPhone}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <User size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Designation</div>
                <div style={{ fontWeight: 600 }}>{emp.designation} · {departmentName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Building size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Branch</div>
                <div style={{ fontWeight: 600 }}>{branchName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Clock size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Shift</div>
                <div style={{ fontWeight: 600 }}>{shiftName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <ShieldCheck size={18} style={{ color: 'var(--ft-primary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>Account Status</div>
                <div style={{ display: 'inline-flex', marginTop: 2 }}>
                  <StatusBadge 
                    map={{ 
                      active: { label: 'Active', tone: 'success' }, 
                      inactive: { label: 'Inactive', tone: 'muted' } 
                    }} 
                    value={emp.status} 
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions & Connected Navigation Row */}
      <div style={{ marginTop: 20 }}>
        <SectionCard title="Actions & Navigation" icon={LayoutDashboard}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            <Link to={`${ROLE_BASE[role]}/dashboard`} className="ft-btn ft-btn--ghost">
              Back to Dashboard
            </Link>
            {isCrossRoleView && backPath && (
              <Link to={backPath} className="ft-btn ft-btn--ghost">
                Back to Employee List
              </Link>
            )}
            {role === 'employee' && (
              <>
                <Link to={`${ROLE_BASE.employee}/mark-attendance`} className="ft-btn ft-btn--primary">
                  Mark Attendance
                </Link>
                <Link to={`${ROLE_BASE.employee}/my-attendance`} className="ft-btn ft-btn--secondary">
                  View My Attendance
                </Link>
                <Link to={`${ROLE_BASE.employee}/corrections`} className="ft-btn ft-btn--subtle">
                  Request Correction
                </Link>
                <Link to={`${ROLE_BASE.employee}/leave`} className="ft-btn ft-btn--subtle">
                  Apply Leave
                </Link>
                <Link to="/consent" className="ft-btn ft-btn--ghost">
                  View Consent
                </Link>
                <Link to={`${ROLE_BASE.employee}/face-registration`} className="ft-btn ft-btn--ghost">
                  Update Face Profile
                </Link>
              </>
            )}
          </div>
        </SectionCard>
      </div>

      {/* 3-Column Card Grid */}
      <div className="ft-grid-3" style={{ gap: 24, marginTop: 24 }}>
        
        {/* Attendance Identity Card */}
        <SectionCard
          title="Attendance Identity"
          subtitle="Face and location verification status"
          icon={ScanFace}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Face Status</span>
              <StatusBadge map={FACE_STATUS} value={faceStatusValue} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Biometric Consent</span>
              <StatusBadge tone={biometricConsent.tone} label={biometricConsent.label} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Location Status</span>
              <StatusBadge tone={locationStatus.tone} label={locationStatus.label} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Assigned Radius</span>
              <span style={{ fontWeight: 600 }}>{branchRadius}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Mock Mode</span>
              <StatusBadge tone="info" label="Active" />
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--ft-card-border)', margin: '4px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)' }}>Last Face Scan</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{lastFaceScan}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)' }}>Face Confidence</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{faceConfidence}</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Assigned Branch / Office Card */}
        <SectionCard
          title="Assigned Branch / Office"
          subtitle="Office location and attendance radius details"
          icon={Building}
        >
          {/* Branch identity — badge row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 16 }}>
            <StatusBadge tone="primary" label={branchName} />
            <StatusBadge tone="info" label={`${branchRadius} Radius`} />
            <StatusBadge tone="accent" label={officeShiftBadge} />
            <StatusBadge tone="success" label="Active Branch" />
          </div>

          {/* Address / location + attendance details */}
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
            <MetaItem label="Branch ID">{branchIdVal}</MetaItem>
            <MetaItem label="Branch Name">{branchName}</MetaItem>
            <MetaItem label="City">{branchCity}</MetaItem>
            <MetaItem label="Address">{branchAddress}</MetaItem>
            <MetaItem label="Allowed Radius">{branchRadius}</MetaItem>
            <MetaItem label="Shift Timing">{shiftTiming}</MetaItem>
            <MetaItem label="Reporting Manager">{managerName}</MetaItem>
          </div>
        </SectionCard>

        {/* Today's Attendance Card */}
        <SectionCard
          title="Today Attendance"
          subtitle="Current day check-in and work status"
          icon={Clock}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Status</span>
              <StatusBadge tone={todayStatusTone} label={todayStatusLabel} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Check-in</span>
              <span style={{ fontWeight: 600 }}>{checkInTime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Check-out</span>
              {checkOutTime === 'Pending'
                ? <StatusBadge tone="warning" label="Pending" />
                : <span style={{ fontWeight: 600 }}>{checkOutTime}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Working Hours</span>
              <span style={{ fontWeight: 600 }}>{workingHours}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Late</span>
              <StatusBadge tone={isLate === 'Yes' ? 'danger' : 'success'} label={isLate} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Overtime</span>
              {overtimeStatus === 'Pending'
                ? <StatusBadge tone="info" label="Pending" />
                : <span style={{ fontWeight: 600 }}>{overtimeStatus}</span>}
            </div>
          </div>
        </SectionCard>

        {/* Monthly Attendance Snapshot */}
        <SectionCard
          title="Monthly Attendance Snapshot"
          subtitle="Current month attendance summary"
          icon={Calendar}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 8 }}>
            <SnapStat icon={CheckCircle} label="Present Days" value={presentDays} color="var(--ft-green)" />
            <SnapStat icon={XCircle} label="Absent Days" value={absentDays} color="var(--ft-red)" />
            <SnapStat icon={Clock} label="Late Marks" value={lateMarks} color="var(--ft-yellow)" />
            <SnapStat icon={Calendar} label="Leave Days" value={leaveDays} color="var(--ft-blue)" />
            <SnapStat icon={Timer} label="Overtime Hours" value={overtimeHours} color="var(--ft-accent)" />
            <SnapStat icon={ClipboardList} label="Correction Requests" value={correctionCount} color="var(--ft-yellow)" />
          </div>
        </SectionCard>

        {/* Personal Details Card */}
        <SectionCard
          title="Personal Details"
          subtitle="Personal and employment information"
          icon={User}
        >
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr', gap: 10, marginTop: 8 }}>
            <MetaItem label="Full Name">{displayName}</MetaItem>
            <MetaItem label="Email">{displayEmail}</MetaItem>
            <MetaItem label="Phone">{displayPhone}</MetaItem>
            <MetaItem label="Address">{personalAddress}</MetaItem>
            <MetaItem label="Date of Birth">{dob}</MetaItem>
            <MetaItem label="Gender">{gender}</MetaItem>
            <MetaItem label="Joining Date">{joiningDateVal}</MetaItem>
          </div>
        </SectionCard>

        {/* Emergency Contact Card */}
        <SectionCard
          title="Emergency Contact"
          subtitle="Who to contact in an emergency"
          icon={Phone}
        >
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr', gap: 10, marginTop: 8 }}>
            <MetaItem label="Contact Name">{emergencyName}</MetaItem>
            <MetaItem label="Relation">{emergencyRelation}</MetaItem>
            <MetaItem label="Phone">{emergencyPhone}</MetaItem>
            <MetaItem label="Alternate Phone">{emergencyAlternate}</MetaItem>
          </div>
        </SectionCard>

        {/* Documents Card */}
        <SectionCard
          title="Documents Status"
          subtitle="Employee document verification status"
          icon={FileText}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            {docs.map((d) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>{d.name}</span>
                <StatusBadge tone={d.tone} label={d.status} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Privacy & Consent Card */}
        <SectionCard
          title="Privacy & Consent"
          subtitle="Consent and data permission status"
          icon={Shield}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Biometric Consent</span>
              <StatusBadge tone={biometricConsent.tone} label={biometricConsent.label} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Location Permission</span>
              {locationCaptured
                ? <StatusBadge tone="success" label="Allowed" />
                : <StatusBadge tone="muted" label="Not captured" />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Privacy Policy</span>
              {faceRegistered
                ? <StatusBadge tone="success" label="Accepted" />
                : <StatusBadge tone="warning" label="Pending" />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Data Usage Permission</span>
              {faceRegistered
                ? <StatusBadge tone="success" label="Allowed" />
                : <StatusBadge tone="warning" label="Pending" />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>Last Consent Update</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{lastConsentUpdate}</span>
            </div>
          </div>
        </SectionCard>

        {/* Activity Timeline */}
        <SectionCard
          title="Recent Activity Timeline"
          subtitle="Latest profile and attendance activity"
          icon={History}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12, paddingLeft: 8 }}>
            {activities.map((act, index) => (
              <div key={index} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                {index < activities.length - 1 && (
                  <div style={{ position: 'absolute', left: 5, top: 12, bottom: -18, width: 2, background: 'rgba(255, 255, 255, 0.08)' }}></div>
                )}
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--ft-primary)', marginTop: 4, zIndex: 1, boxShadow: '0 0 8px var(--ft-primary)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)' }}>{act.time}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: 2, color: 'var(--ft-text)' }}>{act.text}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      {/* Edit Modal (only for own profile editing) */}
      {!isCrossRoleView && emp && (
        <Modal
          open={editOpen}
          title="Edit Profile"
          onClose={() => setEditOpen(false)}
          footer={
            <>
              <button className="ft-btn ft-btn--ghost" type="button" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button className="ft-btn ft-btn--primary" type="button" onClick={handleSave}>
                Save
              </button>
            </>
          }
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Full name"
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 0000000"
          />
        </Modal>
      )}
    </section>
  );
}
