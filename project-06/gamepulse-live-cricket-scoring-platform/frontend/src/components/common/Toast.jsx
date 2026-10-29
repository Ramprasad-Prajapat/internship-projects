
/**
 * Simple toast notification.
 * Props:
 *   message: string – toast text
 *   onClose: () => void – callback to dismiss
 */
export const Toast = ({ message, onClose }) => (
  <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-sm shadow-xl flex items-center justify-between animate-fade-in fixed top-4 right-4 z-50 max-w-xs">
    <span>{message}</span>
    <button onClick={onClose} className="text-xs text-cyan-400 hover:text-white ml-2">✕</button>
  </div>
);

export default Toast;
