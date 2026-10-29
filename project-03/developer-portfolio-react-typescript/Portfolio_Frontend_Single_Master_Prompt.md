# Portfolio Website — Single Master Prompt for Antigravity

You are a Senior Software Engineer, Senior Frontend Engineer, UI/UX Engineer, and Code Reviewer. Work directly on the existing `Portfolio_Website` repository.

This is a SINGLE MASTER EXECUTION PROMPT. Do NOT divide the work into sub-phases, ask for intermediate approval, or stop after partial implementation.

## 1. Objective

Transform the existing portfolio into a unique, modern, recruiter-first Software Engineer portfolio for software engineering recruiters, hiring managers, and technical leads.

The first viewport must clearly communicate:
- who Ramprasad Prajapat is
- target role
- real technical direction
- professional experience
- strongest projects
- how to view the resume/contact him

Prioritize clarity, evidence, authenticity, and recruiter usability over decorative features.

Use the reference video and existing `Portfolio_Frontend_Master_Redesign_Prompt.md` as design guidance, but do NOT copy the reference person's identity, text, assets, exact CSS, or exact implementation.

## 2. Analyze the Actual Repository First

Before editing, inspect the actual source code, package.json, routes, pages, components, constants, assets, theme, SEO, resume, contact form, GitHub integration, coding profiles, project modal, command palette, deployment configuration, responsive styles, hooks, and existing UI primitives.

The source code is the source of truth. Do not rely only on old implementation summaries.

## 3. Simplify the Information Architecture

The current navbar contains too many items. Redesign it into a minimal recruiter-focused navbar.

Primary navigation:
- About
- Education
- Skills
- Projects
- Experience
- Contact

Keep Resume as a prominent action/CTA where appropriate.

Do not expose every secondary feature in the navbar. GitHub, Coding Profiles, Notes, Certifications, Recruiter Quick View, and similar utilities should remain accessible only where genuinely useful. Preserve legitimate routes unless they are truly redundant.

## 4. Remove the Separate Home Concept

The user does not want a redundant Home section.

The root `/` should directly present the professional introduction as the About/landing section. Do not create a separate Home section followed by another duplicate About.

Use one authoritative introduction:
- Hi, I am
- Ramprasad Prajapat
- Aspiring Software Engineer
- Java Full Stack Developer
- concise professional positioning
- primary stack
- strong CTAs
- legitimate profile links
- legitimate profile image if one already exists

Possible role animation phrases only:
- Aspiring Software Engineer
- Java Full Stack Developer
- Backend Developer

Keep any typewriter/rotation subtle and accessible.

## 5. Authoritative Personal Data

Use one centralized source of truth.

Name:
Ramprasad Prajapat

Positioning:
Aspiring Software Engineer | Java Full Stack Developer

Primary stack:
Java • Spring Boot • React.js • MySQL • REST APIs

Education:
B.Tech in Computer Science Engineering (CSE)
JIET Group of Institutions, Jodhpur
2023 – 2027
Current CGPA: 7.99
Final Year Student

Current:
Web Development Intern — Digital Hammerr®
May 2026 – Present
Udaipur, Rajasthan, India
On-site

Previous:
Web Developer — Shripriti Educational & IT Hub
May 2025 – June 2025
Remote

CRITICAL:
- CGPA is 7.99 everywhere.
- Never use 9.74.
- Degree is B.Tech CSE.
- Never change it to AI & ML.
- Never invent personal, academic, professional, project, certificate, metric, or social-profile data.

## 6. Complete Content Deduplication

Perform a repository-wide audit.

Remove unnecessary repetition of:
- introductions
- headings
- skills
- technology lists
- experience
- education
- CGPA
- project descriptions
- CTA sections
- social links

Each section must have a unique purpose:

About = identity and professional direction.
Education = academic background.
Skills = technical capability map.
Projects = engineering evidence.
Experience = professional evidence.
Certifications = legitimate credentials only.
Contact = hiring/contact conversion.
Footer = compact navigation/connectivity.

Do not repeat entire blocks just because they are useful. Keep information only where it adds context.

## 7. Recruiter-First Page Flow

