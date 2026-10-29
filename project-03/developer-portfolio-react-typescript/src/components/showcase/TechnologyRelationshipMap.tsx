import React from 'react';
import { GitFork, Code2, Server, Terminal, ArrowRight } from 'lucide-react';

export const TechnologyRelationshipMap: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-card space-y-8 my-10">
      {/* Header */}
      <div className="space-y-2 text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
          <GitFork className="w-4 h-4" />
          <span>Technology Relationship Ecosystem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          How My Tech Stack Connects
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          A clear map showing how Java backend services, React frontends, relational databases, and developer tooling integrate together.
        </p>
      </div>

      {/* Map Branches */}
      <div className="space-y-6">
        {/* Branch 1: Java Backend */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase">
            <Server className="w-4 h-4" />
            <span>Java Backend Stack</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['Java 21', 'Spring Framework', 'Spring Boot 3', 'Spring Security', 'REST APIs', 'Spring Data JPA', 'MySQL'].map((tech, idx, arr) => (
              <React.Fragment key={tech}>
                <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                  {tech}
                </span>
                {idx < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Branch 2: Frontend */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 font-mono uppercase">
            <Code2 className="w-4 h-4" />
            <span>Frontend & Client Stack</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['JavaScript / ES6+', 'TypeScript', 'React.js', 'React Router', 'Tailwind CSS', 'Framer Motion', 'Axios Architecture'].map((tech, idx, arr) => (
              <React.Fragment key={tech}>
                <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                  {tech}
                </span>
                {idx < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Branch 3: Tooling & Testing */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase">
            <Terminal className="w-4 h-4" />
            <span>Developer Tooling & Workflows</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['Git', 'GitHub', 'Postman API Testing', 'IntelliJ IDEA', 'VS Code', 'Zod Validation'].map((tech, idx, arr) => (
              <React.Fragment key={tech}>
                <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                  {tech}
                </span>
                {idx < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyRelationshipMap;
