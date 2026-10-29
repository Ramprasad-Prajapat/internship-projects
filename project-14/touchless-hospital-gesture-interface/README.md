# touchless-hospital-gesture-interface

A futuristic touchless healthcare spatial computing web dashboard featuring virtual mouse tracking, sterile hand sign navigation, and clinic operations management designed for sterile hospital environments.

**Live Demo:** [https://smart-hospital-chi.vercel.app](https://smart-hospital-chi.vercel.app)

## Tech Stack
- Frontend: Semantic HTML5, CSS3 Dark Glassmorphism, Vanilla JavaScript
- Computer Vision: MediaPipe Hands Core, Camera Utils, Drawing Utils
- UI/UX: Futuristic HUD design with live coordinate tracking matrix

## Features
- Touchless virtual mouse pointer controlled by aiming the index finger at the camera
- Sterile click gesture simulation (holding pointer position for 800ms triggers action)
- Hospital clinic operations dashboard: patient admissions, bed occupancy, doctor roster, and ICU telemetry
- Central HUD Gesture Directory dynamically highlighting active hand postures
- Global navigation gestures: Open Palm to start, Fist to stop, Swipes to change tabs
- Full mouse and keyboard fallbacks for environments without webcam hardware

## Folder Structure
```
touchless-hospital-gesture-interface/
├── index.html
└── README.md
```

## How to Run
1. Prerequisites: Modern web browser with webcam access
2. Setup: No installation needed
3. Run:
   Open `index.html` in browser or serve via:
   ```bash
   npx serve .
   ```

## Environment Variables / Config
- None required (client-side only)
