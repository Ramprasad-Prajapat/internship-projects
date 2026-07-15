// FaceTrack AI — PageHeader. Title + optional subtitle and right-aligned actions.

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="ft-page-head">
      <div>
        <h1 className="ft-page-title">{title}</h1>
        {subtitle ? <p className="ft-page-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ft-page-actions">{actions}</div> : null}
    </div>
  );
}
