import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, BookOpen, Award } from 'lucide-react';
import { educationData } from '@/constants/portfolio';
import { slideUp, staggerContainer } from '@/animations';

export const EducationSection: React.FC = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider uppercase font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Qualification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Education & Academic Foundation
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl">
            {educationData.degree} at {educationData.institution}.
          </p>
        </div>

        <motion.div
          variants={slideUp}
          className="p-6 sm:p-8 rounded-2xl glass-card space-y-6"
        >
          {/* Degree & Institution */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {educationData.degree}
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                  {educationData.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>CGPA: {educationData.cgpa}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 pt-1">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{educationData.institution}</span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {educationData.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{educationData.duration}</span>
            </div>
          </div>

          {/* Relevant Learning Course Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Relevant Coursework & Fundamentals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {educationData.relevantLearning.map((subject) => (
                <div
                  key={subject}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{subject}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
