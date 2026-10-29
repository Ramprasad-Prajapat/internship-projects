import React from 'react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/common/Seo';

export const OfflinePage: React.FC = () => {
  return (
    <>
      <Seo title="Offline Mode" description="You are currently offline." />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-100">No Internet Connection</h1>
            <p className="text-slate-400 text-sm">
              Please check your network connection. Some offline content remains cached locally.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition-all"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default OfflinePage;
