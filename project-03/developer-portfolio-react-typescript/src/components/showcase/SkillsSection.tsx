import React from 'react';
import { Code, Layers, Wrench, Server, Sparkles, Coffee, FileCode, Palette, Atom, LayoutTemplate, Shield, Terminal, Database, GitBranch, Send, Monitor, Cpu, Cloud, Globe } from 'lucide-react';
import { skillsData, type SkillItem } from '@/constants/portfolio';
import { GithubIcon } from '@/components/common/SocialIcons';

interface CategoryGroup {
  name: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

export const SkillsSection: React.FC = () => {
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-blue-600 dark:text-yellow-400" />;
      case 'FileCode':
        return <FileCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'Palette':
        return <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Atom':
        return <Atom className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'LayoutTemplate':
        return <LayoutTemplate className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Server':
        return <Server className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'Github':
        return <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-200" />;
      case 'Send':
        return <Send className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const categories: CategoryGroup[] = [
    {
      name: 'Languages',
      icon: <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      skills: skillsData.filter((s) => s.category === 'Programming Languages'),
    },
    {
      name: 'Frameworks & Libraries',
      icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      skills: skillsData.filter((s) => s.category === 'Backend' || s.category === 'Frontend'),
    },
    {
      name: 'Core Concepts & Developer Tools',
      icon: <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      skills: skillsData.filter((s) => s.category === 'Developer Tools'),
    },
    {
      name: 'Cloud, Deployment & Databases',
      icon: <Server className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      skills: skillsData.filter((s) => s.category === 'Database' || s.category === 'Deployment / Platforms'),
    },
    {
      name: 'APIs & AI Integration',
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      skills: skillsData.filter((s) => s.category === 'API Integration'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="p-4.5 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-3.5 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {cat.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {cat.name}
            </h3>
            <span className="text-[11px] font-mono font-semibold text-slate-400 ml-auto">
              {cat.skills.length} skills
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => (
              <div
                key={skill.id}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-sm transition-all duration-200"
              >
                <div className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xs group-hover:scale-105 transition-transform">
                  {getSkillIcon(skill.iconName)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    {skill.name}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                    {skill.proficiencyBadge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;
