# save-the-balloon-android-game

A native Android arcade survival game where players guide an ascending balloon past hazardous obstacles including spikes, needles, moving birds, and rockets while collecting coins and defensive power-ups.

## Tech Stack
- Platform: Android (API 24+)
- Language & UI: Kotlin, Jetpack Compose (Material Design 3)
- Build System: Gradle Kotlin DSL (Android Gradle Plugin)
- AI Capabilities: Gemini API server-side integration hooks

## Features
- Dynamic physics-based balloon navigation with obstacle collision detection
- Diverse obstacle types: stationary spikes, floating needles, moving storm clouds, and flying rockets
- Collectible power-ups including invulnerability shields and score multiplier stars
- Real-time score counter with local high-score persistence and replay loops
- Modern Jetpack Compose UI with dark mode, fluid particle effects, and responsive touch controls

## Folder Structure
`
save-the-balloon-android-game/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ src/main/java/
â”‚   â”œâ”€â”€ src/main/res/
â”‚   â””â”€â”€ build.gradle.kts
â”œâ”€â”€ build.gradle.kts
â”œâ”€â”€ settings.gradle.kts
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Android Studio (Koala or newer), JDK 17+, Android SDK 34
2. Setup:
   - Open folder in Android Studio
   - Copy .env.example to .env if using Gemini capabilities
3. Run:
   - Select Android Emulator or physical device
   - Click **Run** (Shift + F10) or run ./gradlew assembleDebug

## Environment Variables / Config
- GEMINI_API_KEY: API key for Gemini features (optional, specified in .env.example)
