// FaceTrack AI — Toast notifications (frontend-only mode).
// Lightweight provider; call useToast() then toast.success/error/info/warning().

import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);
const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(() => dismiss(id), opts.duration ?? 3200);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      success: (m, o) => push('success', m, o),
      error: (m, o) => push('error', m, o),
      info: (m, o) => push('info', m, o),
      warning: (m, o) => push('warning', m, o),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="ft-toast-wrap">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div key={t.id} className={`ft-toast ft-toast--${t.type}`} role="status">
              <Icon size={18} className="ft-toast-ico" />
              <span className="ft-toast-msg">{t.message}</span>
              <button className="ft-toast-x" type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}

export default ToastContext;
