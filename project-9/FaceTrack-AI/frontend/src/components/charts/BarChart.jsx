// FaceTrack AI — BarChart. Vertical bars; data: [{ label, value, color? }].

export default function BarChart({ data = [], height = 150 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="ft-bar-track" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="ft-bar-col">
          <span className="ft-bar-value">{d.value}</span>
          <div
            className="ft-bar"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: d.color ? `linear-gradient(180deg, ${d.color}, ${d.color}22)` : undefined,
            }}
          />
          <span className="ft-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
