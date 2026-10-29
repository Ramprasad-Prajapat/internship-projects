import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { ProjectItem } from '@/constants/portfolio';
import { scaleUp } from '@/animations';
import { TechnologyBadge } from '@/components/common/TechnologyBadge';
import { GithubIcon } from '@/components/common/SocialIcons';

interface ProjectCardProps {
  project: ProjectItem;
  onViewDetails: (project: ProjectItem) => void;
  onFilterByTech?: (tech: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onFilterByTech,
}) => {
  return (
    <motion.div
      variants={scaleUp}
      className="p-4.5 sm:p-6 rounded-2xl glass-card glass-card-hover flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        {/* Category & Title */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              {project.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">{project.title}</h3>
          </div>
          {project.featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 shrink-0">
              ★ Featured
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Key Features Preview */}
        <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          {project.features.slice(0, 2).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Tech Stack Pills */}
        <div className="pt-1 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <TechnologyBadge
              key={tech}
              name={tech}
              onClick={onFilterByTech}
            />
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={() => onViewDetails(project)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>Case Study & Architecture</span>
        </button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Live Demo"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
