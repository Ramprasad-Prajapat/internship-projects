import React, { useState, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { skillsData } from '@/constants/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { SkillCard } from '@/components/showcase/SkillCard';
import { SkillsSection } from '@/components/showcase/SkillsSection';
import { EmptyState } from '@/components/common/EmptyState';
import { staggerContainer } from '@/animations';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/common/Reveal';

const categories: string[] = [
  'All',
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Developer Tools',
  'Deployment / Platforms',
  'API Integration',
];

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;

      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.proficiencyBadge.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Seo
        title="Technical Skills & Competencies"
        description="Comprehensive technical skills inventory including Java, Spring Boot, React, MySQL, REST APIs, and developer tools."
      />

      <Container className="py-6 sm:py-8 lg:py-10 space-y-6">
        {/* Header */}
        <SectionHeader
          badge="Technical Expertise"
          badgeIcon={<GraduationCap className="w-4 h-4" />}
          title="Technical Skills & Competencies"
          subtitle="Categorized software engineering capabilities spanning Java backend systems, React frontends, relational database design, and developer tools."
        />

        {/* Filter & Search Controls */}
        <div className="space-y-3">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search skills (e.g., Java, Spring Boot, React, MySQL)..."
          />

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
            <span>Showing {filteredSkills.length} of {skillsData.length} competencies</span>
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

        {/* Skills Grid */}
        {selectedCategory === 'All' && !searchQuery ? (
          <Reveal>
            <SkillsSection />
          </Reveal>
        ) : filteredSkills.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No skills found"
            description={`No skills match your search "${searchQuery}". Try selecting a different category.`}
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            icon={<Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
          />
        )}
      </Container>
    </>
  );
};

export default Skills;
