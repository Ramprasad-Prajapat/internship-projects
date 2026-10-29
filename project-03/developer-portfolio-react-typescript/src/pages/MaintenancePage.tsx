import React from 'react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/common/Seo';

export const MaintenancePage: React.FC = () => {
  return (
    <>
      <Seo title="Scheduled Maintenance" description="Application under maintenance." />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-lg"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-100">Scheduled System Upgrade</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We are currently performing infrastructure optimization and Spring Boot API integration upgrades. The application will be back online shortly.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MaintenancePage;
