import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Optional icon component to render before children */
  startIcon?: React.ReactNode;
  /** Optional icon component to render after children */
  endIcon?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Reusable button component with multiple visual variants.
 * Uses Tailwind utilities for consistent styling across the app.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  children,
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors duration-200';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md shadow-blue-500/20',
    secondary: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm',
    outline: 'border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(baseClasses, variantClasses, widthClass, className)}
      {...rest}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