Use this narrative:
1. About / Professional Introduction
2. compact professional snapshot only if it adds unique value
3. Education
4. Technical Skills
5. Projects
6. Professional Experience
7. Certifications only if meaningful
8. GitHub/Coding Profiles only if authentic and useful
9. Contact
10. compact Footer

Do not allow minor sections to dominate the first screen.

## 8. Skills — Professional Arrangement

Redesign Skills as a professional technical capability map.

Categories:
### Core Programming
Java

### Backend & Frameworks
Spring Boot
Spring Framework
Spring MVC
Spring Security
Servlets only if genuinely present

### Frontend
React.js
JavaScript
HTML5
CSS
Bootstrap

### Database
MySQL
SQL only if genuinely supported
JDBC

### APIs & Development
REST APIs
API Integration
Postman

### Version Control
Git
GitHub

### Deployment / Cloud
Render
Vercel
Aiven

### AI API Integration
OpenAI API
Gemini API

Do not use fake percentage bars, fake proficiency meters, years-of-experience counters, star ratings, or fabricated skill scores.

Make Java/backend/full-stack capability visually prominent and avoid duplicate badges.

## 9. Professional Experience

Use exactly one primary heading:
Professional Experience

Do not show competing headings such as Work History, Career Journey, Work Experience, and Professional Experience.

Current:
Web Development Intern
Digital Hammerr®
May 2026 – Present
Udaipur, Rajasthan, India
On-site

Use the legitimate existing description:
Working on full-stack web application development using Java, Spring Boot, React.js, MySQL, HTML, CSS, and JavaScript. Developing responsive user interfaces, REST APIs, and database-driven applications. Integrating third-party APIs and AI-powered features into web solutions while following clean coding practices. Collaborating with the team using Git & GitHub and deploying applications on Render, Vercel, and Aiven.

Previous:
Web Developer
Shripriti Educational & IT Hub
May 2025 – June 2025
Remote

Use the legitimate existing description. Do not repeat the entire Skills technology list inside every experience card.

## 10. Education

Use a clean professional timeline/card:
B.Tech in Computer Science Engineering
JIET Group of Institutions, Jodhpur
2023 – 2027
Final Year Student
Current CGPA: 7.99

Relevant coursework may be included only when useful:
Java Programming, Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering, Web Development.

Do not duplicate the education information throughout the site.

## 11. Projects

Prioritize projects relevant to Java, Spring Boot, REST APIs, React, MySQL, full-stack and backend development.

Use only authentic existing project data, such as:
- Rajasthan Civic Connect
- Food Delivery System
- Emotion Detection System
- Face Recognition Attendance System
- Fake News Detection System
- Smart Parking System
- Typing Runner
- Student Management System

Do not give every project equal prominence if that harms recruiter clarity.

Cards should communicate:
- project name
- problem/domain
- what was built
- key implementation/features
- actual stack
- legitimate GitHub/demo link if available

Never invent stars, forks, users, performance numbers, accuracy, fake demos, or fake repositories.

If no legitimate public link exists, show the project without a fake button.

Preserve and improve the existing Project Detail Modal where useful; the modal should add depth rather than duplicate the card word-for-word.

## 12. Certifications

Keep only legitimate certification data.

Known legitimate certificate:
HackerRank Python (Basic), issued September 2024.

Do not copy certificates from the reference video.

If only one certificate exists, keep the section compact. Never create filler cards.

## 13. GitHub / Coding Profiles / Notes

Audit these sections.

Keep useful existing functionality but never fabricate:
- repositories
- stars
- forks
- followers
- ratings
- solved counts
- streaks
- activity

If live data exists, display it accurately. If unavailable, use a compact truthful fallback with the real profile link.

If Notes or another section has no meaningful legitimate content, remove it from primary prominence rather than keeping a large empty section.

## 14. Resume

Preserve resume viewing/downloading. Make Resume a supporting CTA rather than a crowded primary navigation item.

Do not repeat the complete resume throughout the portfolio.

## 15. Contact

Use one clear recruiter conversion point.

Left:
- Let's Connect
- concise hiring-oriented invitation
- legitimate email
- legitimate LinkedIn
- legitimate GitHub

Right:
- name
- email
- message
- validation
- submit

Preserve React Hook Form + Zod if already present.

