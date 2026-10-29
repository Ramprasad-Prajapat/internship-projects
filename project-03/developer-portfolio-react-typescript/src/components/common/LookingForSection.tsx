import React from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, MapPin, ArrowRight, Download } from 'lucide-react';
import { personalInfo } from '@/constants/portfolio';

export const LookingForSection: React.FC = () => {
  const targetRoles = [
    'Software Engineer (SDE I / Graduate)',
    'Java Full Stack Developer',
    'Backend Engineer (Java & Spring Boot)',
    'Web Development Intern / Co-op',
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-card space-y-6 my-10">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Opportunity Focus
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              What I Am Looking For
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{personalInfo.location} (Open to Relocation / Remote)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Actively seeking entry-level software engineering positions, Java full-stack developer roles, and backend engineering opportunities where I can apply Java, Spring Boot, React, and clean architectural principles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {targetRoles.map((role) => (
              <div key={role} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-4 text-center lg:text-left">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 block">Current Status</span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{personalInfo.academicStatus}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{personalInfo.availability}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <Link
              to="/resume"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>View Resume</span>
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForSection;
