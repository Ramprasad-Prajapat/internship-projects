import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing Application...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      {/* Glow background */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-6">
        {/* Animated Brand Pulse Icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/20"
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              RP
            </span>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
        </div>

        {/* Status Text */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium tracking-wide text-slate-300 animate-pulse">{message}</p>
          <p className="text-xs text-slate-500">Enterprise Java & React Architecture</p>
        </div>
      </div>
    </div>
  );
};
