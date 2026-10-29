# typing-runner-android-game

A fast-paced native Android typing runner arcade game where typing speed and spelling accuracy propel your character across dynamic tracks while dodging obstacles.

## Tech Stack
- Platform: Android (API 24+)
- Language & UI: Kotlin, Jetpack Compose (Material Design 3)
- Build System: Gradle Kotlin DSL
- AI Integration: Server-side Gemini API capability hooks

## Features
- Real-time word typing challenge engine with immediate character-level accuracy feedback
- Runner movement and speed acceleration proportional to Words-Per-Minute (WPM)
- Procedural obstacle courses featuring hurdles, speed boosts, and falling barriers
- Combo streak multiplier system rewarding consecutive flawless words
- Comprehensive post-run metrics: WPM calculation, accuracy percentage, and total distance covered
- Jetpack Compose interface with dark theme, particle effects, and haptic feedback

## Folder Structure
`
typing-runner-android-game/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ src/main/java/
â”‚   â”œâ”€â”€ src/main/res/
â”‚   â””â”€â”€ build.gradle.kts
â”œâ”€â”€ build.gradle.kts
â”œâ”€â”€ settings.gradle.kts
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Android Studio, JDK 17+, Android SDK 34
2. Setup:
   - Open project in Android Studio
   - Copy .env.example to .env if configuring Gemini features
3. Run:
   - Select Android Emulator or device and click **Run** (Shift + F10)

## Environment Variables / Config
- GEMINI_API_KEY: API key for Gemini capabilities (optional, listed in .env.example)
