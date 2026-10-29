import { useEffect, useState, useRef } from 'react';

/**
 * Hook to detect scroll direction ("up" or "down").
 * It debounces updates using requestAnimationFrame to avoid rapid state churn and applies
 * configurable thresholds to prevent flickering on small scroll movements.
 * Near the top of the page (< 70px) it always returns "up" so the navbar stays visible.
 */
export const useScrollDirection = (
  downThreshold = 5,
  upThreshold = 2,
  topVisibilityThreshold = 50,
): 'up' | 'down' => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastY = useRef<number>(window.scrollY);
  const ticking = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Near the top – always show navbar (treated as "up")
      if (currentY < topVisibilityThreshold) {
        if (direction !== 'up') setDirection('up');
        lastY.current = currentY;
        ticking.current = false;
        return;
      }

      const diff = currentY - lastY.current;

      if (Math.abs(diff) < Math.min(downThreshold, upThreshold)) {
        // Movement too small – ignore to prevent jitter
        ticking.current = false;
        return;
      }

      if (diff > downThreshold) {
        if (direction !== 'down') setDirection('down');
        lastY.current = currentY;
      } else if (diff < -upThreshold) {
        if (direction !== 'up') setDirection('up');
        lastY.current = currentY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [direction, downThreshold, upThreshold, topVisibilityThreshold]);

  return direction;
};
