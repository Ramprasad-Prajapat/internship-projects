// FaceTrack AI — Manager Profile (Manager Identity + Team Responsibility Center).
//
// Frontend-only: manager identity comes from the manager's own employee record
// in the SHARED mock store; team responsibility / summary come from
// services/managerService (which reuses selectors + mockStore — no duplicate
// data system). Fields with no mock schema (reporting HR/branch admin, profile
// completion) use clean fallbacks. Edit Profile persists name/phone to the store.
// No backend, Firebase, API, real GPS, or real biometric storage.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil,
  UserCircle,
  Building,
  Clock,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ScanFace,
  LayoutDashboard,
  CalendarCheck,
  Users,
  ClipboardCheck,
  FileBarChart,
  Database,
  KeyRound,
  Briefcase,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  Modal,
  StatusBadge,
  Avatar,
  TextField,
  MockDataNotice,
} from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import * as mgr from '../../services/managerService';
import { ROLE_LABELS, ATTENDANCE_STATUS, FACE_STATUS, EMPLOYEE_STATUS } from '../../utils/constants';
import { prettyDate, formatMinutes, nowHHMM } from '../../utils/dateUtils';

// Fallback manager (mirrors EMP004 / Neeraj Verma) so the page never crashes if
// the manager record can't be resolved from the store.
const FALLBACK_MANAGER = {
  id: 'EMP004',
  employeeCode: 'JAI-0004',
  name: 'Neeraj Verma',
  email: 'manager@demo.com',
  phone: '+91 98300 11004',
  designation: 'Engineering Manager',
  branchId: 'BR001',
  departmentId: 'DPT001',
  shiftId: 'SH001',
  status: 'active',
  faceStatus: 'registered',
  joiningDate: '2021-09-20',
  avatarColor: '#f59e0b',
};

const AUTHORITY = [
  { label: 'Leave Approval', tone: 'success' },
  { label: 'Correction Review', tone: 'info' },
  { label: 'Team Attendance', tone: 'primary' },
  { label: 'Profile Access', tone: 'accent' },
  { label: 'Team Reports', tone: 'primary' },
  { label: 'Overtime Review', tone: 'warning' },
];

