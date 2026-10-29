import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { LoadingContext } from './LoadingContextTypes';

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleEnd = () => setLoading(false);
    window.addEventListener('route-change-start', handleStart as EventListener);
    window.addEventListener('route-change-end', handleEnd as EventListener);
    return () => {
      window.removeEventListener('route-change-start', handleStart as EventListener);
      window.removeEventListener('route-change-end', handleEnd as EventListener);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
