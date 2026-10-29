# eco-ninja-gesture-slicing-game

A touchless browser-based arcade game inspired by Fruit Ninja that teaches waste management and environmental protection. Players slice falling waste items using real-time webcam hand gestures captured through computer vision.

## Tech Stack
- Structure: Semantic HTML5
- Styling: Vanilla CSS3 Grid, Flexbox, Glassmorphism, Keyframe Animations
- Game Engine: HTML5 Canvas API (custom 60 FPS physics and particle engine)
- Computer Vision: MediaPipe Hands Core and Camera Utilities
- Sound System: Native Web Audio API for synthetic audio effects
- Storage: LocalStorage API

## Features
- Touchless spatial hand tracking mapping index finger movements to slicing coordinates
- Dynamic particle burst effects color-coded by waste category (Plastic = Blue, Bio = Green, Metal = White, Battery = Yellow)
- Combo multiplier system rewarding rapid consecutive slices
- Procedural audio synthesizer generating whooshes, slice chimes, and game over sounds via Web Audio API
- Gesture recognition states: Open Palm to pause, Closed Fist to resume
- Responsive keyboard and mouse backup controls for presentation environments
- LocalStorage persistence for tracking high scores across sessions

## Folder Structure
`
eco-ninja-gesture-slicing-game/
â”œâ”€â”€ index.html
â”œâ”€â”€ script.js
â”œâ”€â”€ style.css
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Web browser (Chrome, Edge, Firefox) with webcam access
2. Setup: No package manager or dependencies needed
3. Run:
   Open index.html in your web browser, or launch using:
   `ash
   npx serve .
   `

## Environment Variables / Config
- None required (client-side only)
