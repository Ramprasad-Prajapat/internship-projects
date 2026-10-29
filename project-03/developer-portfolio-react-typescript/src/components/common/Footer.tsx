import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUp } from 'lucide-react';
import { personalInfo, socialLinks } from '@/constants/portfolio';
import { GithubIcon, LinkedinIcon } from '@/components/common/SocialIcons';

export const Footer: React.FC = () => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-slate-200 dark:border-slate-800/80">
          {/* Brand */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs">
                RP
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{personalInfo.name}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              {personalInfo.title}. {personalInfo.degree} ({personalInfo.duration}, CGPA: {personalInfo.cgpa}).
            </p>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400">{personalInfo.primaryTechPill}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1 text-xs">
              <li><Link to="/#home" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/#skills" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Technical Skills</Link></li>
              <li><Link to="/#projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link to="/#experience" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Experience</Link></li>
              <li><Link to="/resume" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resume</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">{personalInfo.location}</p>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 text-xs"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
