import { useEffect, useState } from 'react';

/**
 * Hook that returns true if the user prefers reduced motion.
 * It listens to changes in the media query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mediaQuery.matches);
    handler();
    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return reduced;
}
