# smart-office-voice-dashboard

A voice-activated smart office operations portal that enables occupants and facilities administrators to monitor building analytics, book meeting rooms, check biometric logs, and adjust ambient settings touchlessly.

## Tech Stack
- Frontend: HTML5, CSS3 Glassmorphism, Vanilla JavaScript
- Speech Integration: Web Speech Recognition API (STT) and Web Speech Synthesis API (TTS)
- Visualizations: Responsive inline SVG metrics charts

## Features
- Continuous speech recognition command interpreter for hands-free navigation and system operations
- Three customizable environmental themes: Dark Space, Tech Light, and Cyber Neon
- Real-time building analytics: hourly occupancy rates, temperature graphs, and energy consumption metrics
- Conference room reservation system with live availability indicators
- Attendance terminal simulating biometric check-in logs and clock-in stats
- Spoken voice confirmations for user commands via Web Speech Synthesis

## Folder Structure
`
smart-office-voice-dashboard/
â”œâ”€â”€ index.html
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Web browser with microphone access (Chrome or Edge recommended for full Web Speech API support)
2. Setup: No installation needed
3. Run:
   Open index.html directly in browser or serve via:
   `ash
   npx serve .
   `

## Environment Variables / Config
- None required (client-side only)
