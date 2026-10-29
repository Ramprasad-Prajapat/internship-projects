# MASTER PROMPT — COMPLETE FRONTEND REDESIGN + VIDEO-REFERENCE FIDELITY FOR MY EXISTING PORTFOLIO

## EXECUTION MODE

Act as a **Senior Software Engineer, Senior Frontend Engineer, Senior UI/UX Engineer, Frontend Architect, Accessibility Engineer, Performance Engineer, and Production Code Reviewer**.

You are modifying my **existing `Portfolio_Website` frontend**.

I have supplied:
1. My existing portfolio source/ZIP.
2. A screen-recording reference video.
3. Extracted reference frames from that video.

Your job is to perform **one complete, continuous frontend implementation** after deeply analyzing both the reference video and the actual current codebase.

### CRITICAL: SINGLE MASTER EXECUTION

This is ONE master task.

I do NOT want:
- sub-prompts
- sub-phases
- "phase 1 / phase 2" interactions
- asking me what to implement next
- asking me to approve an implementation plan
- stopping after one page
- implementing only the visual theme
- implementing only Home
- creating a future-work list instead of implementing
- asking for another prompt
- waiting for approval between related changes

You may internally organize your work however you need, but **do not divide the work into user-facing sub-phases**.

Read → analyze → decide → implement → audit → fix → statically validate → give ONE final report.

Do not stop merely because lint/build passed if the requested design or content requirements are still incomplete.

---

# 1. ABSOLUTE SCOPE

This task is:

> **Complete production-level frontend redesign and refinement of my existing portfolio using the supplied video as a detailed visual/interaction reference.**

This task is NOT:

- backend development
- database development
- authentication
- admin panel
- CMS
- server implementation
- API server implementation
- database schema
- email server
- production contact backend
- new full-stack architecture

### Backend/database rule

**DO NOT ADD BACKEND OR DATABASE NOW.**

I will explicitly ask for backend and database later.

Do not create backend code merely to make the frontend appear more complete.

Do not add:
- Express server
- Spring Boot server
- Node backend
- SQL schema
- MongoDB database
- authentication
- server-side contact handling
- email service

Keep the existing frontend API/service integrations only where they already exist and are useful. Do not fabricate API results.

---

# 2. HIGHEST PRIORITY: ANALYZE THE VIDEO DEEPLY BEFORE CODING

The reference video is approximately 27 seconds and shows a complete developer portfolio experience across:

- initial hero
- navigation
- About
- Education
- Skills
- Projects
- Certifications
- Contact
- Footer
- dark theme
- light theme
- active navigation state
- scrolling behavior
- theme switching
- section transitions/reveals

The video is **NOT a source of personal data**.

It is a source of:
- visual language
- layout principles
- spacing rhythm
- interaction behavior
- responsive concepts
- animation behavior
- navigation behavior
- component composition
- content density
- hierarchy

### DO NOT COPY

Never copy from the video:
- person's name
- person's image
- person's education
- person's company
- person's projects
- person's certificates
- person's links
- person's statistics
- person's exact descriptions
- person's technology claims
- person's exact text
- exact HTML
- exact CSS
- exact pixel measurements
- exact visual assets

The final site must represent **Ramprasad Prajapat** only.

---

# 3. VIDEO DESIGN/INTERACTION ANALYSIS — IMPLEMENT ALL RELEVANT BEHAVIOR

Before modifying code, inspect the full video and reference frames.

The video demonstrates the following design characteristics that MUST be considered and reproduced in an original implementation using my actual content.

## 3.1 Global visual language

Reference characteristics:
- dark navy/purple page background
- clean light theme alternative
- strong purple/blue accent
- gradient accent typography
- subtle card surfaces
- thin borders
- moderate rounded corners
- restrained shadows
- strong centered section titles
- generous but controlled whitespace
- professional developer-portfolio visual hierarchy
- consistent iconography
- sticky/fixed navigation
- section-based single-page flow

Do NOT blindly copy exact colors.

Create a polished color system appropriate for a Java Full Stack Software Engineer portfolio.

---

# 4. NAVBAR — MATCH THE REFERENCE BEHAVIOR, NOT JUST THE APPEARANCE

The reference has a persistent top navigation with:

- brand/logo on left
- section links centered/right
- active section highlighted in accent color
- theme switch on right
- dark/light visual states
- fixed/sticky top position
- subtle bottom divider
- compact height
- clean typography

Implement all of the following:

### Desktop
- fixed/sticky navbar
- logo/brand
- About
- Education
- Skills
- Projects
- Certifications
- Contact
- theme toggle
- active navigation state

### Scrollspy
The active navbar item MUST update based on the section currently visible.

