// FaceTrack AI — SectionCard. Glass panel with an optional header + actions.

export default function SectionCard({ title, subtitle, icon: Icon, actions, children, className = '' }) {
  return (
    <section className={`ft-section ${className}`}>
      {(title || actions) && (
        <div className="ft-section-head">
          <div>
            {title && (
              <h2 className="ft-section-title">
                {Icon ? <Icon size={17} /> : null}
                {title}
              </h2>
            )}
            {subtitle && <p className="ft-section-sub">{subtitle}</p>}
          </div>
          {actions ? <div className="ft-page-actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
