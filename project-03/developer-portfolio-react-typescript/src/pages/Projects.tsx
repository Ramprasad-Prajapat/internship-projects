import React, { useState, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import { projectsData } from '@/constants/portfolio';
import type { ProjectItem, ProjectCategory } from '@/constants/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { ProjectDetailModal } from '@/components/showcase/ProjectDetailModal';
import { EmptyState } from '@/components/common/EmptyState';
import { staggerContainer } from '@/animations';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/common/Reveal';

const categories: string[] = [
  'All',
  'Full Stack',
  'Backend / API',
  'Web Application',
];

export const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === (selectedCategory as ProjectCategory);

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Seo
        title="Software Engineering Projects"
        description="Case studies of authentic software engineering projects built with Java, Spring Boot, React, Python, and MySQL."
      />

      <Container className="py-6 sm:py-8 lg:py-10 space-y-6">
        {/* Header */}
        <SectionHeader
          badge="Engineering Portfolio"
          badgeIcon={<FolderGit2 className="w-4 h-4" />}
          title="Featured Engineering Projects"
          subtitle="Production-grade full-stack web applications, machine learning systems, and REST APIs built with Java, Spring Boot, React, and MySQL."
        />

        {/* Filter & Search Controls */}
        <div className="space-y-3">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search by title or tech (e.g., Spring Boot, React)..."
          />

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
            <span>Showing {filteredProjects.length} of {projectsData.length} projects</span>
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

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <Reveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={setSelectedProject}
                  onFilterByTech={(tech) => setSearchQuery(tech)}
                />
              ))}
            </motion.div>
          </Reveal>
        ) : (
          <EmptyState
            title="No projects found"
            description={`No projects match your search "${searchQuery}". Try selecting a different filter.`}
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        )}

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Container>
    </>
  );
};

export default Projects;