Example:
- About visible → About active
- Education visible → Education active
- Skills visible → Skills active
- Projects visible → Projects active
- Certifications visible → Certifications active
- Contact visible → Contact active

Do not use a hardcoded active link.

Use a reliable IntersectionObserver/scrollspy approach.

### Scroll direction behavior

Preserve/improve the user's requested behavior:

- scrolling DOWN → navbar can smoothly hide
- scrolling UP → navbar MUST appear
- near top → navbar MUST remain visible
- mobile menu open → navbar MUST remain usable/visible
- no flicker
- no jitter
- no rapid show/hide oscillation
- no layout jump
- no excessive scroll event processing

### Mobile
Use a compact mobile navbar with:
- brand
- theme toggle
- menu trigger
- accessible menu
- active section
- proper `aria-expanded`
- proper `aria-controls`
- Escape handling where appropriate

Do not let scroll-hide behavior break the mobile menu.

---

# 5. THEME SWITCH — IMPLEMENT THE FULL REFERENCE CONCEPT

The video visibly demonstrates both dark and light themes.

Preserve the existing theme architecture if present.

Improve it so that:

## Dark mode
- deep navy/purple background
- high readability
- accent gradients
- subtle card surfaces
- controlled borders
- strong but not excessive glow

## Light mode
- clean white/off-white background
- dark readable text
- subtle shadows
- clean borders
- accent colors remain visible
- no washed-out content
- no low-contrast cards

Theme transition should be smooth but lightweight.

Do not use a heavy animation system for theme switching.

Theme choice must persist if the existing implementation supports persistence.

Respect system preference if already implemented.

---

# 6. HERO — REBUILD TO THE SAME LEVEL OF VISUAL QUALITY

The reference hero uses a strong two-column structure.

Implement an original version for my identity.

## Left side

Use:

**Hi, I am**

**Ramprasad Prajapat**

Primary identity:
**Aspiring Software Engineer**

Secondary positioning:
**Java Full Stack Developer**

Primary stack:
**Java • Spring Boot • React.js • MySQL • REST APIs**

Create a concise professional description.

Do NOT use a huge paragraph.

The first screen should communicate:
- who I am
- what role I target
- what I build
- my primary stack
- how to contact/view work

## Typewriter / rotating role behavior

The reference shows changing/typing role text.

Implement a subtle typewriter/rotating role effect ONLY using legitimate roles from my profile.

Possible legitimate role phrases:
- Aspiring Software Engineer
- Java Full Stack Developer
- Backend Developer

Do not create fake job titles.

The animation must:
- be subtle
- be accessible
- pause/reduce under reduced motion
- not cause layout shifts
- not harm readability

## CTA hierarchy

Use clear actions such as:
- Explore Projects
- View Resume
- Contact Me

Use actual working routes/links.

Do not create fake links.

## Social links

Show only legitimate social/profile links already supported by the current portfolio.

Do not invent:
- GitHub URLs
- LinkedIn URLs
- X/Twitter URLs
- email addresses

## Right side

If a legitimate profile image already exists in the project:
- reuse it
- crop it professionally
- create a polished frame inspired by the reference
- use an original border/gradient treatment
- preserve the real identity

DO NOT use the reference person's image.

If no legitimate profile image exists:
- do not invent a person's identity
- use a professional text/graphic composition instead

### Hero visual treatment

The reference has:
- large profile visual
- asymmetric/rounded image framing
- colorful border
- strong visual balance
- shadow/depth
- two-column alignment

Use the same DESIGN PRINCIPLE, not the exact implementation.

---

# 7. HERO SCROLL/ENTRY EXPERIENCE

The hero should not feel static.

Use subtle entry animations:
- heading fade/slide
- role reveal
- paragraph reveal
- CTA reveal
- social icon reveal
- image reveal

Do not animate every individual word.

Do not use aggressive parallax.

Do not create motion that distracts recruiters.

---

# 8. SCROLL REVEAL SYSTEM — MUST WORK IN BOTH DIRECTIONS

This is one of my explicit requirements.

When I scroll DOWN:
- content should progressively appear as it enters the viewport
- Home content
- About
- Education
- Skills
- Projects
- Experience
- Certifications
- GitHub/coding profiles if present
- Contact
- Footer where appropriate

When I scroll UP:
- content that leaves the viewport toward the bottom should be able to become hidden/reduced again according to the reveal model
- when it re-enters the viewport, it should reveal again

The effect must be subtle.

Use:
- IntersectionObserver
- opacity
- small translateY
- optional slight scale
- short duration
- stagger only for groups/cards

Recommended:
- opacity 0 → 1
- translateY 8–20px → 0
- duration around 250–450ms
- easing ease-out

