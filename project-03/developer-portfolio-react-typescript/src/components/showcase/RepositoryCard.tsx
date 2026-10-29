import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Calendar } from 'lucide-react';
import type { GitHubRepoItem } from '@/constants/portfolio';
import { scaleUp } from '@/utils/motion';
import { GithubIcon } from '@/components/common/SocialIcons';

interface RepositoryCardProps {
  repo: GitHubRepoItem;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo }) => {
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'java':
        return 'bg-amber-500';
      case 'javascript':
        return 'bg-yellow-400';
      case 'typescript':
        return 'bg-blue-500';
      case 'html':
        return 'bg-orange-500';
      default:
        return 'bg-blue-400';
    }
  };

  return (
    <motion.div
      variants={scaleUp}
      className="p-6 sm:p-7 rounded-3xl glass-card glass-card-hover border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-card hover:shadow-lift transition-all"
    >
      <div className="space-y-3">
        {/* Repo Title & Link */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <GithubIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
            >
              {repo.name}
            </a>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Repository"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {repo.description}
        </p>

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/40"
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
          <span className="text-slate-700 dark:text-slate-200 font-semibold">{repo.language}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-indigo-500" />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 hidden sm:flex">
            <Calendar className="w-3 h-3" />
            <span>{repo.updatedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
