import React from 'react';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { ProfessionalSummarySection } from '@/components/about/ProfessionalSummarySection';
import { ExperienceTimelineSection } from '@/components/about/ExperienceTimelineSection';
import { EducationSection } from '@/components/about/EducationSection';
import { StrengthsSection } from '@/components/about/StrengthsSection';
import { CTASection } from '@/components/about/CTASection';
import { Seo } from '@/components/common/Seo';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/common/Reveal';

export const About: React.FC = () => {
  return (
    <>
      <Seo
        title="About & Professional Profile"
        description="Learn about Ramprasad Prajapat, B.Tech CSE student, Java Full Stack Developer, engineering philosophy, education, and career journey."
      />

      <Container className="space-y-6 pb-16">
        {/* 1. Hero Section */}
        <AboutHeroSection />

        {/* 2. Professional Summary & Philosophy */}
        <Reveal>
          <ProfessionalSummarySection />
        </Reveal>

        {/* 3. Experience & Internship Timeline */}
        <Reveal>
          <ExperienceTimelineSection />
        </Reveal>

        {/* 4. Academic Background & Coursework */}
        <Reveal>
          <EducationSection />
        </Reveal>

        {/* 5. Core Strengths & Soft Skills */}
        <Reveal>
          <StrengthsSection />
        </Reveal>

        {/* 6. Call to Action */}
        <Reveal>
          <CTASection />
        </Reveal>
      </Container>
    </>
  );
};

export default About;