### Critical behavior

Do not hide the entire page permanently.

Content must remain accessible when:
- JavaScript fails
- reduced motion is enabled
- the observer is unavailable
- the user has accessibility preferences

CSS should provide a safe visible fallback.

### Reduced motion

If `prefers-reduced-motion: reduce`:
- no large movement
- no typewriter if distracting
- no stagger
- no unnecessary transforms
- content immediately visible or very lightly faded

---

# 9. SECTION TRANSITION DESIGN

The reference uses very large section headings and clear visual separation.

Implement:
- strong centered section titles
- consistent accent gradient
- compact subtitle
- controlled top/bottom spacing
- section IDs matching navigation
- scroll-margin-top to account for fixed navbar

Examples:
- About
- Education
- Technical Skills
- Projects
- Certifications
- Contact

Do not create duplicate headings.

For each major section:
- one primary heading
- optional concise supporting line
- content
- no repeated competing title

---

# 10. ABOUT SECTION

The reference begins with a professional introduction.

My site already has an About page/section.

Do NOT duplicate the Hero paragraph.

Hero:
- short
- positioning-focused

About:
- professional context
- development interests
- Java Full Stack direction
- practical project experience
- internship experience
- engineering mindset
- continuous learning

Keep it concise and recruiter-friendly.

Remove:
- repeated introduction
- repetitive "I am..." blocks
- unnecessary generic motivational copy

---

# 11. EDUCATION — REFERENCE-INSPIRED TIMELINE

The reference uses a visual education timeline:
- vertical center line
- timeline marker
- alternating cards
- date
- degree
- institution
- description

Use that design principle.

My authoritative education:

**B.Tech in Computer Science Engineering (CSE)**
**JIET Group of Institutions, Jodhpur**
**2023 – 2027**
**Current CGPA: 7.99**
**Final Year Student**

IMPORTANT:
- CGPA = **7.99**
- NEVER use 9.74
- Degree = **B.Tech CSE**
- NEVER change it to AI & ML

### Timeline behavior

Desktop:
- visually balanced timeline
- cards can alternate around center line if useful

Mobile:
- single-column
- left-aligned timeline
- no cramped alternating layout
- no horizontal overflow

Do not create fake academic details.

If previous education exists and is legitimate, retain only if useful.

---

# 12. SKILLS — REBUILD PROFESSIONALLY

Skills must look like a Software Engineer's technical profile, not a beginner skill dump.

The reference organizes skills into visually distinct cards.

Create a clean professional grid.

Preferred categories:

## Core Programming
- Java

## Backend & Frameworks
- Spring Boot
- Spring Framework
- Spring MVC
- Spring Security
- Servlets if genuinely present

## Frontend
- React.js
- JavaScript
- HTML5
- CSS
- Bootstrap

## Database
- MySQL
- SQL if genuinely supported
- JDBC

## APIs & Development
- REST APIs
- API Integration
- Postman

## Version Control
- Git
- GitHub

## Deployment
- Render
- Vercel
- Aiven

## AI API Integration
- OpenAI API
- Gemini API

ONLY show technologies that are actually supported by my current portfolio/source.

Do not import technologies from the reference video.

### Visual skill card behavior

Each card:
- category heading
- subtle gradient/underline
- technology badges
- icons only where legitimate and available
- responsive wrapping
- no fake progress
- no fake percentages
- no circular meters
- no 80%/90%/95% bars
- no duplicate technologies across multiple cards unless there is a genuine reason

Java must remain the primary programming-language focus.

REST APIs must not be repeated unnecessarily.

### Skill hierarchy

Make Java visually prominent.

Make:
- Java
- Spring Boot
- React.js
- MySQL
- REST APIs

easy to identify as the primary stack.

---

# 13. PROJECTS — VIDEO-LEVEL PRESENTATION

The reference project section has:
- large centered heading
- short description
- visual project cards
- project image at top
- title
- description
- technology tags
- action buttons

Use this structure for my real projects.

Potential legitimate existing projects include:
- Rajasthan Civic Connect
- Food Delivery System
- Smart Parking System
- Typing Runner
- Student Management System
- Real-Time Emotion Detection System
- Face Recognition Attendance System
- Fake News Detection System

Do not assume every item is still active without checking the source.

### Project card

Each card should support:
- real project image if available
- fallback visual if no image exists
- title
- concise problem/solution summary
- technology badges
- GitHub button only if real
- live/demo button only if real
- optional details button/modal if already supported

### Visual behavior

- consistent card height where practical
- image aspect ratio consistent
- image object-cover
- subtle hover lift
- subtle image zoom if appropriate
- clear focus state
- buttons remain readable
- mobile stacking

