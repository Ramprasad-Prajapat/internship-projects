import React, { useEffect } from 'react';
import { X, ExternalLink, Cpu, Layers, HelpCircle, CheckCircle2, AlertTriangle, Lightbulb, Rocket } from 'lucide-react';
import type { ProjectItem } from '@/constants/portfolio';
import { TechnologyBadge } from '@/components/common/TechnologyBadge';
import { GithubIcon } from '@/components/common/SocialIcons';
import { ProjectArchitectureDiagram } from '@/components/showcase/ProjectArchitectureDiagram';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  // ESC listener and body scroll lock
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.classList.add('overflow-hidden');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-10">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
            {project.category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{project.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{project.fullDescription}</p>
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Technology Stack</span>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechnologyBadge key={tech} name={tech} />
            ))}
          </div>
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Problem Statement</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{project.problemStatement}</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Engineered Solution</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Architecture Overview</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{project.architectureOverview}</p>
        </div>

        {/* Visual Architecture Diagram */}
        <ProjectArchitectureDiagram techStack={project.techStack} title={project.title} />

        {/* System Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Key System Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-1.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges & Learnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Engineering Challenges
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {project.challenges.map((c, i) => (
                <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">• {c}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Key Learnings
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {project.learnings.map((l, i) => (
                <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">• {l}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Future Improvements */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
            <Rocket className="w-4 h-4" />
            Future Roadmap
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.futureImprovements.map((imp, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 text-xs font-medium">
                🚀 {imp}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Code</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            Close Case Study
          </button>
        </div>

      </div>
    </div>
  );
};
