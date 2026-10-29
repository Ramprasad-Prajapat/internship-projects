// FaceTrack AI — FilterSelect. A dropdown filter with an "all" sentinel ('').

export default function FilterSelect({ value, onChange, options = [], allLabel = 'All', ariaLabel }) {
  return (
    <select className="ft-select" aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((o) =>
        typeof o === 'object' ? (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ) : (
          <option key={o} value={o}>
            {o}
          </option>
        )
      )}
    </select>
  );
}