### No fake links

Never use:
`https://github.com`

as a placeholder.

Never use fake demo links.

If no link:
- omit button
- or use a truthful unavailable state

---

# 14. PROJECT DETAILS / MODAL

If the existing portfolio already has a project detail modal:
- preserve it
- improve it
- ensure it matches the redesigned visual system

Requirements:
- accessible dialog
- Escape closes
- backdrop behavior
- focus handling
- scroll lock
- clear close button
- responsive modal
- project data remains authentic

Do not add a modal merely for decoration if the current design works better without it.

---

# 15. PROFESSIONAL EXPERIENCE — FIX THE INFORMATION ARCHITECTURE

The user specifically wants:

**Professional Experience**

This should be the primary heading.

Do NOT display competing headings such as:
- Work History
- Experience
- Professional Experience

for the same information.

Use exactly one main title for the experience content.

## Current experience

### Web Development Intern — Digital Hammerr®

May 2026 – Present  
Udaipur, Rajasthan, India  
On-site

Preserve legitimate existing responsibilities and technologies from the portfolio source.

## Previous experience

### Web Developer — Shripriti Educational & IT Hub

May 2025 – June 2025  
Remote

Use only existing legitimate information.

### Experience card/timeline

Each entry should clearly expose:
- role
- organization
- duration
- location
- work mode
- responsibilities
- technology stack

Use concise bullet points or compact paragraphs.

Do not invent:
- achievements
- metrics
- client numbers
- revenue
- performance percentages
- responsibilities not supported by source

---

# 16. CERTIFICATIONS

The reference uses clean certification cards.

Implement an original version for my actual certifications.

Current legitimate certification data must be read from the actual source.

If the current portfolio contains:

**HackerRank Python (Basic)**  
Issued September 2024

keep it accurately.

Do not copy reference-video certifications such as:
- AWS Foundation
- Oracle AI Foundation
- Postman API Testing
- DSA certificates

unless they independently exist in my actual data.

### Certification card

Use:
- certificate/provider icon where legitimate
- title
- provider
- short description if supported
- issue date
- View link if legitimate

Do not create huge empty grids.

If only one certificate exists:
- make the section compact
- avoid artificial filler

---

# 17. GITHUB / CODING PROFILES / NOTES

Audit existing:
- GitHub
- coding profiles
- engineering notes
- learning sections

Do not remove useful existing functionality without a reason.

If data is dynamic:
- LoadingState
- ErrorState
- EmptyState
- Retry where applicable

Do not fabricate:
- repo counts
- stars
- forks
- followers
- coding ratings
- solved counts

If live API data is unavailable:
- professional fallback
- actual profile link if known
- no fake numbers

If a section does not contain meaningful legitimate content:
- remove it from prominent navigation/layout
- do not leave a large empty block

---

# 18. CONTACT — MATCH THE REFERENCE STRUCTURE

The reference has a two-column contact section.

Implement:

## Left
- "Let's Connect" or similarly professional heading
- concise invitation
- legitimate email
- legitimate LinkedIn
- legitimate GitHub
- other legitimate profiles if supported

## Right
- name if existing form supports it
- email
- message
- validation
- submit button
- loading state
- success state
- error state

### Frontend-only honesty rule

Because backend/database is NOT being implemented:

Do not claim:
- message successfully sent to an email server
- backend connected
- database stored
- email delivered

If current frontend uses an existing endpoint:
- preserve it if legitimate
- use environment configuration
- handle errors honestly

If no real endpoint exists:
- keep frontend validation/UI
- use a truthful frontend-only behavior
- do not fake successful delivery

---

# 19. FOOTER — MATCH THE REFERENCE INFORMATION ARCHITECTURE

The reference footer has a clean multi-column structure.

Use:
- identity/name
- short professional description
- navigation links
- social/connect links
- copyright

Avoid:
- repeating the entire About section
- repeating the Hero
- repeated stack lists
- huge footer padding
- meaningless marketing text

Footer should be compact and professional.

---

# 20. CONTENT DEDUPLICATION — VERY IMPORTANT

Perform a complete content audit.

Remove duplicate:
- headings
- introductions
- skill badges
- experience blocks
- education details
- project descriptions
- CGPA displays
- technology lists
- CTA sections
- social links where repetition adds no value

### Example

If the same:
"Java • Spring Boot • React.js • MySQL • REST APIs"

appears 5 times:
- keep it where strategically useful
- remove unnecessary repetition

Do not remove useful information merely because it appears in two contexts.

The goal is:
**lower cognitive load + stronger hierarchy.**

---

# 21. CURRENT CGPA — GLOBAL SOURCE-OF-TRUTH CORRECTION

