import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, MapPin, Briefcase, GraduationCap, Download, Mail, ArrowRight } from 'lucide-react';
import { personalInfo } from '@/constants/portfolio';

export const RecruiterQuickView: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 shadow-sm space-y-6 my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Recruiter Snapshot
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {personalInfo.name} — Candidate Summary
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{personalInfo.availability}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Positioning */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Target Positioning</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {personalInfo.title}
          </p>
        </div>

        {/* Education & CGPA */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Education & CGPA</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            B.Tech CSE (CGPA: {personalInfo.cgpa})
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{personalInfo.institution}</p>
        </div>

        {/* Current Experience */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Current Experience</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Web Development Intern
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Digital Hammerr® (On-site)</p>
        </div>

        {/* Location */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Location</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {personalInfo.location}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Java • Spring Boot • React.js • MySQL • REST APIs • Git & GitHub
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/resume"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View Resume</span>
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Contact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterQuickView;
