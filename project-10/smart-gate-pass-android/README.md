# smart-gate-pass-android

A native Android access control and gate pass management application built with Kotlin and Jetpack Compose. It empowers residential security guards and residents to securely manage visitor check-ins and parcel deliveries.

## Tech Stack
- Platform: Android (API 24+, Target SDK 34)
- Language & UI: Kotlin, Jetpack Compose (Material Design 3)
- State Management: Compose MutableState architecture with MockDataStore
- Build System: Gradle Kotlin DSL

## Features
- Role-based authentication and operational views for Security Guards and Residents
- Visitor entry workflow with automatic pass token generation and phone number OTP validation
- Parcel delivery logging with resident notification and pickup verification
- Expected guest pre-authorization generating timed QR codes and access tokens
- Access history log archiving entry and exit timestamps
- Modern dark-mode mobile UI featuring gradient cards, glassmorphic headers, and micro-animations

## Folder Structure
`
smart-gate-pass-android/
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
   - Let Gradle sync project dependencies
3. Run:
   - Select target device and click **Run** or run ./gradlew installDebug

## Environment Variables / Config
- GEMINI_API_KEY: Optional API key for smart verification features (listed in .env.example)
