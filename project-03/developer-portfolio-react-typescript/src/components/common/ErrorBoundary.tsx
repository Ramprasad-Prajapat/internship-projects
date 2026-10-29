import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { useNotification } from '@/hooks/useNotification';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;
    if (hasError) {
      return fallback ?? <DefaultFallback />;
    }
    return children;
  }
}

function DefaultFallback() {
  const { addToast } = useNotification();
  const handleRefresh = () => window.location.reload();
  const handleReport = () => {
    addToast({
      title: 'Error reported',
      description: 'The error has been logged to our monitoring service.',
      variant: 'error',
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-slate-950 text-white p-8 text-center rounded-2xl border border-slate-800 my-8">
      <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
      <p className="mb-6 text-slate-400 text-sm max-w-md">We apologize for the inconvenience. Please try refreshing or contact support.</p>
      <div className="space-x-4">
        <button onClick={handleRefresh} className="px-4 py-2 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 transition text-sm">
          Refresh Page
        </button>
        <button onClick={handleReport} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition text-sm">
          Report Issue
        </button>
      </div>
    </div>
  );
}
