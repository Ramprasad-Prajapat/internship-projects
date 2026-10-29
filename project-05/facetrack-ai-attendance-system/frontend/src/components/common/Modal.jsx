// FaceTrack AI — Modal (overhaul). Closes on Escape + backdrop click.

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, size = 'md', children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ft-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`ft-modal${size === 'lg' ? ' ft-modal--lg' : ''}`} role="dialog" aria-modal="true">
        <div className="ft-modal-head">
          <h3 className="ft-modal-title">{title}</h3>
          <button className="ft-icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="ft-modal-body">{children}</div>
        {footer ? <div className="ft-modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}
