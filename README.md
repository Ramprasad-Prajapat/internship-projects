# Internship Projects

A collection of projects built during my internship.

**Author:** Ramprasad Prajapat

## Projects

| # | Project | Description | Tech Stack | Live Demo |
|---|---------|-------------|------------|-----------|
| 01 | [ai-english-learning-platform](./project-01/ai-english-learning-platform) | AI-powered English learning platform with daily practice, homework, and streak tracking | React, TypeScript, Spring Boot, MySQL/H2 | N/A (backend / mobile app) |
| 02 | [aquasaver-gesture-water-simulator](./project-02/aquasaver-gesture-water-simulator) | Touchless webcam gesture-controlled water conservation simulator and awareness app | HTML5, CSS3, JavaScript, MediaPipe Hands, Web Audio | Deployment pending |
| 03 | [developer-portfolio-react-typescript](./project-03/developer-portfolio-react-typescript) | Modern responsive developer portfolio web application with project showcases and animations | React 19, TypeScript, Vite, Tailwind CSS, Motion | Deployment pending |
| 04 | [eco-ninja-gesture-slicing-game](./project-04/eco-ninja-gesture-slicing-game) | AI hand gesture waste-slicing arcade web game promoting environmental conservation | HTML5 Canvas, JavaScript, MediaPipe Hands, Web Audio | Deployment pending |
| 05 | [facetrack-ai-attendance-system](./project-05/facetrack-ai-attendance-system) | Enterprise attendance SaaS platform pairing facial recognition with geofence verification | React 18, Vite, React Router, Lucide, CSS Tokens | Deployment pending |
| 06 | [gamepulse-live-cricket-scoring-platform](./project-06/gamepulse-live-cricket-scoring-platform) | Enterprise real-time cricket match scoring engine, tournament tracker, and fan analytics | Spring Boot 3, Java 21, WebSocket STOMP, React, Tailwind | N/A (backend / mobile app) |
| 07 | [mental-wellness-chat-and-meditation-platform](./project-07/mental-wellness-chat-and-meditation-platform) | Emotional wellness platform featuring support chat, meditation timer, and mood analytics | HTML5, CSS3 Glassmorphism, JavaScript, Chart.js | Deployment pending |
| 08 | [obliq-food-delivery-flutter](./project-08/obliq-food-delivery-flutter) | Multi-role on-demand food delivery mobile ecosystem for customers, restaurants, and riders | Flutter, Dart, Material Design 3 | Not deployed (mobile app) |
| 09 | [save-the-balloon-android-game](./project-09/save-the-balloon-android-game) | Android arcade survival game protecting a rising balloon from spikes and flying obstacles | Android, Kotlin, Jetpack Compose, Gemini API | Not deployed (mobile app) |
| 10 | [smart-gate-pass-android](./project-10/smart-gate-pass-android) | Smart visitor and parcel gate pass management Android application for guards and residents | Android, Kotlin, Jetpack Compose, Material 3 | Not deployed (mobile app) |
| 11 | [smart-home-gesture-control-dashboard](./project-11/smart-home-gesture-control-dashboard) | Touchless webcam hand gesture smart home automation dashboard for virtual appliances | HTML5, CSS3, JavaScript, MediaPipe Hands, Web Speech | Deployment pending |
| 12 | [smart-office-voice-dashboard](./project-12/smart-office-voice-dashboard) | Voice-activated smart office portal for facility monitoring, room bookings, and attendance | HTML5, CSS3, JavaScript, Web Speech API (STT & TTS) | Deployment pending |
| 13 | [time-loop-escape-flutter-game](./project-13/time-loop-escape-flutter-game) | Narrative mystery thriller mobile puzzle game breaking an 11:57 repeating time loop | Flutter, Dart, Provider, Material Design | Not deployed (mobile app) |
| 14 | [touchless-hospital-gesture-interface](./project-14/touchless-hospital-gesture-interface) | Touchless healthcare spatial interface with virtual mouse tracking and clinic dashboard | HTML5, CSS3, JavaScript, MediaPipe Hands | [Live Demo](https://smart-hospital-chi.vercel.app) |
| 15 | [typing-runner-android-game](./project-15/typing-runner-android-game) | Fast-paced typing runner Android game propelled by typing speed and spelling accuracy | Android, Kotlin, Jetpack Compose, Gemini API | Not deployed (mobile app) |
| 16 | [vocalic-voice-calculator-web-app](./project-16/vocalic-voice-calculator-web-app) | Voice-driven arithmetic calculator web app with continuous speech recognition and TTS | HTML5, CSS3, JavaScript, Web Speech API, Web Audio | Deployment pending |

## Automated Live Tests

Automated end-to-end tests for all live and local web projects are located in [`live-tests/`](./live-tests).

To run live production tests:
```bash
cd live-tests
npm run test:live
```

To run against locally served projects:
```bash
cd live-tests
$env:TARGET="local"
npx playwright test
```

## How to run a project

Open the project folder (`project-NN/<project-name>`) and follow the steps in its own README.md.

## Deployment

Each project can be deployed on its own. In the hosting service, set the Root Directory to `project-NN/<project-name>`.

## Contact

- GitHub: https://github.com/Ramprasad-Prajapat
