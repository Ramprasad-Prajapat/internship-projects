import React from 'react';
import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

/**
 * Reusable button component with consistent styling.
 * Variants:
 *  - primary: solid background (blue) for primary actions
 *  - secondary: outlined button for secondary actions
 *  - ghost: minimal text button
 */
export const Button: React.FC<ButtonProps> = (
  { children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }
) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 border border-blue-600',
    secondary: 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
};
