import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';

const NotFound: React.FC = () => {
  return (
    <>
      <Seo title="404 Page Not Found" description="The requested page could not be found." />
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-md relative z-10"
        >
          <div className="text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-100">Page Not Found</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              The page you are looking for doesn't exist or has been moved to another path in the portfolio system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 transition-all text-sm"
            >
              Return to Home
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-medium transition-all text-sm"
            >
              Explore Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
