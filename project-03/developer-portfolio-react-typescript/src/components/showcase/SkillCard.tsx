import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Code, FileCode, Palette, Atom, LayoutTemplate, Wind, Server, Layers, Shield, Terminal, Database, GitBranch, Send, Monitor, Cpu } from 'lucide-react';
import type { SkillItem } from '@/constants/portfolio';
import { scaleUp } from '@/utils/motion';
import { GithubIcon } from '@/components/common/SocialIcons';

interface SkillCardProps {
  skill: SkillItem;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-blue-600 dark:text-yellow-400" />;
      case 'FileCode':
        return <FileCode className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'LayoutTemplate':
        return <LayoutTemplate className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'Github':
        return <GithubIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />;
      case 'Send':
        return <Send className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Core Focus':
        return 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'Proficient':
        return 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30';
      default:
        return 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
    }
  };

  return (
    <motion.div
      variants={scaleUp}
      className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-card hover:shadow-lift transition-all"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
              {getSkillIcon(skill.iconName)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{skill.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{skill.category}</span>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle(skill.proficiencyBadge)}`}>
            {skill.proficiencyBadge}
          </span>
        </div>

        {/* Experience Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {skill.summary}
        </p>
      </div>

      {/* Subtle indicator bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Verified Skill</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">Production Ready</span>
      </div>
    </motion.div>
  );
};
