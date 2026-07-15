// FaceTrack AI — PlaceholderChart (Phase 1).
// Decorative glass panel standing in for a real chart (Recharts) that will be
// wired in Phase 6 (Reports/Analytics). Renders static bars only.

export default function PlaceholderChart({ title = 'Chart' }) {
  const bars = [42, 68, 30, 80, 55, 72, 48];
  return (
    <div className="ft-glass ft-chart">
      <div className="ft-chart-title">{title}</div>
      <div className="ft-chart-bars">
        {bars.map((h, i) => (
          <span key={i} className="ft-chart-bar" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="ft-chart-note">Demo data · charts arrive in Phase 6</div>
    </div>
  );
}
