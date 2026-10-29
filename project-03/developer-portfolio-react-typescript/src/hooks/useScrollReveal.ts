import { useEffect, useState, useRef } from 'react';

/**
 * Hook that returns a ref and a boolean indicating whether the element is currently in view.
 * Uses IntersectionObserver for bidirectional reveal (reveals when scrolling down into view,
 * reverses/hides when scrolling up out of view).
 * Automatically respects user's reduced motion preference.
 */
export const useScrollReveal = (options?: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Continuously update visibility based on viewport intersection
          setIsVisible(entry.isIntersecting);
        });
      },
      options ?? { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [options]);

  return { ref, isVisible };
};
