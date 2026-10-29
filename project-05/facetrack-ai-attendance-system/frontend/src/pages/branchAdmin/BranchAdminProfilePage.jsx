// FaceTrack AI — Branch Admin Profile (Branch Admin Identity + Branch Responsibility Center).
//
// Frontend-only: identity comes from the branch admin's own employee record in
// the SHARED mock store; branch summary comes from services/branchAdminService
// (which reuses selectors + the store — no duplicate data system). Fields with no
// mock schema (profile completion, authority) use clean fallbacks. Edit Profile
// persists name/phone to the store. No backend, Firebase, API, real GPS, or real
// biometric storage.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil,
  UserCircle,
  Building,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ScanFace,
  LayoutDashboard,
  CalendarCheck,
  Network,
  Timer,
  FileBarChart,
  Users,
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
import * as bas from '../../services/branchAdminService';
import { ROLE_LABELS, ATTENDANCE_STATUS, FACE_STATUS, EMPLOYEE_STATUS } from '../../utils/constants';
import { prettyDate, formatMinutes, nowHHMM } from '../../utils/dateUtils';

// Fallback branch admin (mirrors EMP006 / Vikas Jain) so the page never crashes
// if the admin record can't be resolved from the store.
const FALLBACK_BRANCH_ADMIN = {
  id: 'EMP006',
  employeeCode: 'JOD-0006',
  name: 'Vikas Jain',
  email: 'branchadmin@demo.com',
  phone: '+91 98300 11006',
  designation: 'Branch Sales Lead',
  branchId: 'BR002',
  departmentId: 'DPT002',
  shiftId: 'SH002',
  status: 'active',
  faceStatus: 'registered',
  joiningDate: '2021-11-02',
  avatarColor: '#14b8a6',
};

