import React from 'react';
import type { ReactNode } from 'react';

/**
 * Generic container that limits width and provides consistent horizontal padding.
 * Uses the same max‑width and padding as the rest of the site (max‑w-7xl, px-4‑sm:px-6‑lg:px-8).
 */
export const Container: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className ?? ''}`}>
      {children}
    </div>
  );
};
