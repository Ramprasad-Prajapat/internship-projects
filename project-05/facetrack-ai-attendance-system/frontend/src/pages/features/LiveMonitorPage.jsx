// FaceTrack AI — Live Monitor (HR read-mostly).
// At-a-glance view of today's attendance: who is in the office, recent check
// in/out activity, late arrivals, and flagged (suspicious) scans. Data comes
// from the reactive store, so a "Refresh" just reassures the user it's live.

import { useMemo } from 'react';
import { RefreshCw, LogIn, Users, Clock, UserX, ShieldAlert } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  StatusBadge,
  Avatar,
  EmptyState,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { scopeEmployees, scopeAttendance, byId } from '../../services/selectors';
import { ATTENDANCE_STATUS, SCAN_REASON_LABELS } from '../../utils/constants';
import { todayISO, formatMinutes } from '../../utils/dateUtils';

export default function LiveMonitorPage() {
  const { user } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const shifts = useCollection('shifts');
  const suspiciousScans = useCollection('suspiciousScans');

  const scoped = useMemo(() => scopeEmployees(employees, user), [employees, user]);
  const today = todayISO();
  const todays = useMemo(
    () => scopeAttendance(attendance, scoped).filter((a) => a.date === today),
    [attendance, scoped, today],
  );

  // Quick employee lookup for names / shift names.
  const empName = (id) => byId(scoped, id)?.name || byId(employees, id)?.name || 'Unknown';
  const shiftName = (id) => byId(shifts, id)?.name || '—';

  /* ---------- KPI numbers ---------- */
  const checkedIn = useMemo(() => todays.filter((a) => a.checkIn), [todays]);
  const currentlyIn = useMemo(
    () => todays.filter((a) => a.checkIn && !a.checkOut),
    [todays],
  );
  const lateToday = useMemo(() => todays.filter((a) => a.status === 'late'), [todays]);
  const absentToday = useMemo(() => todays.filter((a) => a.status === 'absent'), [todays]);
  const flaggedScans = useMemo(
    () => suspiciousScans.filter((s) => s.status === 'pending'),
    [suspiciousScans],
  );

  /* ---------- "Currently in office" list ---------- */
  const inOffice = useMemo(
    () =>
      currentlyIn
        .map((a) => ({
          id: a.id,
          employeeId: a.employeeId,
          name: empName(a.employeeId),
          color: byId(scoped, a.employeeId)?.avatarColor,
          checkIn: a.checkIn,
          shift: shiftName(a.shiftId),
        }))
        .sort((x, y) => (x.checkIn < y.checkIn ? 1 : -1)),
    [currentlyIn, scoped, employees, shifts],
  );

  /* ---------- Recent activity (last ~8 events by latest time) ---------- */
  const recent = useMemo(() => {
    return checkedIn
      .map((a) => {
        const isOut = Boolean(a.checkOut);
        return {
          id: a.id,
          employeeId: a.employeeId,
          name: empName(a.employeeId),
          color: byId(scoped, a.employeeId)?.avatarColor,
          action: isOut ? 'Checked out' : 'Checked in',
          time: isOut ? a.checkOut : a.checkIn,
          // sort key: latest of the two stamps
          sortTime: isOut ? a.checkOut : a.checkIn,
          status: a.status,
        };
      })
      .sort((x, y) => (x.sortTime < y.sortTime ? 1 : -1))
      .slice(0, 8);
  }, [checkedIn, scoped, employees]);

  /* ---------- Late today list ---------- */
  const lateList = useMemo(
    () =>
      lateToday
        .map((a) => ({
          id: a.id,
          name: empName(a.employeeId),
          color: byId(scoped, a.employeeId)?.avatarColor,
          checkIn: a.checkIn,
          lateMinutes: a.lateMinutes || 0,
        }))
        .sort((x, y) => y.lateMinutes - x.lateMinutes),
    [lateToday, scoped, employees],
  );

  /* ---------- Flagged scans list ---------- */
  const flaggedList = useMemo(
    () =>
      flaggedScans
        .map((s) => ({
          id: s.id,
          name: s.employeeId ? empName(s.employeeId) : 'Unknown',
          color: s.employeeId ? byId(scoped, s.employeeId)?.avatarColor : undefined,
          reason: SCAN_REASON_LABELS[s.reason] || s.reason,
          confidence: typeof s.confidence === 'number' ? Math.round(s.confidence * 100) : null,
          time: s.time,
        }))
        .sort((x, y) => (x.time < y.time ? 1 : -1)),
    [flaggedScans, scoped, employees],
  );

  const handleRefresh = () => toast.info('Live data is already up to date.');

  return (
    <section className="ft-page">
      <PageHeader
        title="Live Monitor"
        subtitle="Real-time view of today's attendance, presence, and flagged scans."
        actions={
          <button className="ft-btn ft-btn--ghost" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />

      {/* KPI row */}
      <div className="ft-kpi-grid">
        <MetricCard icon={LogIn} label="Checked in" value={checkedIn.length} tone="primary" />
        <MetricCard icon={Users} label="Currently in" value={currentlyIn.length} tone="success" />
        <MetricCard icon={Clock} label="Late today" value={lateToday.length} tone="warning" />
        <MetricCard icon={UserX} label="Absent today" value={absentToday.length} tone="danger" />
        <MetricCard icon={ShieldAlert} label="Suspicious" value={flaggedScans.length} tone="accent" />
      </div>

      {/* Presence + activity */}
      <div className="ft-grid-2">
        <SectionCard
          title="Currently in office"
          subtitle={`${inOffice.length} on site`}
          icon={Users}
        >
          {inOffice.length === 0 ? (
            <EmptyState title="Nobody is checked in" message="Active employees will appear here once they check in." />
          ) : (
            <ul className="ft-list ft-list--rows">
              {inOffice.map((p) => (
                <li className="ft-list-row" key={p.id}>
                  <div className="ft-id-cell">
                    <Avatar name={p.name} color={p.color} size="sm" />
                    <div>
                      <div className="ft-id-name">{p.name}</div>
                      <div className="ft-id-sub">{p.shift}</div>
                    </div>
                  </div>
                  <div className="ft-cell-strong">{p.checkIn}</div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent activity" subtitle="Latest check-ins and check-outs" icon={Clock}>
          {recent.length === 0 ? (
            <EmptyState title="No activity yet" message="Today's check-in and check-out events will show here." />
          ) : (
            <ul className="ft-list ft-list--rows">
              {recent.map((r) => (
                <li className="ft-list-row" key={r.id}>
                  <div className="ft-id-cell">
                    <Avatar name={r.name} color={r.color} size="sm" />
                    <div>
                      <div className="ft-id-name">{r.name}</div>
                      <div className="ft-id-sub">
                        {r.action} • {r.time}
                      </div>
                    </div>
                  </div>
                  <StatusBadge map={ATTENDANCE_STATUS} value={r.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Late + flagged */}
      <div className="ft-grid-2">
        <SectionCard title="Late today" subtitle={`${lateList.length} late arrivals`} icon={Clock}>
          {lateList.length === 0 ? (
            <EmptyState title="No late arrivals" message="Everyone who checked in was on time." />
          ) : (
            <ul className="ft-list ft-list--rows">
              {lateList.map((l) => (
                <li className="ft-list-row" key={l.id}>
                  <div className="ft-id-cell">
                    <Avatar name={l.name} color={l.color} size="sm" />
                    <div>
                      <div className="ft-id-name">{l.name}</div>
                      <div className="ft-id-sub">In at {l.checkIn || '—'}</div>
                    </div>
                  </div>
                  <StatusBadge tone="warning" label={formatMinutes(l.lateMinutes)} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Flagged scans"
          subtitle={`${flaggedList.length} pending review`}
          icon={ShieldAlert}
        >
          {flaggedList.length === 0 ? (
            <EmptyState title="No flagged scans" message="Suspicious scans awaiting review will appear here." />
          ) : (
            <ul className="ft-list ft-list--rows">
              {flaggedList.map((f) => (
                <li className="ft-list-row" key={f.id}>
                  <div className="ft-id-cell">
                    <Avatar name={f.name} color={f.color} size="sm" />
                    <div>
                      <div className="ft-id-name">{f.name}</div>
                      <div className="ft-id-sub">
                        {f.reason} • {f.time}
                      </div>
                    </div>
                  </div>
                  <StatusBadge
                    tone="danger"
                    label={f.confidence != null ? `${f.confidence}%` : '—'}
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </section>
  );
}