function MetaItem({ label, children }) {
  return (
    <div className="ft-meta-item" style={{ marginBottom: 12 }}>
      <span className="ft-meta-key" style={{ fontSize: '0.8rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span className="ft-meta-val" style={{ display: 'block', marginTop: 2, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>{label}</span>
      {children}
    </div>
  );
}

const to12h = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':');
  const hh = parseInt(h, 10);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${hh % 12 || 12}:${m} ${ampm}`;
};

export default function ManagerProfilePage() {
  const { user, role } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const shifts = useCollection('shifts');
  const attendance = useCollection('attendance');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const auditLogs = useCollection('auditLogs');

  const emp = byId(employees, user?.employeeId) || FALLBACK_MANAGER;

  const dept = byId(departments, emp.departmentId);
  const branch = byId(branches, emp.branchId);
  const shift = byId(shifts, emp.shiftId);
  const deptName = dept?.name || 'Engineering';
  const branchName = branch?.name || 'Jaipur HQ';
  const shiftName = shift?.name || 'Morning';
  const radius = branch?.radiusMeters ? `${branch.radiusMeters}m` : '150m';

  // Reporting line — not in the mock schema, so derive a sensible person from
  // the data where possible, else a clean fallback label.
  const reportingHR = employees.find((e) => /hr manager|hr executive|human/i.test(e.designation || ''))?.name || 'HR Team';
  const reportingBranchAdmin = employees.find((e) => /branch/i.test(e.designation || ''))?.name || 'Branch Administration';

  // --- team data (via the shared manager service) ---
  const team = useMemo(() => mgr.managerTeam(employees, user), [employees, user]);
  const overview = useMemo(
    () => mgr.teamOverview(team, attendance, { leaveRequests, correctionRequests }),
    [team, attendance, leaveRequests, correctionRequests]
  );
  const activeMembers = useMemo(() => team.filter((e) => e.status === 'active').length, [team]);
  const activity = useMemo(
    () => mgr.managerActivity(auditLogs, user, team, { employees, attendance, leaveRequests, correctionRequests, faceRegistrations }),
    [auditLogs, user, team, employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );

  // Manager's own attendance today (managers are FaceTrack users too).
  const todayRow = useMemo(() => mgr.todayRowFor(attendance, emp.id), [attendance, emp.id]);
  const todayInfo = todayRow ? ATTENDANCE_STATUS[todayRow.status] || { label: todayRow.status, tone: 'muted' } : { label: 'Not marked', tone: 'muted' };
  const lastFaceScan = todayRow?.checkIn ? `Today ${to12h(todayRow.checkIn)}` : 'Today 08:58 AM';
  const faceConfidence = todayRow?.confidence != null ? `${Math.round(todayRow.confidence * 100)}%` : '96%';
  const locInside = todayRow?.location ? todayRow.location.status === 'insideRadius' : true;

  // Last login — mock local session, remembered for the browser session.
  const [lastLogin] = useState(() => {
    try {
      const k = 'ft_manager_last_login';
      let v = sessionStorage.getItem(k);
      if (!v) {
        v = `Today ${to12h(nowHHMM())}`;
        sessionStorage.setItem(k, v);
      }
      return v;
    } catch {
      return `Today ${to12h(nowHHMM())}`;
    }
  });

  // --- edit profile (persists to the shared store) ---
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const openEdit = () => {
    setName(emp.name ?? '');
    setPhone(emp.phone ?? '');
    setEditOpen(true);
  };

  const saveEdit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Name is required');
      return;
    }
    store.update('employees', emp.id, { name: trimmed, phone: phone.trim() });
    store.addAudit({
      actor: user?.name ?? 'Manager',
      role,
      action: 'profileUpdated',
      target: emp.id,
      description: `Updated manager profile (${trimmed}).`,
    });
    toast.success('Profile updated');
    setEditOpen(false);
  };

  const QUICK_ACTIONS = [
    { label: 'View Team Attendance', to: '/manager/attendance', icon: CalendarCheck },
    { label: 'View Team Members', to: '/manager/team-members', icon: Users },
    { label: 'View Approvals', to: '/manager/leave-requests', icon: ClipboardCheck },
    { label: 'View Reports', to: '/manager/reports', icon: FileBarChart },
    { label: 'View My Attendance', to: '/manager/attendance', icon: CalendarCheck },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Manager Profile"
        subtitle="Manager Identity + Team Responsibility Center"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MockDataNotice variant="badge" title="Mock mode" icon={Database} />
            <button className="ft-btn ft-btn--primary" type="button" onClick={openEdit}>
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        }
      />

      {/* 1. Manager Profile Header Card */}
      <div style={{ marginTop: 24 }}>
        <SectionCard>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
              <Avatar name={emp.name} color={emp.avatarColor} size="lg" />
              <div>
                <h2 className="ft-cell-strong" style={{ fontSize: '1.4rem', margin: 0 }}>{emp.name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: 'var(--ft-text-dim)', fontSize: '0.9rem' }}>{emp.designation} · {deptName} · {branchName}</span>
                  <StatusBadge map={EMPLOYEE_STATUS} value={emp.status} />
                </div>
              </div>
            </div>
            <div style={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--ft-text-dim)' }}>Profile Completion</span>
                <span className="ft-cell-strong" style={{ color: 'var(--ft-primary)', fontWeight: 600 }}>90%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, var(--ft-primary) 0%, var(--ft-accent) 100%)', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--ft-card-border)', margin: '20px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <HeaderItem icon={UserCircle} label="Manager ID" value={emp.employeeCode || emp.id} />
            <HeaderItem icon={Mail} label="Email" value={user?.email || emp.email} />
            <HeaderItem icon={Phone} label="Phone" value={emp.phone || '—'} />
            <HeaderItem icon={User} label="Role" value={ROLE_LABELS[role] || 'Manager'} />
            <HeaderItem icon={Briefcase} label="Designation" value={emp.designation} />
            <HeaderItem icon={Building} label="Branch" value={branchName} />
          </div>
        </SectionCard>
      </div>

      {/* 3. Quick Actions Row */}
      <div style={{ marginTop: 20 }}>
        <SectionCard title="Quick Actions" icon={LayoutDashboard}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.to} className="ft-btn ft-btn--subtle">
                  <Icon size={16} /> {a.label}
                </Link>
              );
            })}
            <button type="button" className="ft-btn ft-btn--ghost" onClick={openEdit}>
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Card grid */}
      <div className="ft-grid-3" style={{ gap: 24, marginTop: 24 }}>
        {/* 2. Manager Job Details */}
        <SectionCard title="Job Details" subtitle="Role and reporting line" icon={Briefcase}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
            <MetaItem label="Designation">{emp.designation}</MetaItem>
            <MetaItem label="Department">{deptName}</MetaItem>
            <MetaItem label="Branch">{branchName}</MetaItem>
            <MetaItem label="Joining Date">{prettyDate(emp.joiningDate)}</MetaItem>
            <MetaItem label="Shift">{shiftName}</MetaItem>
            <MetaItem label="Reporting HR">{reportingHR}</MetaItem>
            <MetaItem label="Reporting Branch Admin">{reportingBranchAdmin}</MetaItem>
            <MetaItem label="Assigned Team">{deptName} Team</MetaItem>
          </div>
        </SectionCard>

        {/* 3. Team Responsibility */}
        <SectionCard title="Team Responsibility" subtitle="Who you manage" icon={Users}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetaItem label="Team Name">{deptName} Team</MetaItem>
            <MetaItem label="Total Members">{team.length}</MetaItem>
            <MetaItem label="Active Members">{activeMembers}</MetaItem>
            <MetaItem label="Present Today">{overview.present}</MetaItem>
            <MetaItem label="Absent Today">{overview.absent}</MetaItem>
            <MetaItem label="Late Today">{overview.late}</MetaItem>
            <MetaItem label="On Leave">{overview.onLeave}</MetaItem>
            <MetaItem label="Pending Approvals">{overview.pendingApprovals}</MetaItem>
          </div>
        </SectionCard>

        {/* 4. Manager Attendance Identity */}
        <SectionCard title="Attendance Identity" subtitle="Your face + location status" icon={ScanFace}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Face Status"><StatusBadge map={FACE_STATUS} value={emp.faceStatus || 'registered'} /></Row>
            <Row label="Biometric Consent"><StatusBadge tone="success" label="Accepted" /></Row>
            <Row label="Last Face Scan"><span style={{ fontWeight: 600 }}>{lastFaceScan}</span></Row>
            <Row label="Face Confidence"><span style={{ fontWeight: 600 }}>{faceConfidence}</span></Row>
            <Row label="Location Status"><StatusBadge tone={locInside ? 'success' : 'danger'} label={locInside ? 'Inside Radius' : 'Outside Radius'} /></Row>
            <Row label="Assigned Radius"><span style={{ fontWeight: 600 }}>{radius}</span></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
        </SectionCard>

        {/* 5. Approval Authority */}
        <SectionCard title="Approval Authority" subtitle="What you can do" icon={ShieldCheck}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {AUTHORITY.map((a) => (
              <StatusBadge key={a.label} tone={a.tone} label={a.label} />
            ))}
          </div>
          <p className="ft-note" style={{ marginTop: 16 }}>
            Manager scope: approve team leave, review corrections &amp; overtime, view team attendance,
            member profiles, and team reports.
          </p>
        </SectionCard>

        {/* 6. Today Manager Attendance */}
        <SectionCard title="Today Attendance" subtitle="Your check-in today" icon={Clock}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Status"><StatusBadge tone={todayInfo.tone} label={todayInfo.label} /></Row>
            <Row label="Check-in"><span style={{ fontWeight: 600 }}>{todayRow?.checkIn ? to12h(todayRow.checkIn) : '—'}</span></Row>
            <Row label="Check-out">{todayRow?.checkOut ? <span style={{ fontWeight: 600 }}>{to12h(todayRow.checkOut)}</span> : <StatusBadge tone="warning" label="Pending" />}</Row>
            <Row label="Working Hours"><span style={{ fontWeight: 600 }}>{todayRow?.totalHours ? `${todayRow.totalHours}h` : '—'}</span></Row>
            <Row label="Late"><StatusBadge tone={todayRow && todayRow.lateMinutes > 0 ? 'danger' : 'success'} label={todayRow && todayRow.lateMinutes > 0 ? 'Yes' : 'No'} /></Row>
            <Row label="Overtime">
              {todayRow && todayRow.overtimeMinutes > 0
                ? <span style={{ fontWeight: 600 }}>{formatMinutes(todayRow.overtimeMinutes)}</span>
                : <StatusBadge tone="info" label={todayRow?.checkOut ? 'No' : 'Pending'} />}
            </Row>
          </div>
        </SectionCard>

        {/* 7. Team Quick Summary */}
        <SectionCard title="Team Quick Summary" subtitle="At a glance" icon={CalendarCheck}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetaItem label="Team Attendance">{overview.attendanceRate}%</MetaItem>
            <MetaItem label="Late Employees">{overview.late}</MetaItem>
            <MetaItem label="Absent Employees">{overview.absent}</MetaItem>
            <MetaItem label="Leave Requests">{overview.pendingLeaves}</MetaItem>
            <MetaItem label="Correction Requests">{overview.pendingCorrections}</MetaItem>
            <MetaItem label="Overtime Requests">{overview.pendingOvertime}</MetaItem>
          </div>
        </SectionCard>

        {/* 9. Security / Login Info */}
        <SectionCard title="Security / Login Info" subtitle="Session details" icon={KeyRound}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Last Login"><span style={{ fontWeight: 600 }}>{lastLogin}</span></Row>
            <Row label="Account Status"><StatusBadge map={EMPLOYEE_STATUS} value={emp.status} /></Row>
            <Row label="Role Access"><StatusBadge tone="primary" label={ROLE_LABELS[role] || 'Manager'} /></Row>
            <Row label="Session Type"><span style={{ fontWeight: 600 }}>Mock Local Session</span></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
        </SectionCard>
      </div>

      {/* 10. Manager Activity Timeline */}
      <div style={{ marginTop: 24 }}>
        <RecentActivity items={activity} title="Manager Activity Timeline" />
      </div>

      <div className="ft-note" style={{ marginTop: 16 }}>
        <strong>Frontend-only mock mode.</strong> Manager identity + team data come from the shared
        mock store (<code>src/data/</code> → <code>localStorage</code>). No backend / Firebase / API.
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        title="Edit Manager Profile"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <button className="ft-btn ft-btn--ghost" type="button" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="ft-btn ft-btn--primary" type="button" onClick={saveEdit}>Save</button>
          </>
        }
      >
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" />
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98300 00000" />
      </Modal>
    </section>
  );
}

function HeaderItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon size={18} style={{ color: 'var(--ft-primary)' }} />
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
