import React from 'react';
import { GitCommit, CheckCircle2 } from 'lucide-react';
import type { ProjectChangelogEntry } from '@/constants/portfolio';

interface ProjectChangelogProps {
  entries?: ProjectChangelogEntry[];
}

export const ProjectChangelog: React.FC<ProjectChangelogProps> = ({ entries }) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
        <GitCommit className="w-4 h-4" />
        <span>Project Release Changelog</span>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.version} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {entry.version}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{entry.date}</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
              {entry.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectChangelog;
