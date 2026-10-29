import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, ExternalLink, GraduationCap, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { RecruiterQuickView } from '@/components/common/RecruiterQuickView';
import { codingProfilesData, learningTopicsData, personalInfo } from '@/constants/portfolio';
import { Reveal } from '@/components/common/Reveal';

export const CodingProfiles: React.FC = () => {
  const [selectedLearningCategory, setSelectedLearningCategory] = useState<string>('All');

  const categories = ['All', 'Backend Architecture', 'System Design', 'Data Structures & Algorithms', 'DevOps & Cloud'];

  const filteredTopics = selectedLearningCategory === 'All'
    ? learningTopicsData
    : learningTopicsData.filter(t => t.category === selectedLearningCategory);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LeetCode':
        return <Code2 className="w-5 h-5 text-amber-500" />;
      case 'GeeksforGeeks':
        return <GraduationCap className="w-5 h-5 text-emerald-500" />;
      case 'HackerRank':
        return <Award className="w-5 h-5 text-green-600" />;
      default:
        return <GithubIcon className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <>
      <Seo
        title="Coding Profiles & Learning Focus"
        description={`Explore problem solving profiles and learning roadmap of ${personalInfo.name}, Aspiring Java Full Stack Developer.`}
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <SectionHeader
          badge="Problem Solving & Continuous Learning"
          badgeIcon={<Code2 className="w-4 h-4" />}
          title="DSA Profiles & Technical Focus"
          subtitle="Coding platform profiles, problem-solving focus areas, and technologies currently being studied."
        />

        {/* Recruiter Quick View Banner */}
        <RecruiterQuickView />

        {/* ================= CODING PROFILES SECTION ================= */}
        <Reveal>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Coding & Practice Platforms
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified profiles on competitive coding platforms and source control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codingProfilesData.map((profile) => (
                <motion.div
                  key={profile.id}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {getPlatformIcon(profile.platform)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
                            {profile.platform}
                          </h3>
                          <span className="text-xs font-mono text-slate-500 block mt-0.5">
                            @{profile.username}
                          </span>
                        </div>
                      </div>

                      {profile.statusLabel && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300">
                          {profile.statusLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {profile.description}
                    </p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {profile.focusTopics.map((topic) => (
                          <span key={topic} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors group"
                    >
                      <span>View {profile.platform} Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ================= CURRENTLY LEARNING SECTION ================= */}
        <Reveal>
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Continuous Growth</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Currently Learning & Focus Topics
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedLearningCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedLearningCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Learning Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl glass-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.topic}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Key Concepts</span>
                    <div className="flex flex-wrap gap-1">
                      {item.keyConcepts.map((concept) => (
                        <span key={concept} className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};

export default CodingProfiles;
