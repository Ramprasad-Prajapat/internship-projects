// FaceTrack AI — DonutChart. SVG ring; data: [{ label, value, color }].

export default function DonutChart({ data = [], size = 168, thickness = 22, centerLabel = 'Total' }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 0;
  const denom = total || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ft-line)" strokeWidth={thickness} />
          {data.map((d, i) => {
            const len = (d.value / denom) * circ;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color || 'var(--ft-primary)'}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return seg;
          })}
        </g>
        <text x="50%" y="46%" textAnchor="middle" fill="var(--ft-text)" fontSize="24" fontWeight="700">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fill="var(--ft-text-dim)" fontSize="10">
          {centerLabel}
        </text>
      </svg>
      <div className="ft-chart-legend" style={{ flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => (
          <span key={i} className="ft-legend-item">
            <span className="ft-legend-dot" style={{ background: d.color }} />
            {d.label} · <strong style={{ color: 'var(--ft-text)' }}>{d.value}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
