import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code2,
  Server,
  Database,
  ArrowRight,
  FileText,
  Sparkles,
  ExternalLink,
  GraduationCap,
  FolderGit2,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/common/FilterBar';
import { RecruiterQuickView } from '@/components/common/RecruiterQuickView';
import { LookingForSection } from '@/components/common/LookingForSection';
import { EngineeringArchitectureVisualizer } from '@/components/showcase/EngineeringArchitectureVisualizer';
import { EngineeringProcessSection } from '@/components/showcase/EngineeringProcessSection';
import { TechnologyRelationshipMap } from '@/components/showcase/TechnologyRelationshipMap';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { ProfessionalSummarySection } from '@/components/about/ProfessionalSummarySection';
import { ExperienceTimelineSection } from '@/components/about/ExperienceTimelineSection';
import { EducationSection } from '@/components/about/EducationSection';
import { StrengthsSection } from '@/components/about/StrengthsSection';
import { SkillCard } from '@/components/showcase/SkillCard';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { ProjectDetailModal } from '@/components/showcase/ProjectDetailModal';
import { CertificationCard } from '@/components/showcase/CertificationCard';
import { RepositoryCard } from '@/components/showcase/RepositoryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Contact } from '@/pages/Contact';
import { Reveal } from '@/components/common/Reveal';
import { SkillsSection } from '@/components/showcase/SkillsSection';

import {
  personalInfo,
  projectsData,
  skillsData,
  certificationsData,
  codingProfilesData,
  learningTopicsData,
  engineeringNotesData,
  githubReposData,
  educationData,
  experienceData,
} from '@/constants/portfolio';
import type { ProjectItem, ProjectCategory, EngineeringNote } from '@/constants/portfolio';
import Typography from '@/components/common/Typography';
import Badge from '@/components/common/Badge';
import { slideUp, staggerContainer } from '@/animations';

const skillCategories = [
  'All',
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Developer Tools',
  'Deployment / Platforms',
  'API Integration',
];

const projectCategories = [
  'All',
  'Full Stack',
  'Backend / API',
  'Web Application',
];

