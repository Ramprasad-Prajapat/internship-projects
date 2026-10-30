# aquasaver-gesture-water-simulator

**Live Demo:** Deployment pending


An interactive environmental simulation and awareness web application that utilizes computer vision for touchless interaction. Users control a virtual leaking tap using webcam hand gestures to conserve water and learn sustainable habits.

## Tech Stack
- Frontend: Semantic HTML5, CSS3 Glassmorphism, Vanilla JavaScript
- Computer Vision: MediaPipe Hands API (via CDN)
- Sound Engine: Native Web Audio API (procedural water flowing and ripple sounds)
- Storage: LocalStorage API

## Features
- Touchless hand gesture controls via webcam (Open Palm to start leak, Pinch to close tap, Two Fingers for report, Thumbs Up to complete challenge)
- Realistic sound synthesizer generating flowing water and drop effects dynamically using Web Audio API
- Live real-time analytics monitoring liters wasted, liters saved, and Eco Score
- Dynamic resource impact report overlay displaying conservation metrics
- Printable high-resolution Water Saver Hero certificate generator using HTML5 Canvas
- Comprehensive keyboard and mouse fallback controls (O, P, R, T keys) for environments without a webcam

## Folder Structure
`
aquasaver-gesture-water-simulator/
├── assets/
├── index.html
└── README.md
`

## How to Run
1. Prerequisites: Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox) with webcam access
2. Setup: No build step or installation required
3. Run:
   Open index.html directly in your browser, or serve with a local server:
   `ash
   npx serve .
   `

## Environment Variables / Config
- None required (entirely client-side)

