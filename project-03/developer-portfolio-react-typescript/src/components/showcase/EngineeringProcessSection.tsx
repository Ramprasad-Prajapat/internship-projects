import React from 'react';
import { motion } from 'framer-motion';
import { Workflow, CheckCircle2, ArrowRight } from 'lucide-react';
import { engineeringProcessSteps } from '@/constants/portfolio';

export const EngineeringProcessSection: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-card space-y-8 my-10">
      {/* Header */}
      <div className="space-y-2 text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Workflow className="w-4 h-4" />
          <span>Engineering Approach</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          How I Approach Software Projects
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          A systematic 6-step methodology focused on requirements gathering, clean architecture, REST API design, responsive UI, and quality testing.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineeringProcessSteps.map((step) => (
          <motion.div
            key={step.step}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                  0{step.step}
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Phase {step.step}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {step.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {step.keyDeliverable}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EngineeringProcessSection;
