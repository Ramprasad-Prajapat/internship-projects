import React from 'react';
import { Server, Database, Code2, Layers, ArrowRight, ArrowDown } from 'lucide-react';

interface ProjectArchitectureDiagramProps {
  techStack: string[];
  title: string;
}

export const ProjectArchitectureDiagram: React.FC<ProjectArchitectureDiagramProps> = ({ techStack, title }) => {
  const steps = [
    { label: 'Client UI', tech: techStack.includes('React.js') ? 'React.js SPA' : 'Client Interface', icon: Code2 },
    { label: 'API Layer', tech: 'RESTful Endpoints', icon: Layers },
    { label: 'Backend Logic', tech: techStack.includes('Spring Boot') ? 'Spring Boot Microservice' : 'Server Controller & Service', icon: Server },
    { label: 'Database', tech: techStack.includes('MySQL') ? 'MySQL Relational DB' : 'Data Storage', icon: Database },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Architecture & Flow — {title}
        </h4>
        <span className="text-[10px] font-mono text-slate-500">Layered System Design</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto" />
                <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">{step.label}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{step.tech}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-center text-slate-400 my-0.5 sm:my-0">
                  <ArrowRight className="w-4 h-4 hidden sm:block" />
                  <ArrowDown className="w-4 h-4 sm:hidden" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectArchitectureDiagram;
