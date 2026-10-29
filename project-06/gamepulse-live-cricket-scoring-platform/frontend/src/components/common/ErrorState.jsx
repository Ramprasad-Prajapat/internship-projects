
/**
 * ErrorState component for displaying API or UI errors.
 * Props:
 *   error: string – error message to show
 *   onRetry?: () => void – optional retry callback
 */
export const ErrorState = ({ error, onRetry }) => (
  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
    ⚠️ {error}
    {onRetry && (
      <button
        onClick={onRetry}
        className="ml-2 underline text-rose-300 hover:text-rose-200"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
