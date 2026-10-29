import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import type { CertificationItem } from '@/constants/portfolio';
import { scaleUp } from '@/utils/motion';
import { TechnologyBadge } from '@/components/common/TechnologyBadge';

interface CertificationCardProps {
  cert: CertificationItem;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ cert }) => {
  return (
    <motion.div
      variants={scaleUp}
      className="p-6 sm:p-7 rounded-3xl glass-card glass-card-hover border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-card hover:shadow-lift transition-all"
    >
      <div className="space-y-4">
        {/* Organization Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{cert.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{cert.organization}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 w-fit">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Issued: {cert.issueDate}</span>
        </div>

        {/* Verified Skills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Verified Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.map((skill) => (
              <TechnologyBadge key={skill} name={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {cert.credentialUrl && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-600/20 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700/60 text-xs font-bold transition-all"
          >
            <span>Verify Credential</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
};
