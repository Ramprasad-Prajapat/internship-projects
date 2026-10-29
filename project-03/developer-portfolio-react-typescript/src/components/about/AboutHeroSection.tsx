import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowUpRight, MapPin, Building2, Sparkles } from 'lucide-react';
import { personalInfo, heroData, ctaLinks, socialLinks } from '@/constants/portfolio';
import { slideUp } from '@/animations';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon } from '@/components/common/SocialIcons';

export const AboutHeroSection: React.FC = () => {
  return (
    <section className="relative py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono">{personalInfo.academicStatus} (CGPA: {personalInfo.cgpa}) • {personalInfo.availability}</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {personalInfo.name}
          </h1>
          <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-bold">
            {heroData.title}
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {personalInfo.bio}
          </p>
        </div>

        {/* Contextual Meta Info Pills */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{personalInfo.institution}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{personalInfo.location}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{heroData.tagline}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {ctaLinks.map((cta) => {
            if (cta.id === 'resume') {
              return (
                <Link
                  key={cta.id}
                  to={cta.href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  {cta.label}
                </Link>
              );
            }
            if (cta.id === 'projects') {
              return (
                <Link
                  key={cta.id}
                  to={cta.href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  {cta.label}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              );
            }
            return (
              <Link
                key={cta.id}
                to={cta.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 font-bold text-xs sm:text-sm transition-colors"
              >
                {cta.label}
              </Link>
            );
          })}

          {/* Social Links */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 shadow-sm transition-colors"
              >
                {social.platform === 'github' && <GithubIcon className="w-4 h-4" />}
                {social.platform === 'linkedin' && <LinkedinIcon className="w-4 h-4" />}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
