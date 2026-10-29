import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck } from 'lucide-react';
import { certificationsData } from '@/constants/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CertificationCard } from '@/components/showcase/CertificationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { staggerContainer } from '@/animations';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/common/Reveal';

export const Certifications: React.FC = () => {
  return (
    <>
      <Seo
        title="Certifications & Credentials"
        description="Verified technical certifications, achievements, and credentials in Java, Spring Boot, and Web Development."
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <SectionHeader
          badge="Professional Credentials"
          badgeIcon={<Award className="w-4 h-4" />}
          title="Certifications & Credentials"
          subtitle="Industry certifications and technical credentials validating expertise in Java development, full-stack architecture, and web technologies."
        />

        {/* Certifications Grid */}
        {certificationsData.length > 0 ? (
          <Reveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {certificationsData.map((cert) => (
                <CertificationCard key={cert.id} cert={cert} />
              ))}
            </motion.div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="space-y-4">
              <EmptyState
                title="Professional Certifications Portal"
                description="Verified certifications and course completions will be displayed here as official credentials are finalized."
                icon={<ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
              />

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/skills"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Explore Technical Skills
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
};

export default Certifications;