Because this task is frontend-only, do not claim that a message was delivered, stored, emailed, or saved to a database unless a real existing endpoint actually performs that function. If no real endpoint exists, use truthful frontend behavior.

## 16. Footer

Make it compact:
- name
- one-line identity
- minimal navigation
- legitimate social links
- copyright

Do not repeat the About, full skills, experience, project stack, or giant marketing copy.

## 17. Navbar Behavior

Desktop:
Brand + simplified primary links + Resume CTA + theme toggle.

Mobile:
Brand + theme toggle + menu trigger.

Behavior:
- scroll down: hide smoothly
- scroll up: show
- near top: always visible
- mobile menu open: navbar stays stable
- Escape closes menu
- navigation closes menu
- active section is highlighted
- smooth same-page scrolling
- correct fixed-navbar offset
- no flicker or layout jumps

## 18. Scrollspy

Scrollspy must match only the simplified primary navigation:
About, Education, Skills, Projects, Experience, Contact.

Do not create active states for hidden/secondary content.

## 19. Bidirectional Scroll Reveal

When scrolling down, content should progressively reveal as it enters the viewport.

When scrolling up, content leaving the viewport may reduce/hide according to the reveal model and reveal again when it re-enters.

Use IntersectionObserver, opacity, small translateY, optional subtle scale, 250–450ms ease-out, and restrained stagger for groups.

Do not hide the entire page, use aggressive parallax, animate every word, or make content inaccessible.

If JavaScript/observer fails, content must remain visible.

For prefers-reduced-motion:
- no distracting typewriter
- no stagger
- no unnecessary transforms
- content visible immediately or with minimal fade

## 20. UI/UX Direction

The final website must look like a real early-career Software Engineer portfolio, not a generic student template.

Design principles:
- modern
- clean
- technical
- premium
- restrained
- recruiter-friendly
- strong hierarchy
- high information density without clutter
- subtle visual personality

Avoid:
- excessive glassmorphism
- excessive neon/glow
- huge empty spaces
- giant cards everywhere
- too many badges
- decorative animations without purpose
- generic motivational copy
- unnecessary gradients
- unnecessary 3D

Translate the reference video's principles, not its exact implementation:
- polished hero
- clear section hierarchy
- strong typography
- professional cards
- refined timeline
- polished light/dark theme
- subtle animations
- responsive composition

## 21. Spacing

Perform a complete spacing audit.

Remove unnecessary:
- py-20
- py-24
- space-y-20
- space-y-24
- excessive mt/mb
- nested padding
- oversized card gaps
- blank visual blocks

Target:
Mobile: 36–48px major section spacing
Tablet: 48–56px
Desktop: 56–72px

Keep the layout breathable, not cramped.

## 22. Responsive Design

Audit at:
320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920px.

Check navbar, about/hero, buttons, headings, education, skills, projects, experience, certifications, GitHub, contact and footer.

No horizontal overflow, clipped text, broken grids, overlapping navbar, oversized mobile headings, overflowing buttons, or unnecessary whitespace.

## 23. Theme

Preserve existing Light/Dark/System functionality.

Dark:
deep professional background, readable text, controlled accents, subtle surfaces and borders.

Light:
clean white/off-white, readable dark text, subtle shadows, good contrast.

Do not unnecessarily replace a working theme architecture.

## 24. Accessibility

Ensure:
- one meaningful H1 for the landing/about area
- logical H2/H3 hierarchy
- keyboard navigation
- visible focus states
- aria-labels
- aria-expanded
- aria-controls
- accessible modal behavior
- form labels/errors
- sufficient contrast
- reduced motion support
- no hover-only interaction

## 25. Performance

Preserve the existing architecture and improve only where useful:
- lazy-load heavy routes/sections
- lazy-load non-critical images
- avoid unnecessary rerenders
- remove duplicate animation logic
- remove unused dependencies
- remove dead code
- optimize assets

Do not rewrite the project unnecessarily.

## 26. Code Architecture

Use existing reusable primitives when present:
Container, Section, SectionHeader, Button, Card, Badge, Modal, Reveal, LoadingState, ErrorState, EmptyState.

Avoid duplicate components, duplicate hooks, duplicate constants, giant components, any types, dead code, unnecessary abstraction, and unnecessary dependencies.

