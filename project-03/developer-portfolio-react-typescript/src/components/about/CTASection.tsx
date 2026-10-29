import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import { ctaLinks, socialLinks, personalInfo } from '@/constants/portfolio';
import { fadeIn } from '@/animations';
import { GithubIcon, LinkedinIcon } from '@/components/common/SocialIcons';

export const CTASection: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="p-6 sm:p-10 rounded-3xl border border-blue-200 dark:border-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center space-y-6 relative overflow-hidden shadow-xl"
      >
        <div className="space-y-3 max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open for Software Engineering Opportunities</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interested in working together?
          </h2>

          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            I am actively seeking software engineering internships and entry-level developer roles. Let&apos;s build scalable Java applications and high-performance web systems together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          {ctaLinks.map((cta) => {
            if (cta.id === 'resume') {
              return (
                <Link
                  key={cta.id}
                  to={cta.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-slate-100 font-bold text-xs transition-colors shadow-md"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-colors"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20"
              >
                <Mail className="w-4 h-4" />
                {cta.label}
              </Link>
            );
          })}
        </div>

        {/* Social Links */}
        <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-center gap-3 relative z-10 text-xs text-blue-100 font-semibold">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              {social.platform === 'github' && <GithubIcon className="w-3.5 h-3.5" />}
              {social.platform === 'linkedin' && <LinkedinIcon className="w-3.5 h-3.5" />}
              <span>{social.label}</span>
            </a>
          ))}
        </div>

        <p className="text-[11px] text-blue-200 pt-1 font-medium">
          {personalInfo.institution} • {personalInfo.location}
        </p>
      </motion.div>
    </section>
  );
};

export default CTASection;
