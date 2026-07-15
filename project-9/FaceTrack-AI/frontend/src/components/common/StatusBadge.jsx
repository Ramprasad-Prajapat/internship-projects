// FaceTrack AI — StatusBadge.
// Either <StatusBadge tone="success" label="Active" /> or, with a status map,
// <StatusBadge map={ATTENDANCE_STATUS} value="present" />.

export default function StatusBadge({ tone, label, value, map, children, plain = false }) {
  let t = tone;
  let l = label ?? children;
  if (map && value != null && map[value]) {
    t = map[value].tone;
    l = map[value].label;
  }
  return <span className={`ft-badge ft-badge--${t || 'muted'}${plain ? ' ft-badge--plain' : ''}`}>{l ?? value ?? '—'}</span>;
}
