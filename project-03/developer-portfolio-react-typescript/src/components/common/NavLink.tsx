import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

export interface NavLinkProps {
  to: string;
  label?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  label,
  icon: Icon,
  active,
  onClick,
  children,
  className = '',
}) => {
  const getLabel = () => {
    if (children) return children;
    if (label) return label;
    if (to === '/' || to === '#home') return 'Home';
    const clean = to.replace('/#', '').replace('#', '').replace('/', '');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const isAnchor = to.startsWith('#') || to.startsWith('/#');

  if (isAnchor) {
    const anchorId = to.startsWith('/#') ? to.replace('/', '') : to;
    return (
      <a
        href={anchorId}
        onClick={(e) => {
          if (onClick) onClick();
          const targetId = anchorId.replace('#', '');
          const element = document.getElementById(targetId);
          if (element) {
            e.preventDefault();
            const top = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
            window.history.pushState(null, '', anchorId);
          }
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer',
          active
            ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold border border-blue-600/20 dark:border-blue-500/30 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60',
          className
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{getLabel()}</span>
      </a>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
        active
          ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold border border-blue-600/20 dark:border-blue-500/30 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{getLabel()}</span>
    </Link>
  );
};

export default NavLink;