Centralize portfolio data and render components from the source of truth.

## 27. SEO

Maintain/update:
- title
- description
- canonical
- Open Graph
- Twitter metadata
- Person JSON-LD

All SEO data must use current truthful information.

## 28. Production Cleanup

Search the entire project for:
9.74, Lorem, placeholder, dummy, example.com, fake GitHub URLs, fake demo URLs, TODO, FIXME, console.log, mock data, fake statistics, fake certificates, duplicate headings, duplicate skills, repeated experience, excessive spacing, unused imports/components/dependencies.

Fix genuine issues. Do not delete legitimate technical text merely because it contains a search term.

## 29. Hard Preservation Rule

Do not unnecessarily change:
- React
- Vite
- routing architecture
- theme
- command palette
- Recruiter Quick View
- resume viewing/downloading
- project modal
- GitHub integration
- coding profiles
- contact validation
- legitimate links
- real projects
- real experience
- existing assets
- deployment configuration

Only change these when required for this redesign.

If uncertain: PRESERVE.

## 30. Frontend Only

Do NOT add:
- backend
- database
- authentication
- server
- CMS
- API server
- persistence layer

## 31. No Demo/Mock Content

The final website must be production-level. Remove demo projects, mock repositories, fake metrics, fake testimonials, fake logos, fake certificates, placeholder URLs, generated filler, and fake statistics.

## 32. No Unnecessary Features

Do not add fake dashboards, fake analytics, fake counters, fake testimonials, visitor counters, unnecessary blogs, unnecessary 3D, unnecessary AI chatbot, or decorative features without hiring value.

Every feature must support recruiter understanding or usability.

## 33. Quality Bar

The final result should communicate:
“A professional early-career Software Engineer built this to demonstrate real engineering work.”

Optimize:
clarity > quantity
evidence > claims
quality > decoration
recruiter usability > feature count
authenticity > visual exaggeration

## 34. Single Execution Requirement

Implement ALL requirements in this prompt in one continuous execution.

Do NOT:
- stop at an implementation plan
- ask for approval
- ask which phase comes next
- split work into sub-phases
- leave partial tasks for another prompt
- create another master plan

You may internally organize the work however needed, but execute the entire requested change before returning the final report.

## 35. Static Validation Only

The user will manually test the website.

Do NOT launch browser automation, Playwright, Cypress, automated screenshots, or visual QA agents.

You may inspect source/assets and run:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

Fix all genuine errors/warnings.

## 36. Final Global Verification

Before completion verify:
- no redundant Home section
- About is the landing section
- navbar is simplified
- duplicate content removed
- CGPA is 7.99 everywhere
- B.Tech CSE everywhere
- no AI & ML degree claim
- skills professionally arranged
- exactly one Professional Experience heading
- current Digital Hammerr® data is accurate
- previous Shripriti data is accurate
- projects are authentic
- certifications are authentic
- GitHub/coding data is authentic
- no fake metrics/URLs/mock content
- navbar scroll direction behavior implemented
- scrollspy matches simplified navigation
- bidirectional reveal works safely in source
- reduced motion supported
- responsive layout addressed
- unnecessary spacing removed
- existing useful functionality preserved
- frontend-only scope maintained
- SEO/accessibility/performance reviewed
- no dead/debug code
- lint passes
- TypeScript passes
- production build passes

## 37. Final Response

After completing implementation, provide ONE final report only:

### Complete Frontend Redesign
### Recruiter-Focused Information Architecture
### Content Deduplication
### UI/UX Improvements
### Existing Functionality Preserved
### Production Cleanup
### Frontend Scope
Explicitly confirm backend/database/authentication were NOT added.

### Validation
Report:
- npm run lint
- npx tsc --noEmit
- npm run build

### Remaining Issues
Only genuine unresolved issues.

Do not claim browser testing was performed.

# FINAL COMMAND

Now inspect the actual `Portfolio_Website` repository and implement this entire master prompt directly.

Do not stop after analysis.
Do not ask for approval.
Do not divide into sub-phases.
Do not create another implementation plan.
Do not wait between tasks.

Make the minimum safe changes necessary to produce the complete recruiter-focused production frontend while preserving legitimate existing functionality and authentic user data.
