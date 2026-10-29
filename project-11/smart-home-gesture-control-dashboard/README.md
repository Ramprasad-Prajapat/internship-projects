# smart-home-gesture-control-dashboard

**Live Demo:** [https://smart-home-gesture-control-dashboard.vercel.app](https://smart-home-gesture-control-dashboard.vercel.app)


A webcam-based hand gesture smart home automation dashboard that enables users to control virtual home appliances, ambient lighting, and room temperatures touchlessly using intuitive hand signs.

## Tech Stack
- Frontend: Semantic HTML5, CSS3 Glassmorphism, Vanilla JavaScript
- Computer Vision: MediaPipe Hands API (via CDN)
- Speech Engine: Web Speech Synthesis API (spoken status confirmations)
- Storage: LocalStorage API

## Features
- Touchless hand sign recognition with confidence threshold and stable hold duration verification
- Virtual appliance controls: Smart Light, Air Conditioner, Smart TV, Ceiling Fan, and Door Security Lock
- Room selection tabs: Living Room, Bedroom, Kitchen, and Home Office
- Real-time gesture simulator and manual button fallbacks for environments without camera access
- Spoken voice feedback upon successful command execution
- Historical activity log saved to browser LocalStorage

## Folder Structure
`
smart-home-gesture-control-dashboard/
â”œâ”€â”€ index.html
â”œâ”€â”€ script.js
â”œâ”€â”€ style.css
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Web browser (Chrome, Edge, Firefox) with webcam access
2. Setup: No installation needed
3. Run:
   Open index.html directly in your browser or run:
   `ash
   npx serve .
   `

## Environment Variables / Config
- None required (client-side only)