Search the entire codebase.

Replace all old CGPA references.

The ONLY current CGPA is:

**7.99**

Search for:
- `9.74`
- hardcoded CGPA values
- duplicate education objects
- old metadata

Ensure:
- Home
- About
- Education
- Recruiter snapshot
- Resume
- Footer
- SEO/JSON-LD
- any other page

use the correct source of truth.

Do not leave old values in comments, constants, metadata, or hidden content.

---

# 22. RESPONSIVE DESIGN — COMPLETE AUDIT

The website must be excellent at:

- 320px
- 360px
- 375px
- 390px
- 430px
- 768px
- 820px
- 1024px
- 1280px
- 1440px
- 1920px

Audit:
- navbar
- hero
- profile image
- CTA buttons
- social icons
- section headings
- education timeline
- skills cards
- project grid
- experience timeline
- certification grid
- GitHub
- contact
- footer

No:
- horizontal scrolling
- clipped text
- broken cards
- overflowing buttons
- fixed-width problems
- overlapping navbar
- oversized mobile headings
- excessive empty whitespace

---

# 23. SPACING — REMOVE UNWANTED MARGIN/PADDING

One of my explicit requirements is to remove unnecessary margin/padding.

Perform a complete spacing audit.

Remove:
- unnecessary `py-20`
- `py-24`
- `space-y-20`
- `space-y-24`
- excessive `mt-20`
- excessive `mb-20`
- excessive nested padding
- oversized gaps
- empty vertical blocks

But do not make the page cramped.

Target approximately:

Mobile:
36–48px major section spacing

Tablet:
48–56px

Desktop:
56–72px

Use consistent spacing tokens.

The site should feel:
- compact
- intentional
- breathable
- recruiter-friendly

---

# 24. TYPOGRAPHY

Create a strong hierarchy.

Recommended hierarchy:
- Hero name: very large
- Hero role: large accent
- section headings: large, bold, visually distinct
- card titles: medium/large
- body: readable
- metadata: smaller but legible
- buttons: strong readable labels

Avoid:
- too many font weights
- giant paragraphs
- tiny text
- inconsistent capitalization
- random font sizes

The reference uses bold gradient section titles.

Use that concept carefully.

---

# 25. CARD SYSTEM

Create a consistent card language.

Cards should share:
- border radius
- border color
- surface color
- shadow behavior
- padding
- hover behavior
- dark/light behavior

But do not make every section look identical.

Use variants where appropriate:
- standard card
- project card
- timeline card
- skill category card
- certification card
- contact card

Do not create multiple components that solve the same problem.

---

# 26. ICONS

Use existing icon library/assets where already present.

Do not install large icon packs unnecessarily.

Icons should:
- have consistent size
- have accessible labels when interactive
- not replace text where text is required
- match light/dark themes

Do not copy the exact icon assets from the reference.

---

# 27. ANIMATION SYSTEM

Animations must feel intentional.

Use:
- section reveal
- card reveal
- subtle hover
- image hover
- theme transition
- typewriter/role transition if implemented
- navbar transition

Avoid:
- excessive bouncing
- huge zooms
- spinning content
- continuous decorative motion
- animation on every element
- expensive scroll listeners

Use CSS/Framer Motion only where the existing stack supports it.

Do not add a heavy animation framework unnecessarily.

---

# 28. ACCESSIBILITY

Audit the complete frontend.

Ensure:
- semantic HTML
- one meaningful H1 per page
- correct H2/H3 hierarchy
- labels connected to inputs
- keyboard navigation
- focus-visible styles
- accessible mobile menu
- accessible modal
- correct `aria-expanded`
- correct `aria-controls`
- appropriate `aria-current`
- meaningful image alt text
- external links use safe rel attributes
- sufficient contrast
- visible focus states

Do not overuse ARIA.

---

# 29. PERFORMANCE

Keep the site fast.

Audit:
- image sizes
- image formats
- lazy loading
- `decoding="async"`
- route-level code splitting
- unnecessary re-renders
- animation performance
- dependency size
- unused dependencies
- large assets

Do not introduce expensive global scroll listeners.

Use IntersectionObserver for reveal/scrollspy where practical.

---

# 30. SEO

Preserve and improve:
- page titles
- meta descriptions
- canonical URLs
- Open Graph
- Twitter metadata
- robots.txt
- sitemap
- manifest
- structured data

Person JSON-LD must represent:

**Ramprasad Prajapat**

Use only legitimate facts.

Do not include:
- reference person's information
- fake job titles
- fake organizations
- fake URLs
- unsupported statistics

Education structured data must use:
**B.Tech in Computer Science Engineering (CSE)**

CGPA must not be falsely represented as 9.74.

