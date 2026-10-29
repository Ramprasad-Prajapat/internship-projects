import React from 'react';
import { personalInfo } from '@/constants/portfolio';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  author?: string;
  jsonLd?: Record<string, any>;
}

export const Seo: React.FC<SeoProps> = ({
  title = `${personalInfo.name} | Java Full Stack Developer & Software Engineer`,
  description = personalInfo.bio,
  keywords = ['Java Developer', 'Full Stack Engineer', 'Spring Boot', 'React.js', 'Software Engineer', 'Portfolio', 'B.Tech CSE'],
  canonicalUrl = 'https://portfolio.example.com',
  ogImage = '/og-image.png',
  ogType = 'website',
  author = personalInfo.name,
  jsonLd,
}) => {
  const fullTitle = title.includes(personalInfo.name) ? title : `${title} | ${personalInfo.name}`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    worksFor: {
      '@type': 'EducationalOrganization',
      name: personalInfo.institution,
    },
    url: canonicalUrl,
    sameAs: [
      'https://github.com',
      'https://linkedin.com',
    ],
    knowsAbout: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'REST APIs', 'Tailwind CSS'],
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={`${personalInfo.name} Portfolio`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </>
  );
};

export default Seo;
