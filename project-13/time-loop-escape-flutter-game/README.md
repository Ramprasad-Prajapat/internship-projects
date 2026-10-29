# time-loop-escape-flutter-game

A mobile mystery thriller narrative puzzle game built with Flutter. The player awakens in an eerie room trapped in a recurring 11:57 time loop and must investigate environments, decode clues, and solve puzzles before the clock strikes midnight.

## Tech Stack
- Framework: Flutter 3.10+ (Dart 3.x)
- State Management: Provider (provider: ^6.0.5)
- UI & Sound: Material Design, Custom audio player bindings

## Features
- Narrative puzzle gameplay driven by a tense 3-minute recurring countdown loop
- Interactive room investigation: examine objects, uncover hidden compartments, and decode messages
- Dynamic inventory management: collect, examine, and combine items to unlock puzzle mechanisms
- Branching storylines with multiple ending variations based on discoveries made before the loop resets
- Atmospheric audio soundscapes and dynamic countdown visual effects

## Folder Structure
`
time-loop-escape-flutter-game/
â”œâ”€â”€ android/
â”œâ”€â”€ assets/
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ main.dart
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ providers/
â”‚   â”œâ”€â”€ screens/
â”‚   â””â”€â”€ widgets/
â”œâ”€â”€ pubspec.yaml
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Flutter SDK 3.10+, Dart SDK 3.0+, Android Studio or Xcode
2. Setup:
   `ash
   flutter pub get
   `
3. Run:
   `ash
   flutter run
   `

## Environment Variables / Config
- None required for baseline gameplay
