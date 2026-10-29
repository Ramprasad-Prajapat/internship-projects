import React from 'react';

export interface TechnologyBadgeProps {
  name: string;
  onClick?: (name: string) => void;
  active?: boolean;
  size?: 'sm' | 'md';
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({
  name,
  onClick,
  active = false,
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm';

  const baseClasses = `inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all ${sizeClasses} ${
    onClick ? 'cursor-pointer select-none' : ''
  } ${
    active
      ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 hover:text-blue-600 dark:hover:text-white'
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(name)}
        className={baseClasses}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-blue-500'}`} />
        {name}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-blue-500'}`} />
      {name}
    </span>
  );
};

export default TechnologyBadge;
