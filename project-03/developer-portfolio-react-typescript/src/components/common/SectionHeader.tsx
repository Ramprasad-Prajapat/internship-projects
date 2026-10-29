import React from 'react';
import { Container } from '@/components/ui/Container';

export interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
  badgeIcon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'left',
  badgeIcon,
}) => {
  return (
<Container className={`space-y-3 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-4xl'}`}>
  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold ${align === 'center' ? 'mx-auto' : ''}`}>
    {badgeIcon}
    <span>{badge}</span>
  </div>
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
    {title}
  </h1>
  <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
    {subtitle}
  </p>
</Container>
  );
};

export default SectionHeader;
