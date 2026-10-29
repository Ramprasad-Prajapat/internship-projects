import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/utils/cn';
import { NotificationContext } from './NotificationContextTypes';
import type { Toast, ToastVariant } from './NotificationContextTypes';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = uuidv4();
      setToasts((prev) => [...prev, { id, ...toast }]);
      const duration = toast.duration ?? 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </NotificationContext.Provider>
  );
};

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) => (
  <AnimatePresence>
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="pointer-events-auto"
        >
          <ToastItem toast={toast} onClose={() => onDismiss(toast.id)} />
        </motion.div>
      ))}
    </div>
  </AnimatePresence>
);

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-slate-800 text-white border-slate-700',
  success: 'bg-emerald-950/90 text-emerald-100 border-emerald-500/30',
  error: 'bg-rose-950/90 text-rose-100 border-rose-500/30',
  info: 'bg-sky-950/90 text-sky-100 border-sky-500/30',
  warning: 'bg-amber-950/90 text-amber-100 border-amber-500/30',
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const { title, description, variant = 'default' } = toast;
  return (
    <div className={cn('rounded-xl border backdrop-blur-md p-4 shadow-xl text-sm flex items-start justify-between gap-3', variantClasses[variant])}>
      <div>
        <h4 className="font-semibold">{title}</h4>
        {description && <p className="opacity-80 text-xs mt-1 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 transition-opacity p-1"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};
