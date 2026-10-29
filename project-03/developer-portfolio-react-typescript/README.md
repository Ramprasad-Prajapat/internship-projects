# developer-portfolio-react-typescript

**Live Demo:** [https://developer-portfolio-react-typescript.vercel.app](https://developer-portfolio-react-typescript.vercel.app)


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
â”œâ”€â”€ public/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ animations/
â”‚   â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ constants/
â”‚   â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ layouts/
â”‚   â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ styles/
â”‚   â”œâ”€â”€ App.tsx
â”‚   â””â”€â”€ main.tsx
â”œâ”€â”€ package.json
â”œâ”€â”€ vite.config.ts
â””â”€â”€ README.md
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

