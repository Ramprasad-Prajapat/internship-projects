import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <Inbox className="w-12 h-12 text-slate-400 dark:text-slate-500" />,
}) => {
  return (
    <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-all shadow-md shadow-blue-600/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
