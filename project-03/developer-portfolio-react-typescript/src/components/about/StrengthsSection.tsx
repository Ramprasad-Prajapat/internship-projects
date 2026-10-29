import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, HeartHandshake, CheckCircle } from 'lucide-react';
import { coreStrengths, softSkills } from '@/constants/portfolio';
import { fadeIn, staggerContainer } from '@/utils/motion';

export const StrengthsSection: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider uppercase font-bold">
            <Award className="w-4 h-4" />
            <span>Core Competencies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Technical Strengths & Soft Skills
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl">
            Key professional skills refined through engineering coursework, internships, and project builds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Technical Strengths */}
          <motion.div
            variants={fadeIn('right', 0.1)}
            className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-card space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Technical Strengths</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Engineering & Backend Focus</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coreStrengths.map((strength) => (
                <div
                  key={strength.name}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-400 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{strength.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            variants={fadeIn('left', 0.1)}
            className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-card space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Soft Skills</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Collaboration & Work Ethic</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {softSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-400 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
