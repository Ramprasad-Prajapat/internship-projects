// FaceTrack AI — Form field primitives.
// <Field> is the labeled wrapper; TextField/TextAreaField/SelectField are
// convenience inputs. All render the shared .ft-field markup.

export function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <label className={`ft-field${error ? ' ft-field--error' : ''}`} htmlFor={htmlFor}>
      {label && (
        <span>
          {label}
          {required ? <span style={{ color: 'var(--ft-red)' }}> *</span> : null}
        </span>
      )}
      {children}
      {error ? (
        <span className="ft-field-error">{error}</span>
      ) : hint ? (
        <span className="ft-field-hint">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextField({ label, error, hint, required, ...rest }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      <input {...rest} />
    </Field>
  );
}

export function TextAreaField({ label, error, hint, required, ...rest }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      <textarea {...rest} />
    </Field>
  );
}

export function SelectField({ label, error, hint, required, options = [], placeholder, ...rest }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      <select {...rest}>
        {placeholder != null && <option value="">{placeholder}</option>}
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
    </Field>
  );
}

export default Field;
