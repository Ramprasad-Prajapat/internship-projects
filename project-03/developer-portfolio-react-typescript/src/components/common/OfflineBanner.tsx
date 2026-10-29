import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-amber-950 text-xs font-semibold px-4 py-2 text-center flex items-center justify-center space-x-2 shadow-md"
        >
          <svg className="w-4 h-4 text-amber-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>You are currently offline. Running in offline fallback mode with cached data.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
