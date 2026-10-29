// FaceTrack AI — ConnectedNextActions.
// A shared "next steps / related pages" panel so no page is a dead end. Each
// action is a {icon, label, hint, to, tone} link. Pass absolute paths (build
// role-aware targets with ROLE_BASE[role]). Falsy entries are filtered, so
// callers can inline conditionals: actions={[a, role==='hr' && b]}.
//
// Reuses the existing .ft-home-action* card styling (see theme.css).

import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import SectionCard from './SectionCard';

export default function ConnectedNextActions({
  title = 'Next steps',
  subtitle = 'Related pages and quick actions',
  icon = Compass,
  actions = [],
}) {
  const items = actions.filter(Boolean);
  if (!items.length) return null;

  return (
    <SectionCard title={title} subtitle={subtitle} icon={icon}>
      <div className="ft-home-actions">
        {items.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label + a.to}
              to={a.to}
              className={`ft-home-action ft-home-action--${a.tone || 'primary'}`}
            >
              <span className="ft-home-action-icon">{Icon ? <Icon size={18} /> : <ArrowRight size={18} />}</span>
              <span className="ft-home-action-label">
                {a.label}
                {a.hint ? <span className="ft-cna-hint">{a.hint}</span> : null}
              </span>
              <ArrowRight size={16} className="ft-home-action-arrow" />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
