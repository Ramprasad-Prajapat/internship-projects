import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { BackToTopButton } from '@/components/common/BackToTopButton';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { pageTransition } from '@/animations';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white relative transition-colors duration-200 overflow-x-hidden">
      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-xl"
      >
        Skip to main content
      </a>

      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      {/* Offline Status Banner */}
      <OfflineBanner />

      {/* Subtle radial background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow opacity-80" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 z-10 relative focus:outline-none" tabIndex={-1}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Floating Back To Top Button */}
      <BackToTopButton />

      {/* Footer */}
      <Footer />
    </div>
  );
};
