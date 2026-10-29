import { useEffect, useRef } from 'react';

/**
 * Accessible confirmation dialog.
 * Props:
 *   title: string – dialog title
 *   description: string – message body
 *   onConfirm: () => void – called when user confirms
 *   onCancel: () => void – called when user cancels or presses Escape
 */
export const ConfirmationDialog = ({ title, description, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  // Focus first button on open and trap Escape
  useEffect(() => {
    const firstBtn = dialogRef.current?.querySelector('button');
    firstBtn && firstBtn.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
        ref={dialogRef}
      >
        <h2 id="confirm-dialog-title" className="text-xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-slate-300 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