export const Home: React.FC = () => {
  // Skills State
  const [skillCategory, setSkillCategory] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');

  // Projects State
  const [projectCategory, setProjectCategory] = useState<string>('All');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Notes Modal State
  const [activeNote, setActiveNote] = useState<EngineeringNote | null>(null);
  const [noteCategory, setNoteCategory] = useState<string>('All');

  // Filtered Skills
  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      const matchesCategory =
        skillCategory === 'All' || skill.category === skillCategory;

      const matchesSearch =
        skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
        skill.summary.toLowerCase().includes(skillSearch.toLowerCase()) ||
        skill.proficiencyBadge.toLowerCase().includes(skillSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [skillCategory, skillSearch]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory =
        projectCategory === 'All' || project.category === (projectCategory as ProjectCategory);

      const matchesSearch =
        project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.techStack.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [projectCategory, projectSearch]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return engineeringNotesData.filter((note) => {
      return noteCategory === 'All' || note.category === noteCategory;
    });
  }, [noteCategory]);

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
        title={`${personalInfo.name} | Aspiring Software Engineer & Java Full Stack Developer`}
        description="Portfolio of Ramprasad Prajapat, Aspiring Software Engineer and Java Full Stack Developer specializing in Java, Spring Boot, React.js, REST APIs, and MySQL."
      />

      <div id="main-content" className="space-y-8 sm:space-y-10 lg:space-y-12 pb-8">

        {/* ================= 1. HERO ================= */}
        <section id="home" className="scroll-mt-24 relative pt-4 pb-4 md:pt-8 md:pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{personalInfo.academicStatus} (CGPA: {personalInfo.cgpa}) • {personalInfo.availability}</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <Typography variant="h1" className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                  Hi, I'm{' '}
                  <span className="text-blue-600 dark:text-blue-400">
                    {personalInfo.name}
                  </span>
                </Typography>
                <Typography variant="h3" className="text-slate-700 dark:text-slate-300 font-bold text-lg sm:text-xl">
                  {personalInfo.title}
                </Typography>
              </div>

              {/* Summary Bio */}
              <Typography variant="p" className="max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {personalInfo.bio}
              </Typography>

              {/* Core Technologies Badges */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Core Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Java', 'Spring Boot', 'React.js', 'MySQL', 'REST APIs', 'Git', 'GitHub'].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs px-2.5 py-0.5 font-mono font-medium bg-white dark:bg-slate-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.hash = '#projects';
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold"
                >
                  Explore Projects
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    window.location.hash = '#resume';
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold"
                >
                  View Resume
                </Button>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 relative"
            >
              <div className="rounded-2xl p-6 glass-card space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Engineering Profile</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                    {personalInfo.academicStatus}
                  </span>
                </div>

                {/* Stack Layers */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Frontend UI</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">React.js, HTML5, CSS3, JavaScript</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">React</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Backend APIs</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Java, Spring Boot, REST Services</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded">Java</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Database</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">MySQL Relational DB, SQL Queries</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40 px-2 py-0.5 rounded">MySQL</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">{personalInfo.cgpa}</div>
                    <div className="text-[10px] text-slate-500">CGPA</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">8+</div>
                    <div className="text-[10px] text-slate-500">Projects</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">2027</div>
                    <div className="text-[10px] text-slate-500">B.Tech CSE</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. RECRUITER SNAPSHOT ================= */}
        <Reveal>
          <section id="quick-view" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <RecruiterQuickView />
          </section>
        </Reveal>

        {/* ================= 3. ABOUT / PROFILE ================= */}
        <Reveal>
          <section id="about" className="scroll-mt-24 space-y-8">
            <AboutHeroSection />
            <ProfessionalSummarySection />
            <StrengthsSection />
          </section>
        </Reveal>

        {/* ================= 4. TECHNICAL SKILLS ================= */}
        <section id="skills" className="scroll-mt-24 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <SectionHeader
            badge="Technical Competencies"
            badgeIcon={<GraduationCap className="w-4 h-4" />}
            title="Technical Skills & Proficiencies"
            subtitle="Categorized skills covering Java backend development, Spring Boot, React.js, MySQL databases, REST APIs, and developer tools."
          />

          <div className="space-y-3">
            <FilterBar
              categories={skillCategories}
              selectedCategory={skillCategory}
              onSelectCategory={setSkillCategory}
              searchQuery={skillSearch}
              onSearchChange={setSkillSearch}
              placeholder="Search skills (e.g. Java, Spring Boot, React, MySQL)..."
            />
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
              <span>Showing {filteredSkills.length} of {skillsData.length} skills</span>
              {(skillCategory !== 'All' || skillSearch) && (
                <button onClick={() => { setSkillCategory('All'); setSkillSearch(''); }} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {skillCategory === 'All' && !skillSearch ? (
            <SkillsSection />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </section>

        {/* ================= 5. FEATURED PROJECTS ================= */}
        <section id="projects" className="scroll-mt-24 py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <SectionHeader
            badge="Portfolio Projects"
            badgeIcon={<FolderGit2 className="w-4 h-4" />}
            title="Software Engineering Projects"
            subtitle="Authentic full-stack web applications, machine learning projects, and REST APIs built with Java, Spring Boot, React, Python, and MySQL."
          />

          <div className="space-y-2.5">
            <FilterBar
              categories={projectCategories}
              selectedCategory={projectCategory}
              onSelectCategory={setProjectCategory}
              searchQuery={projectSearch}
              onSearchChange={setProjectSearch}
              placeholder="Search projects (e.g. Spring Boot, React, Emotion)..."
            />
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
              <span>Showing {filteredProjects.length} of {projectsData.length} projects</span>
              {(projectCategory !== 'All' || projectSearch) && (
                <button onClick={() => { setProjectCategory('All'); setProjectSearch(''); }} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={setSelectedProject}
                onFilterByTech={(tech) => setProjectSearch(tech)}
              />
            ))}
          </div>

          <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </section>

        {/* ================= 6. EXPERIENCE ================= */}
        <Reveal>
          <section id="experience" className="scroll-mt-24">
            <ExperienceTimelineSection />
          </section>
        </Reveal>

        {/* ================= 7. EDUCATION ================= */}
        <Reveal>
          <section id="education" className="scroll-mt-24">
            <EducationSection />
          </section>
        </Reveal>

        {/* ================= 8. CODING & GITHUB ================= */}
        <section id="coding" className="scroll-mt-24 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <SectionHeader
            badge="Coding Profiles & Code Repositories"
            badgeIcon={<Code2 className="w-4 h-4" />}
            title="Problem Solving & Code Showcase"
            subtitle="Active practice on competitive coding platforms and source code repositories."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codingProfilesData.map((profile) => (
              <div
                key={profile.id}
                className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
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
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub Repositories Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Featured GitHub Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {githubReposData.slice(0, 3).map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>

          {/* Certifications Subsection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Verified Certifications</h3>
            {certificationsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificationsData.map((cert) => (
                  <CertificationCard key={cert.id} cert={cert} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Professional Certifications Portal"
                description="Verified certifications and course completions will be displayed here."
                icon={<ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
              />
            )}
          </div>
        </section>

        {/* ================= 9. CURRENTLY LEARNING ================= */}
        <section id="learning" className="scroll-mt-24 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <SectionHeader
            badge="Technical Growth"
            badgeIcon={<BookOpen className="w-4 h-4" />}
            title="Currently Learning & Focus"
            subtitle="Technologies and concepts currently being studied to expand full-stack capabilities."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningTopicsData.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl glass-card space-y-3">
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
        </section>

        {/* ================= 10. ENGINEERING APPROACH ================= */}
        <section id="approach" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <EngineeringProcessSection />
          <EngineeringArchitectureVisualizer />
          <TechnologyRelationshipMap />
        </section>

        {/* ================= 11. ENGINEERING NOTES ================= */}
        <section id="notes" className="scroll-mt-24 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <SectionHeader
            badge="Knowledge Sharing"
            badgeIcon={<BookOpen className="w-4 h-4" />}
            title="Engineering Notes & Documentation"
            subtitle="Articles and technical guides on Spring Boot, React, and relational database schema design."
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Java & Spring', 'React & Frontend', 'Database Architecture', 'Software Engineering'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNoteCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  noteCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                      {note.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {note.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {note.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {note.date}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveNote(note)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Article Modal Reader */}
          <AnimatePresence>
            {activeNote && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={activeNote.title}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm"
                onClick={() => setActiveNote(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5"
                >
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {activeNote.category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {activeNote.title}
                      </h2>
                      <span className="text-xs font-mono text-slate-500 block pt-1">
                        Published: {activeNote.date} • By {personalInfo.name}
                      </span>
                    </div>
                    <button onClick={() => setActiveNote(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="prose dark:prose-invert text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3">
                    {activeNote.content}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button onClick={() => setActiveNote(null)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                      Close Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* ================= 12. RESUME ================= */}
        <section id="resume" className="scroll-mt-24 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <SectionHeader
            badge="Curriculum Vitae"
            badgeIcon={<FileText className="w-4 h-4" />}
            title="Resume & Qualifications"
            subtitle="Recruiter-ready resume highlighting Java backend engineering skills, Spring Boot, React, and academic history."
          />

          <div className="p-6 rounded-2xl glass-card space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{personalInfo.name} — Resume</h3>
                <p className="text-xs text-slate-500">{personalInfo.degree} • {educationData.institution}</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/resume.pdf"
                  download="Ramprasad_Prajapat_Resume.pdf"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
                <Link
                  to="/resume"
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Resume Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-500 uppercase block">Education</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">{educationData.degree}</p>
                <p className="text-slate-500">{educationData.institution} (CGPA: {educationData.cgpa})</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-500 uppercase block">Current Internship</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">{experienceData[0]?.role}</p>
                <p className="text-slate-500">{experienceData[0]?.organization} (On-site)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-500 uppercase block">Core Stack</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">Java, Spring Boot, React</p>
                <p className="text-slate-500">REST APIs, MySQL Relational DB</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 13. OPPORTUNITIES ================= */}
        <section id="opportunities" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <LookingForSection />
        </section>

        {/* ================= 14. CONTACT ================= */}
        <section id="contact" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Contact />
        </section>

      </div>
    </>
  );
};

export default Home;