---

# 31. SECURITY

Search for:
- API keys
- secrets
- tokens
- unsafe HTML
- unsafe eval
- exposed credentials
- sensitive console logs

Do not expose secrets in frontend.

If an API key is required for a browser-side service:
- verify whether it is intended to be public
- do not invent credentials
- do not commit secrets

---

# 32. REMOVE DEMO / MOCK / PLACEHOLDER CONTENT

This is a production-level portfolio.

Remove genuine:
- dummy data
- mock projects
- fake repositories
- fake statistics
- placeholder URLs
- placeholder emails
- example.com
- fake demo links
- fake certifications
- fake testimonials
- fake client logos
- fake metrics
- lorem ipsum
- generated filler

Search for:
- `Lorem`
- `placeholder`
- `dummy`
- `example`
- `example.com`
- `test`
- `TODO`
- `FIXME`
- `console.log`
- `9.74`
- fake GitHub URLs
- fake demo URLs

IMPORTANT:
Do not delete legitimate occurrences merely because the word "test" appears in valid technical text.

---

# 33. EXISTING FUNCTIONALITY PRESERVATION — HARD RULE

Do NOT unnecessarily change working functionality.

Preserve:
- React
- Vite
- existing routing
- existing pages
- existing theme system
- command palette
- recruiter quick view
- resume viewing/downloading
- contact validation
- GitHub integration
- coding profiles
- project modal
- existing deployment configuration
- legitimate links
- real project data
- legitimate experience
- existing assets

Only modify them where necessary to satisfy the redesign and requirements.

### If uncertain:

**PRESERVE.**

Do not rewrite architecture just to make the code look different.

---

# 34. DO NOT CHANGE MY IDENTITY OR REAL DATA

Authoritative identity:

**Ramprasad Prajapat**

Positioning:

**Aspiring Software Engineer | Java Full Stack Developer**

Primary stack:

**Java • Spring Boot • React.js • MySQL • REST APIs**

Education:

**B.Tech in Computer Science Engineering (CSE)**  
**JIET Group of Institutions, Jodhpur**  
**2023 – 2027**  
**Current CGPA: 7.99**  
**Final Year Student**

Current experience:

**Web Development Intern — Digital Hammerr®**  
**May 2026 – Present**  
**Udaipur, Rajasthan, India**  
**On-site**

Previous:

**Web Developer — Shripriti Educational & IT Hub**  
**May 2025 – June 2025**  
**Remote**

Use actual existing portfolio data for:
- projects
- links
- certificates
- social profiles
- descriptions

Do not invent missing facts.

---

# 35. PROJECT/CONTENT PRIORITY

The site should communicate this hierarchy:

1. Software Engineer identity
2. Java Full Stack focus
3. Current internship
4. Strong technical stack
5. Real projects
6. Education
7. Certifications
8. Contactability

Do not let minor sections dominate the first screen.

---

# 36. NAVIGATION INFORMATION ARCHITECTURE

Use a clean navigation similar in concept to the reference:

- About
- Education
- Skills
- Projects
- Certifications
- Contact

If the current site has additional routes/pages such as:
- Resume
- Experience
- GitHub
- Coding Profiles
- Notes

do not automatically delete them.

Instead:
- determine whether they should remain as dedicated pages
- determine whether their content belongs in the main portfolio flow
- remove only genuinely redundant/low-value navigation
- preserve route functionality if it is legitimate and useful

The navigation must remain understandable.

---

# 37. SMOOTH SCROLLING

For same-page section navigation:
- use smooth scrolling
- account for fixed navbar offset
- update active state
- avoid sudden jumps

Respect reduced motion:
- use instant/less motion when requested

---

# 38. MOBILE MENU

Mobile menu must:
- open reliably
- close on navigation
- close on Escape
- support keyboard focus
- prevent accidental background interaction where appropriate
- not jump layout
- preserve theme toggle
- display active section
- remain readable at 320px width

---

# 39. CONTACT FORM VALIDATION

If current implementation uses `react-hook-form` + Zod:
- preserve it
- improve it if needed

Validate:
- required fields
- email format
- message length

Show:
- field-level errors
- pending state
- success/error state
- accessible messages

Do not fake backend delivery.

---

# 40. EMPTY STATES

If legitimate content is unavailable:
- show a compact professional empty state
- do not fabricate content
- do not create huge blank regions
- do not use fake cards

Examples:
- no GitHub data
- no coding profile data
- unavailable project demo
- no certificate link

---

# 41. CODE ARCHITECTURE

Use the existing architecture unless a localized refactor is required.

Prefer reusable primitives already present:
- Container
- Section
- SectionHeader
- Button
- Card
- Badge
- Modal
- Reveal
- LoadingState
- ErrorState
- EmptyState

