import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Briefcase, User, Mail, FileText, FolderGit2, Sun, Moon, Laptop, Command } from 'lucide-react';
import { personalInfo } from '@/constants/portfolio';
import { useTheme } from '@/hooks/useTheme';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { CommandPalette } from '@/components/common/CommandPalette';
import { NavLink } from '@/components/common/NavLink';

const navItems = [
  { label: 'About', path: '#about', icon: User },
  { label: 'Education', path: '#education', icon: GraduationCap },
  { label: 'Skills', path: '#skills', icon: GraduationCap },
  { label: 'Projects', path: '#projects', icon: FolderGit2 },
  { label: 'Experience', path: '#experience', icon: Briefcase },
  { label: 'Contact', path: '#contact', icon: Mail },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const scrollDirection = useScrollDirection();
  const [hideNavbar, setHideNavbar] = useState(false);
  const isFirstRender = useRef(true);
  useEffect(() => {
    // On initial mount, keep navbar visible regardless of scroll position
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setHideNavbar(false);
      return;
    }

    // Keep navbar visible when mobile menu is open
    if (mobileMenuOpen) {
      setHideNavbar(false);
      return;
    }

    const topThreshold = 50; // pixels from top where navbar must stay visible

    // Always show when near the top of the page
    if (window.scrollY <= topThreshold) {
      setHideNavbar(false);
      return;
    }

    // Hide on downward scroll, show on upward scroll
    if (scrollDirection === 'down') {
      setHideNavbar(true);
    } else {
      setHideNavbar(false);
    }
  }, [scrollDirection, mobileMenuOpen]);

  const isHomePage = location.pathname === '/';

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  // Keyboard shortcut (Ctrl/Cmd + K) and Escape key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // IntersectionObserver for section tracking on single-page Home
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = [
      'about',
      'education',
      'skills',
      'projects',
      'experience',
      'contact',
    ];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // Handle deep-link scrolling on initial render or hash change
  useEffect(() => {
    if (isHomePage && location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isHomePage, location.hash]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }, [mobileMenuOpen]);

  const isNavActive = (itemPath: string) => {
    if (isHomePage) {
      const anchor = itemPath.replace('#', '');
      return activeSection === anchor;
    }
    return location.pathname === itemPath || location.pathname === `/${itemPath.replace('#', '')}`;
  };

  const getNavDestination = (itemPath: string) => {
    if (isHomePage) return itemPath;
    return `/${itemPath}`;
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 py-3 transform transition-transform duration-300 ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto rounded-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="h-14 px-4 flex items-center justify-between">
            {/* Brand Logo & Title */}
            <Link
              to="/#home"
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:bg-blue-500 transition-colors">
                RP
              </div>
              <div>
                <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100 text-sm block leading-none">
                  {personalInfo.name}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block mt-1 font-mono">
                  Software Engineer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={getNavDestination(item.path)}
                  icon={item.icon}
                  label={item.label}
                  active={isNavActive(item.path)}
                />
              ))}
            </nav>

            {/* Action controls */}
            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                title="Search Portfolio (Ctrl+K)"
              >
                <Command className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Search</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">⌘K</kbd>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Switch theme (current: ${theme})`}
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Laptop className="w-4 h-4 text-blue-500" />}
              </button>

              {/* Resume download CTA */}
              <NavLink
                to={isHomePage ? '#resume' : '/resume'}
                icon={FileText}
                label="Resume"
                active={isNavActive('#resume')}
                className="hidden sm:flex bg-blue-600 text-white hover:bg-blue-500 font-semibold shadow-sm"
              />

              {/* Mobile menu trigger button */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="xl:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Navigation Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={getNavDestination(item.path)}
                  icon={item.icon}
                  label={item.label}
                  active={isNavActive(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-sm"
                />
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Command className="w-4 h-4 text-blue-600" />
                <span>Search Portfolio (Ctrl + K)</span>
              </button>

              <NavLink
                to={isHomePage ? '#resume' : '/resume'}
                icon={FileText}
                label="View Resume"
                active={isNavActive('#resume')}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-center py-2.5 bg-blue-600 text-white font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
};

export default Navbar;
