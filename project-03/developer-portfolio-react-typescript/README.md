# developer-portfolio-react-typescript

**Live Demo:** Deployment pending


A modern, high-performance developer portfolio web application built with React 19, TypeScript, and Tailwind CSS. It highlights featured software projects, interactive skill breakdowns, career milestones, and direct contact workflows.

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Motion (Framer Motion)
- UI Components: Headless UI, Radix UI Icons, Lucide React, Class Variance Authority
- Forms & Validation: React Hook Form, Zod
- Routing: React Router DOM v7

## Features
- Responsive hero presentation with entrance animations and dynamic CTA triggers
- Filterable project gallery with detailed modal overviews, tech badges, and demo links
- Categorized technical skills matrix covering frontend, backend, database, and devops
- Interactive experience timeline detailing career and internship achievements
- Validated contact form interface with client-side Zod validation and feedback notifications
- Optimized for mobile, tablet, and desktop viewports with dark theme support

## Folder Structure
`
developer-portfolio-react-typescript/
├── public/
├── src/
│   ├── animations/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
`

## How to Run
1. Prerequisites: Node.js 18+ (npm 9+)
2. Setup:
   `ash
   npm install
   `
3. Run:
   `ash
   npm run dev
   `
   Application opens at http://localhost:5173.

## Environment Variables / Config
- VITE_APP_TITLE: Portfolio application title
- VITE_APP_ENV: Application environment (development / production)
- VITE_API_BASE_URL: Optional backend API endpoint for contact messages
- VITE_ENABLE_ANALYTICS: Flag for analytics tracking (	rue / alse)