Avoid:
- duplicate components
- duplicate utility logic
- giant page components
- `any`
- dead code
- repeated constants
- unnecessary abstraction
- unnecessary dependencies

Use explicit TypeScript types.

---

# 42. DATA SOURCE OF TRUTH

Do not hardcode the same content in multiple components.

Use centralized portfolio data/constants where practical.

For example:
- identity
- education
- experience
- skills
- projects
- certifications
- social links

should have one authoritative source.

Components should render from the source.

This is especially important for:
- CGPA
- degree
- name
- experience
- skills

---

# 43. EXACT REFERENCE VIDEO ELEMENTS TO TRANSLATE INTO MY SITE

The video demonstrates several details that the previous generic implementation must not overlook.

Implement equivalent original behavior for:

### Hero
- two-column layout
- left-aligned identity
- huge gradient name
- accent role line
- concise description
- primary/secondary CTA
- social icon row
- profile image on right
- stylized image border
- fixed navbar above

### Navbar
- logo mark
- brand text
- centered links
- active link accent
- theme pill
- sticky position

### Education
- large centered section title
- vertical timeline
- alternating cards on desktop
- date in accent
- institution highlighted
- compact description
- responsive single-column mobile

### Skills
- large section title
- supporting description
- 2-column category grid
- category title with accent underline
- technology pills with icons
- light/dark variants
- card surfaces

### Projects
- large centered section title
- supporting description
- visual screenshots
- 2-column project grid on desktop
- project title
- description
- tech badges
- GitHub/demo actions
- responsive stacking

### Certifications
- large centered title
- supporting description
- 3-column desktop cards
- certification icon
- provider
- description
- date
- View action
- responsive grid

### Contact
- large centered title
- two-column contact layout
- left connection information
- right form
- large input fields
- large textarea
- full-width primary submit
- clean card surfaces

### Footer
- divider
- three-column desktop layout
- identity/description
- Links
- Connect
- social icons
- copyright row
- compact spacing

### Theme
- dark and light variants
- theme switch
- color/surface transitions
- readable contrast

---

# 44. REFERENCE VIDEO SPACING LESSON

The reference contains some large whitespace between major sections.

Do NOT blindly copy excessive empty space.

Use the reference's:
- breathing room
- section separation
- visual rhythm

but improve it for my requirement:
**remove unwanted extra margin/padding.**

The final result should be tighter and more efficient than a literal recreation.

---

# 45. REFERENCE VIDEO CONTENT DENSITY LESSON

The reference has relatively few high-level sections with strong visual identity.

My portfolio may contain more legitimate information.

Do NOT delete legitimate content merely to reduce page length.

Instead:
- consolidate duplicates
- prioritize information
- make secondary content compact
- use dedicated routes when appropriate
- keep recruiter-facing information prominent

---

# 46. PROFILE IMAGE SAFETY

Never use the reference person's profile photo.

If my current site contains a real profile photo:
- use it
- improve framing
- preserve identity

If not:
- do not generate a fake identity image
- use an abstract/software-engineering visual treatment

---

# 47. NO FAKE METRICS

Do not create:
- "8+ projects" unless verified from actual data
- "85% accuracy" unless already supported by the actual project data
- "100+ users"
- "50+ repositories"
- "10K lines of code"
- "95% proficiency"
- "99% performance"

Only use verified metrics from the current source.

---

# 48. RESUME

Preserve current resume functionality.

Improve the presentation if necessary:
- clean toolbar
- view/download
- print if already supported
- responsive viewer
- proper fallback

Do not generate a fake resume.

Do not fabricate resume content.

---

# 49. PWA / MANIFEST / ROBOTS / SITEMAP

Audit existing:
- manifest
- robots.txt
- sitemap.xml
- service worker

Do not add PWA complexity if unnecessary.

If existing PWA functionality is legitimate:
- preserve it
- ensure it does not cache sensitive/API data incorrectly
- ensure metadata is correct

Do not introduce unrelated PWA features.

---

# 50. ROUTING / 404

Preserve current routing.

If a proper 404 page exists:
- improve it visually.

If missing:
- add a minimal production-level NotFound page.

Do not break existing routes.

---

# 51. FINAL GLOBAL SEARCH

After implementation, search the entire project for:

- `9.74`
- old degree
- wrong degree
- duplicate CGPA
- `Lorem`
- `placeholder`
- `dummy`
- `example.com`
- fake GitHub URLs
- fake demo URLs
- `TODO`
- `FIXME`
- `console.log`
- mock project data
- fake statistics
- duplicate headings
- duplicate skills
- repeated experience sections
- unnecessary large spacing classes
- unused imports
- unused components
- unused dependencies

