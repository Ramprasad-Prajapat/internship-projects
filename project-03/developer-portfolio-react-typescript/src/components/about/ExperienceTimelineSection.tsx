import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2, MapPin } from 'lucide-react';
import { experienceData } from '@/constants/portfolio';
import { slideUp, staggerContainer } from '@/animations';

export const ExperienceTimelineSection: React.FC = () => {
  return (
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-5 sm:space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider uppercase font-bold">
            <Briefcase className="w-4 h-4" />
            <span>Career Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Professional Experience
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl">
            Practical web application development, API integration, and database management experience.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 sm:ml-4 space-y-6 sm:space-y-8 pl-3.5 sm:pl-8">
          {experienceData.map((exp) => (
            <motion.div
              key={exp.id}
              variants={slideUp}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[21px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-600 ring-4 ring-slate-50 dark:ring-slate-900 group-hover:scale-110 transition-transform" />

              <div className="p-4 sm:p-6 rounded-2xl glass-card space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {exp.role}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        {exp.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-xs mt-1 font-semibold flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {exp.organization}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-mono mr-1">
                    Stack:
                  </span>
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
