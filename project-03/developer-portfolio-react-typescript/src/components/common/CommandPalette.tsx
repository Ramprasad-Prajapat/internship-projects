import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Code2,
  User,
  GraduationCap,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Mail,
  Sun,
  Moon,
  Download,
  ExternalLink,
  ArrowUp,
  Command,
  BookOpen,
  Server,
} from 'lucide-react';
import { GithubIcon } from '@/components/common/SocialIcons';
import { useTheme } from '@/hooks/useTheme';
import { modalVariant } from '@/animations';

interface CommandItem {
  id: string;
  label: string;
  group: 'Navigation' | 'Actions';
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Trap focus within the dialog when open
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const elements = Array.from(focusable);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const scrollToSection = useCallback((sectionId: string, fallbackPath: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else {
      navigate(fallbackPath);
    }
    onClose();
  }, [location.pathname, navigate, onClose]);

  // Commands definition
  const commands = useMemo<CommandItem[]>(() => {
    return [
      // Navigation
      {
        id: 'nav-home',
        label: 'Go to Home',
        group: 'Navigation',
        icon: Code2,
        action: () => scrollToSection('home', '/'),
      },
      {
        id: 'nav-quick-view',
        label: 'Go to Recruiter Quick View',
        group: 'Navigation',
        icon: User,
        action: () => scrollToSection('quick-view', '/#quick-view'),
      },
      {
        id: 'nav-about',
        label: 'Go to About & Profile',
        group: 'Navigation',
        icon: User,
        action: () => scrollToSection('about', '/about'),
      },
      {
        id: 'nav-skills',
        label: 'Go to Technical Skills',
        group: 'Navigation',
        icon: GraduationCap,
        action: () => scrollToSection('skills', '/skills'),
      },
      {
        id: 'nav-experience',
        label: 'Go to Work Experience',
        group: 'Navigation',
        icon: Briefcase,
        action: () => scrollToSection('experience', '/experience'),
      },
      {
        id: 'nav-projects',
        label: 'Go to Engineering Projects',
        group: 'Navigation',
        icon: FolderGit2,
        action: () => scrollToSection('projects', '/projects'),
      },
      {
        id: 'nav-education',
        label: 'Go to Education & Academic Background',
        group: 'Navigation',
        icon: GraduationCap,
        action: () => scrollToSection('education', '/#education'),
      },
      {
        id: 'nav-github',
        label: 'Go to GitHub Showcase',
        group: 'Navigation',
        icon: GithubIcon,
        action: () => scrollToSection('coding', '/github'),
      },
      {
        id: 'nav-coding-profiles',
        label: 'Go to Coding & DSA Profiles',
        group: 'Navigation',
        icon: Code2,
        action: () => scrollToSection('coding', '/coding-profiles'),
      },
      {
        id: 'nav-certifications',
        label: 'Go to Certifications',
        group: 'Navigation',
        icon: Award,
        action: () => scrollToSection('certifications', '/certifications'),
      },
      {
        id: 'nav-learning',
        label: 'Go to Currently Learning Topics',
        group: 'Navigation',
        icon: BookOpen,
        action: () => scrollToSection('learning', '/#learning'),
      },
      {
        id: 'nav-approach',
        label: 'Go to Engineering Approach & Architecture',
        group: 'Navigation',
        icon: Server,
        action: () => scrollToSection('approach', '/#approach'),
      },
      {
        id: 'nav-notes',
        label: 'Go to Engineering Notes & Articles',
        group: 'Navigation',
        icon: GraduationCap,
        action: () => scrollToSection('notes', '/notes'),
      },
      {
        id: 'nav-resume',
        label: 'Go to Resume & CV',
        group: 'Navigation',
        icon: FileText,
        action: () => scrollToSection('resume', '/resume'),
      },
      {
        id: 'nav-contact',
        label: 'Go to Contact Page',
        group: 'Navigation',
        icon: Mail,
        action: () => scrollToSection('contact', '/contact'),
      },
      // Actions
      {
        id: 'act-theme',
        label: `Switch Theme (Current: ${theme})`,
        group: 'Actions',
        icon: theme === 'dark' ? Moon : Sun,
        action: () => {
          if (theme === 'dark') setTheme('light');
          else if (theme === 'light') setTheme('system');
          else setTheme('dark');
          onClose();
        },
      },
      {
        id: 'act-resume-download',
        label: 'Download Resume PDF',
        group: 'Actions',
        icon: Download,
        action: () => {
          const a = document.createElement('a');
          a.href = '/resume.pdf';
          a.download = 'Ramprasad_Prajapat_Resume.pdf';
          a.click();
          onClose();
        },
      },
      {
        id: 'act-github-ext',
        label: 'Open GitHub Profile (External)',
        group: 'Actions',
        icon: ExternalLink,
        action: () => {
          window.open('https://github.com', '_blank');
          onClose();
        },
      },
      {
        id: 'act-linkedin-ext',
        label: 'Open LinkedIn Profile (External)',
        group: 'Actions',
        icon: ExternalLink,
        action: () => {
          window.open('https://linkedin.com', '_blank');
          onClose();
        },
      },
      {
        id: 'act-scroll-top',
        label: 'Scroll to Top of Page',
        group: 'Actions',
        icon: ArrowUp,
        action: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onClose();
        },
      },
    ];
  }, [scrollToSection, onClose, theme, setTheme]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(q) || cmd.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Reset selectedIndex when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Handle keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
            className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d111d] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search... (Press ESC to close)"
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60">
                <Command className="w-3 h-3" /> K
              </span>
            </div>

            {/* Commands List */}
            <div className="overflow-y-auto p-2 space-y-4 max-h-[60vh]">
              {filteredCommands.length > 0 ? (
                ['Navigation', 'Actions'].map((groupName) => {
                  const groupItems = filteredCommands.filter((c) => c.group === groupName);
                  if (groupItems.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-1">
                      <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {groupName}
                      </div>
                      {groupItems.map((cmd) => {
                        const globalIdx = filteredCommands.indexOf(cmd);
                        const isSelected = globalIdx === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors text-left ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span>{cmd.label}</span>
                            </div>
                            {cmd.shortcut && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                {cmd.shortcut}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Search className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching commands</p>
                  <p className="text-xs text-slate-400">Try searching for "Projects", "Resume", "Theme", or "Contact".</p>
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span>Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
