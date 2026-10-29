// FaceTrack AI — StatCard (Phase 1 placeholder).
// Glassmorphic analytics tile. Values are static placeholders until data
// wiring arrives in later phases.

export default function StatCard({ label, value = '—', tone = 'primary' }) {
  return (
    <div className={`ft-stat ft-stat--${tone}`}>
      <span className="ft-stat-value">{value}</span>
      <span className="ft-stat-label">{label}</span>
    </div>
  );
}
