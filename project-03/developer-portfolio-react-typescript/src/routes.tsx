import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { SkeletonPageLoader } from '@/components/common/SkeletonLoader';

// Lazy-loaded page components for optimal bundle splitting and performance
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Skills = lazy(() => import('@/pages/Skills'));
const Projects = lazy(() => import('@/pages/Projects'));
const GitHub = lazy(() => import('@/pages/GitHub'));
const Experience = lazy(() => import('@/pages/Experience'));
const Certifications = lazy(() => import('@/pages/Certifications'));
const Contact = lazy(() => import('@/pages/Contact'));
const Resume = lazy(() => import('@/pages/Resume'));
const CodingProfiles = lazy(() => import('@/pages/CodingProfiles'));
const Notes = lazy(() => import('@/pages/Notes'));
const OfflinePage = lazy(() => import('@/pages/OfflinePage'));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function RoutesConfig() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SkeletonPageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="skills" element={<Skills />} />
            <Route path="projects" element={<Projects />} />
            <Route path="github" element={<GitHub />} />
            <Route path="experience" element={<Experience />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="coding-profiles" element={<CodingProfiles />} />
            <Route path="notes" element={<Notes />} />
            <Route path="contact" element={<Contact />} />
            <Route path="resume" element={<Resume />} />
            <Route path="offline" element={<OfflinePage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
