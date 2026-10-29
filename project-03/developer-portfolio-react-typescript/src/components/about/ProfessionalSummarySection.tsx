import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Layout, ShieldCheck, Cpu } from 'lucide-react';
import { engineeringPhilosophy } from '@/constants/portfolio';
import { fadeIn, staggerContainer } from '@/animations';

export const ProfessionalSummarySection: React.FC = () => {
  const getPhilosophyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <section className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider uppercase font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Professional Strengths & Focus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineering Philosophy & Values
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl">
            As a final-year Computer Science Engineering student, my focus centers on building reliable backend APIs with Spring Boot and intuitive web apps with React.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {engineeringPhilosophy.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="p-5 rounded-2xl glass-card space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
                {getPhilosophyIcon(item.iconName)}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
