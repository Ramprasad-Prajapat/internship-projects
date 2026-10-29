import React from 'react';
import { cn } from '@/utils/cn';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'lead' | 'body';
  className?: string;
  children?: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  as,
  variant,
  className = '',
  children,
  ...rest
}) => {
  const Component = (as || variant || 'p') as React.ElementType;

  const baseClasses = cn(
    variant === 'h1' && 'text-4xl md:text-5xl font-bold tracking-tight',
    variant === 'h2' && 'text-3xl md:text-4xl font-semibold tracking-tight',
    variant === 'h3' && 'text-2xl md:text-3xl font-medium',
    variant === 'lead' && 'text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300',
    variant === 'p' && 'text-base text-slate-600 dark:text-slate-400 leading-relaxed',
    className
  );

  return (
    <Component className={baseClasses} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
