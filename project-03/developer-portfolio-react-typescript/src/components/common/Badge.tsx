import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Additional custom class names */
  className?: string;
  /** Content of the badge */
  children: React.ReactNode;
  /** Variant style */
  variant?: 'solid' | 'outline';
}

/**
 * Reusable badge component with variant support.
 */
export const Badge: React.FC<BadgeProps> = ({ className = '', children, variant = 'solid', ...rest }) => {
  const baseClasses =
    variant === 'solid'
      ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
      : 'inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-sm';

  return (
    <span className={cn(baseClasses, className)} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
