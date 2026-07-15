// FaceTrack AI — FilterChips. Single-select pill group.
// options: ['all', ...] or [{ value, label }].

export default function FilterChips({ value, onChange, options = [] }) {
  return (
    <div className="ft-chips">
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        return (
          <button
            key={v}
            type="button"
            className={`ft-chip${value === v ? ' ft-chip--active' : ''}`}
            onClick={() => onChange(v)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
