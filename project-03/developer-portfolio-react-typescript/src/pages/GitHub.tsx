import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { githubReposData, socialLinks } from '@/constants/portfolio';
import type { GitHubRepoItem } from '@/constants/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { RepositoryCard } from '@/components/showcase/RepositoryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { staggerContainer } from '@/animations';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/common/Reveal';

const categories: string[] = ['All', 'Java', 'Python', 'TypeScript', 'JavaScript'];

export const GitHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const githubUrl = socialLinks.find((s) => s.platform === 'github')?.url || 'https://github.com/ramprasadprajapat';

  const filteredRepos = useMemo(() => {
    return githubReposData.filter((repo) => {
      const matchesLanguage =
        selectedCategory === 'All' || repo.language.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesLanguage && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Seo
        title="GitHub Repositories & Open Source"
        description="Browse open source code repositories, Java Spring Boot projects, and React applications built by Ramprasad Prajapat."
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeader
            badge="Open Source & Repositories"
            badgeIcon={<GithubIcon className="w-4 h-4" />}
            title="GitHub Repositories Showcase"
            subtitle="Explore public source repositories detailing Java backend microservices, REST APIs, and full-stack React applications."
          />

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs font-bold transition-colors self-start md:self-auto shrink-0 shadow-sm"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Visit Profile on GitHub</span>
          </a>
        </div>

        {/* Filter & Search Controls */}
        <div className="space-y-3">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search repositories by name or tag (e.g. spring-boot, mysql)..."
          />

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
            <span>Showing {filteredRepos.length} of {githubReposData.length} repositories</span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Repository Grid */}
        {filteredRepos.length > 0 ? (
          <Reveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredRepos.map((repo: GitHubRepoItem) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </motion.div>
          </Reveal>
        ) : (
          <EmptyState
            title="No repositories found"
            description={`No public repositories match your current filter "${searchQuery}".`}
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            icon={<GithubIcon className="w-10 h-10 text-slate-500" />}
          />
        )}
      </div>
    </>
  );
};

export default GitHub;
