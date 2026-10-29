import React from 'react';
import { cn } from '@/utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  className = '',
  children,
  size = 'lg',
  ...rest
}) => {
  const maxWidthClass = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  }[size];

  return (
    <Component
      className={cn(maxWidthClass, 'mx-auto px-4 sm:px-6 lg:px-8 w-full', className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Container;
