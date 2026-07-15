// FaceTrack AI — TrendChart. Multi-series line chart.
// labels: ['Mon', ...]; series: [{ name, color, values: [n, ...] }].

export default function TrendChart({ labels = [], series = [], height = 190 }) {
  const width = 560;
  const pad = 30;
  const maxV = Math.max(1, ...series.flatMap((s) => s.values));
  const stepX = (width - pad * 2) / Math.max(1, labels.length - 1);
  const x = (i) => pad + i * stepX;
  const y = (v) => height - pad - (v / maxV) * (height - pad * 2);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ minWidth: 320 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={pad}
            x2={width - pad}
            y1={pad + t * (height - pad * 2)}
            y2={pad + t * (height - pad * 2)}
            stroke="var(--ft-line)"
          />
        ))}
        {series.map((s, si) => (
          <g key={si}>
            <polyline fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.color} />
            ))}
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fill="var(--ft-text-dim)" fontSize="10">
            {l}
          </text>
        ))}
      </svg>
      <div className="ft-chart-legend">
        {series.map((s, i) => (
          <span key={i} className="ft-legend-item">
            <span className="ft-legend-dot" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
