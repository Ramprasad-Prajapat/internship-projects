# facetrack-ai-attendance-system

**Live Demo:** Deployment pending


A multi-branch corporate attendance SaaS platform combining webcam facial recognition simulation with geofencing to prevent proxy attendance and streamline HR operations across multiple office locations.

## Tech Stack
- Frontend: React 18, Vite 5, React Router v6, Lucide React, Hand-written CSS Design Tokens
- Architecture: Role-based SPA with mock data store and modular service layer

## Features
- 5 scoped role-based dashboards: Super Admin, Branch Admin, HR, Manager, and Employee
- Multi-branch geofencing across 6 regional office locations with 150-meter radius verification
- Guided face scan attendance flow with auto Sign-In / Sign-Out toggle and live working time clock
- Employee Profile control center with attendance records, shift schedules, and activity timeline
- Real-time KPI summaries, live attendance monitoring, and automated report generators
- Futuristic dark glassmorphism design system with responsive layouts

## Folder Structure
`
facetrack-ai-attendance-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
└── README.md
`

## How to Run
1. Prerequisites: Node.js 18+ (npm 9+)
2. Setup:
   `ash
   cd frontend
   npm install
   `
3. Run:
   `ash
   npm run dev
   `
   Open http://localhost:5173 to access the dashboard.

## Environment Variables / Config
- VITE_API_MODE: Data source mode (default: mock)
- VITE_FIREBASE_API_KEY: Placeholder for future Firebase authentication integration