Fix every genuine issue found.

---

# 52. STATIC VALIDATION

Run:

```bash
npm run lint
```

Then:

```bash
npx tsc --noEmit
```

Then:

```bash
npm run build
```

Fix genuine errors/warnings.

Do not stop at the first passing command.

The implementation is complete only when:
- lint passes
- TypeScript passes
- production build passes

Also inspect the final source for:
- broken imports
- invalid routes
- missing assets
- missing references
- unused code
- duplicate content

---

# 53. DO NOT PERFORM BROWSER TESTING

I will manually test the website.

Therefore:

DO NOT:
- launch browser testing
- run browser automation
- use Playwright/Cypress for visual testing
- create browser screenshots
- start a visual QA agent
- perform automated UI testing

You may:
- inspect source code
- inspect assets
- inspect existing files
- run static commands
- run lint
- run TypeScript
- run build

Do not claim browser/UI behavior was manually verified by you.

---

# 54. IMPLEMENTATION DISCIPLINE

Before editing:
1. inspect the actual repository
2. inspect the actual source
3. inspect current data
4. inspect current routing
5. inspect current assets
6. inspect current theme
7. inspect current components
8. inspect current integrations
9. inspect reference video/frames

Then implement.

Do not rely on old implementation summaries.

The source code is the source of truth.

---

# 55. PRESERVE BEFORE REFACTORING

When considering any change, ask:

1. Is this explicitly required?
2. Does it improve the requested UI/UX?
3. Does it remove duplication/unwanted content?
4. Does it improve production readiness?
5. Does it preserve current functionality?

If not, do not change it.

**Minimal safe change is preferred over unnecessary rewrite.**

---

# 56. DEFINITION OF DONE

This task is COMPLETE only when all of the following are true:

## Video analysis
- complete reference video analyzed
- reference frames analyzed
- visual hierarchy extracted
- interaction behavior extracted
- theme behavior extracted
- navigation behavior extracted
- section layouts extracted
- responsive principles extracted

## Frontend
- Home redesigned
- Hero redesigned
- Navbar redesigned/refined
- scrollspy implemented/refined
- scroll direction behavior implemented/refined
- theme switch polished
- About refined
- Education redesigned
- Skills professionally arranged
- Projects redesigned
- Experience professionally arranged
- Certifications redesigned
- GitHub/coding profile areas audited
- Contact redesigned
- Footer redesigned

## User requirements
- bottom-to-top scroll shows navbar
- duplicate content removed
- CGPA is 7.99 everywhere
- B.Tech CSE remains correct
- content reveals progressively on scroll
- reveal reverses appropriately when content leaves viewport
- reduced motion supported
- skills professionally organized
- Professional Experience heading used correctly
- unwanted spacing removed
- current UI/UX improved
- existing functionality preserved

## Production
- no demo/mock content
- no fake links
- no fake statistics
- no fake certificates
- no placeholder content
- no old CGPA
- no old incorrect degree
- no reference-person data
- accessibility improved
- responsive behavior addressed
- performance addressed
- SEO addressed
- security reviewed
- TypeScript quality reviewed

## Scope
- frontend only
- no backend
- no database
- no authentication
- no server
- no CMS

## Validation
- lint passes
- TypeScript passes
- build passes

---

# 57. FINAL RESPONSE FORMAT

After completing the entire implementation, provide ONE final report only.

Use:

## Complete Frontend Implementation
What was changed.

## Reference Video Analysis Applied
Which visual/interaction principles from the video were translated into the portfolio.

## User Requirements Implemented
Confirm:
- navbar scroll behavior
- bidirectional scroll reveal
- duplicate cleanup
- CGPA 7.99
- professional skills
- Professional Experience
- UI/UX improvements
- responsive design
- spacing cleanup

## Existing Functionality Preserved
List important existing features intentionally retained.

## Production Cleanup
List mock/demo/placeholder/fake content removed.

## Frontend Scope
Explicitly confirm:
- Backend NOT added
- Database NOT added

## Validation
Report:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Remaining Issues
Only report genuine unresolved issues.

Finally state:

**Browser/UI testing was NOT performed. Manual testing remains for the user.**

---

# 58. FINAL COMMAND

Do not ask me for another prompt.

Do not ask me which phase to implement.

Do not stop after planning.

Do not stop after one page.

Do not create mock data.

Do not add backend/database.

Do not make unrelated changes.

Do not copy the reference person.

Do not merely describe what should be done.

**Inspect the actual repository and reference video, then implement the complete requested frontend redesign now in one continuous execution.**

# START COMPLETE IMPLEMENTATION NOW.
