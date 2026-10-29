import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { experienceData, personalInfo } from '@/constants/portfolio';
import { staggerContainer, staggerItem } from '@/animations';
import { Reveal } from '@/components/common/Reveal';

export const Experience: React.FC = () => {
  return (
    <>
      <Seo
        title="Professional Experience"
        description={`Explore the work experience and internship history of ${personalInfo.name}, Java Full Stack Developer.`}
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <SectionHeader
          badge="Career Timeline"
          badgeIcon={<Briefcase className="w-4 h-4" />}
          title="Professional Experience"
          subtitle="Demonstrated history of web development, software engineering, and collaborative project execution."
        />

        {/* Experience Timeline */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {experienceData.map((exp) => (
              <motion.div
                key={exp.id}
                variants={staggerItem}
                className="p-6 rounded-2xl glass-card space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        {exp.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{exp.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">{exp.role}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{exp.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {exp.description}
                </p>

                {/* Responsibilities */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Key Responsibilities & Outcomes:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {(exp.responsibilities || exp.bullets || []).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Footer Banner */}
        <Reveal>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Looking for a Java / Full Stack Developer candidate?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-lg mx-auto">
              View engineering projects or download my full resume for complete details.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link
                to="/projects"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/resume"
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Download PDF Resume
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};

export default Experience;
