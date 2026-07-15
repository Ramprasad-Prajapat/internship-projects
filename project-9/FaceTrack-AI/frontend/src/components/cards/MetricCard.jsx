// FaceTrack AI — MetricCard. Stat tile with icon, value, label and optional delta.

export default function MetricCard({ icon: Icon, label, value, tone = 'primary', delta }) {
  return (
    <div className={`ft-metric ft-metric--${tone}`}>
      <div className="ft-metric-top">
        <span className="ft-metric-value">{value}</span>
        {Icon ? (
          <span className="ft-metric-ico">
            <Icon size={19} />
          </span>
        ) : null}
      </div>
      <span className="ft-metric-label">{label}</span>
      {delta ? <span className={`ft-metric-delta ft-metric-delta--${delta.dir || 'up'}`}>{delta.text}</span> : null}
    </div>
  );
}