const AUTHORITY = [
  { label: 'Employee Management', tone: 'primary' },
  { label: 'Attendance Review', tone: 'success' },
  { label: 'Attendance Verify', tone: 'info' },
  { label: 'Shift Management', tone: 'accent' },
  { label: 'Department View', tone: 'warning' },
  { label: 'Branch Reports', tone: 'primary' },
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
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

export default function BranchAdminProfilePage() {
  const { user, role } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const shifts = useCollection('shifts');
  const attendance = useCollection('attendance');
  const correctionRequests = useCollection('correctionRequests');
  const leaveRequests = useCollection('leaveRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const auditLogs = useCollection('auditLogs');

  const emp = byId(employees, user?.employeeId) || FALLBACK_BRANCH_ADMIN;

  const dept = byId(departments, emp.departmentId);
  const branch = byId(branches, emp.branchId);
  const shift = byId(shifts, emp.shiftId);
  const deptName = dept?.name || 'Sales';
  const branchName = branch?.name || 'Jodhpur Branch';
  const branchCity = branch?.city || 'Jodhpur';
  const branchAddress = branch?.address || 'Sardarpura, Jodhpur, Rajasthan';
  const shiftName = shift?.name || 'Evening';
  const radius = branch?.radiusMeters ? `${branch.radiusMeters}m` : '150m';

  // --- branch data (via the shared branch-admin service) ---
  const emps = useMemo(() => bas.branchEmployees(employees, user), [employees, user]);
  const overview = useMemo(
    () => bas.branchOverview(emps, attendance, { correctionRequests, departments, shifts }),
    [emps, attendance, correctionRequests, departments, shifts]
  );
  const activity = useMemo(
    () => bas.branchActivityOwn(auditLogs, user, emps, { employees, attendance, leaveRequests, correctionRequests, faceRegistrations }),
    [auditLogs, user, emps, employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );

  // Branch admin's own attendance today.
  const todayRow = useMemo(() => bas.todayRowFor(attendance, emp.id), [attendance, emp.id]);
  const todayInfo = todayRow ? ATTENDANCE_STATUS[todayRow.status] || { label: todayRow.status, tone: 'muted' } : { label: 'Not marked', tone: 'muted' };
  const lastFaceScan = todayRow?.checkIn ? `Today ${to12h(todayRow.checkIn)}` : 'Today 08:55 AM';
  const faceConfidence = todayRow?.confidence != null ? `${Math.round(todayRow.confidence * 100)}%` : '95%';
  const locInside = todayRow?.location ? todayRow.location.status === 'insideRadius' : true;

  // Last login — mock local session, remembered for the browser session.
  const [lastLogin] = useState(() => {
    try {
      const k = 'ft_branchadmin_last_login';
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
      actor: user?.name ?? 'Branch Admin',
      role,
      action: 'profileUpdated',
      target: emp.id,
      description: `Updated branch admin profile (${trimmed}).`,
    });
    toast.success('Profile updated');
    setEditOpen(false);
  };

  const QUICK_ACTIONS = [
    { label: 'Branch Employees', to: '/branch-admin/employees', icon: Users },
    { label: 'Review Attendance', to: '/branch-admin/attendance', icon: CalendarCheck },
    { label: 'Manage Departments', to: '/branch-admin/departments', icon: Network },
    { label: 'Manage Shifts', to: '/branch-admin/shifts', icon: Timer },
    { label: 'Branch Reports', to: '/branch-admin/reports', icon: FileBarChart },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Branch Admin Profile"
        subtitle="Branch Admin Identity + Branch Responsibility Center"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MockDataNotice variant="badge" title="Mock mode" icon={Database} />
            <button className="ft-btn ft-btn--primary" type="button" onClick={openEdit}>
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        }
      />

      {/* 1. Profile Header Card */}
      <div style={{ marginTop: 24 }}>
        <SectionCard>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
              <Avatar name={emp.name} color={emp.avatarColor} size="lg" />
              <div>
                <h2 className="ft-cell-strong" style={{ fontSize: '1.4rem', margin: 0 }}>{emp.name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: 'var(--ft-text-dim)', fontSize: '0.9rem' }}>{emp.designation} · {branchName} · {branchCity}</span>
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
            <HeaderItem icon={UserCircle} label="Admin ID" value={emp.employeeCode || emp.id} />
            <HeaderItem icon={Mail} label="Email" value={user?.email || emp.email} />
            <HeaderItem icon={Phone} label="Phone" value={emp.phone || '—'} />
            <HeaderItem icon={User} label="Role" value={ROLE_LABELS[role] || 'Branch Admin'} />
            <HeaderItem icon={Building} label="Assigned Branch" value={branchName} />
            <HeaderItem icon={MapPin} label="Branch City" value={branchCity} />
          </div>
        </SectionCard>
      </div>

      {/* 2. Quick Actions Row */}
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
        {/* 3. Job Details */}
        <SectionCard title="Job Details" subtitle="Role and branch" icon={Briefcase}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
            <MetaItem label="Designation">{emp.designation}</MetaItem>
            <MetaItem label="Department">{deptName}</MetaItem>
            <MetaItem label="Assigned Branch">{branchName}</MetaItem>
            <MetaItem label="Scope">Branch-level operations</MetaItem>
            <MetaItem label="Joining Date">{prettyDate(emp.joiningDate)}</MetaItem>
            <MetaItem label="Shift">{shiftName}</MetaItem>
          </div>
        </SectionCard>

        {/* 4. Branch Authority */}
        <SectionCard title="Branch Authority" subtitle="What you can do" icon={ShieldCheck}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {AUTHORITY.map((a) => (
              <StatusBadge key={a.label} tone={a.tone} label={a.label} />
            ))}
          </div>
          <p className="ft-note" style={{ marginTop: 16 }}>
            Branch Admin scope: manage employees, attendance, departments &amp; shifts for this branch,
            verify attendance, and generate branch reports. (Org-wide approvals stay with HR.)
          </p>
        </SectionCard>

        {/* 5. Attendance Identity */}
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

        {/* 6. Today Attendance */}
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

        {/* 7. Branch Responsibility Summary */}
        <SectionCard title="Branch Responsibility" subtitle="Your branch, today" icon={CalendarCheck}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetaItem label="Branch Employees">{overview.totalEmployees}</MetaItem>
            <MetaItem label="Attendance">{overview.attendanceRate}%</MetaItem>
            <MetaItem label="Present Today">{overview.present}</MetaItem>
            <MetaItem label="Absent Today">{overview.absent}</MetaItem>
            <MetaItem label="Late Today">{overview.late}</MetaItem>
            <MetaItem label="Departments">{overview.departmentsActive}</MetaItem>
            <MetaItem label="Active Shifts">{overview.shiftsActive}</MetaItem>
            <MetaItem label="Pending Corrections">{overview.pendingCorrections}</MetaItem>
          </div>
        </SectionCard>

        {/* 8. Branch Location & Radius */}
        <SectionCard title="Branch Location & Radius" subtitle="Mock geofence status" icon={MapPin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Branch"><span style={{ fontWeight: 600 }}>{branchName}</span></Row>
            <Row label="Branch ID"><span style={{ fontWeight: 600 }}>{branch?.id || '—'}</span></Row>
            <Row label="City"><span style={{ fontWeight: 600 }}>{branchCity}</span></Row>
            <Row label="Address"><span className="ft-cell-dim" style={{ textAlign: 'right' }}>{branchAddress}</span></Row>
            <Row label="Allowed Radius"><span style={{ fontWeight: 600 }}>{radius}</span></Row>
            <Row label="Location Rule"><StatusBadge tone="success" label="Active" /></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
        </SectionCard>

        {/* 9. Security / Login Info */}
        <SectionCard title="Security / Login Info" subtitle="Session details" icon={KeyRound}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Last Login"><span style={{ fontWeight: 600 }}>{lastLogin}</span></Row>
            <Row label="Account Status"><StatusBadge map={EMPLOYEE_STATUS} value={emp.status} /></Row>
            <Row label="Role Access"><StatusBadge tone="primary" label={ROLE_LABELS[role] || 'Branch Admin'} /></Row>
            <Row label="Session Type"><span style={{ fontWeight: 600 }}>Mock Local Session</span></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
        </SectionCard>
      </div>

      {/* 10. Branch Activity Timeline */}
      <div style={{ marginTop: 24 }}>
        <RecentActivity items={activity} title="Branch Activity Timeline" />
      </div>

      <div className="ft-note" style={{ marginTop: 16 }}>
        <strong>Frontend-only mock mode.</strong> Branch admin identity + branch data come from the shared
        mock store (<code>src/data/</code> → <code>localStorage</code>). No backend / Firebase / API / real GPS.
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        title="Edit Branch Admin Profile"
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
