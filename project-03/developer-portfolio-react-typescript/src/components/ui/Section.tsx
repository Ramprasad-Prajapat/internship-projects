import React from 'react';
import type { ReactNode } from 'react';

/**
 * Section wrapper that provides vertical spacing and optional background.
 * Uses the standardized spacing scale (py-6 sm:py-8 lg:py-10) and accepts
 * a custom className for background or additional styles.
 */
export const Section: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <section className={`py-6 sm:py-8 lg:py-10 ${className ?? ''}`}>
      {children}
    </section>
  );
};
