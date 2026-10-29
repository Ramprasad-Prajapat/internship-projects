import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional shadow style: default, hover, none */
  shadow?: 'default' | 'hover' | 'none';
  /** Optional border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  /** Extra class names */
  className?: string;
  /** Card header content */
  header?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
}

/**
 * Reusable Card component with configurable shadow, radius, header and footer slots.
 */
export const Card: React.FC<CardProps> = ({
  shadow = 'default',
  rounded = 'lg',
  className = '',
  header,
  footer,
  children,
  ...rest
}) => {
  const baseClasses = cn(
    'bg-white dark:bg-slate-900 overflow-hidden',
    shadow === 'default' && 'shadow-card',
    shadow === 'hover' && 'shadow-card hover:shadow-lift transition-shadow duration-200',
    shadow === 'none' && 'shadow-none',
    {
      sm: 'rounded-xl',
      md: 'rounded-2xl',
      lg: 'rounded-3xl',
      full: 'rounded-full',
    }[rounded],
    className,
  );

  return (
    <div className={baseClasses} {...rest}>
      {header && <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">{footer}</div>}
    </div>
  );
};

export default Card;
