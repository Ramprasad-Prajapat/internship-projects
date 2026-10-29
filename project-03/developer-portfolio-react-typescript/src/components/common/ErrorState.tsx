import React from 'react';

/**
 * Simple error display component.
 * Shows a message and optional retry button.
 */
export interface ErrorStateProps {
  /** Error message to display */
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
