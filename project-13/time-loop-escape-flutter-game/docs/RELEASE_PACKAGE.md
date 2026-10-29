# Release Package Specifications — Time Loop Escape

## Application Metadata

- **App Title**: 11:57 — The Last Check-In
- **Package ID / Application ID**: `com.timeloopescapes.game`
- **Version**: `1.0.0`
- **Build Number**: `1`
- **Category**: Adventure / Mystery / Puzzle
- **Content Rating**: Everyone 10+ (Fantasy Violence / Mystery Themes)
- **Target Platform**: Android (minSdk 21 / Android 5.0+, targetSdk 33 / Android 13+)
- **Architecture**: Offline-first Flutter application (Dart / Provider architecture)

---

## Core Feature Overview

1. **Five-Minute Temporal Loop**:
   - 300-second real-time loop orchestrating room events, lighting shifts, and midnight resets.
   - Idempotent reset boundary that resets room physical state while preserving persistent player knowledge.

2. **Hotel Exploration System**:
   - Connected locations (Lobby, Corridors, Guest Rooms, Maintenance Room, Manager's Office).
   - Dynamic hotspot inspection, document reading, and item collection.

3. **Persistent Knowledge Board**:
   - Discovered clues, unlocked codes, dialogue topics, and contradictions persist across loop resets.

4. **Inventory & Timeline Anchor**:
   - Inventory system supporting item inspection.
   - Timeline Anchor allowing players to select up to 1 physical item to carry over across midnight resets.

5. **Puzzle Framework**:
   - Interactive multi-stage puzzles (combination locks, wiring, letter sequences).
   - State-aware validation preventing brute-force or pre-requisite sequence breaking.

6. **NPC Schedule & Dialogue**:
   - Timeline-driven NPC positions and state shifts.
   - Branching topic-based dialogue uncovering hotel lore and puzzle clues.

7. **Progressive Hint System**:
   - 3-tier progressive hint system (Direction, Focus, Solution) tied to player puzzle progress and discovered clues.

8. **Story & Multiple Endings**:
   - Multiple reachable endings based on player knowledge, unlocked codes, and final choices.
   - Persistent ending completion log.

9. **Offline Save & Local Persistence**:
   - Atomic JSON local storage with schema versioning and corruption recovery.

10. **Audio, Haptics & Accessibility**:
    - Channel-separated audio (Master, Music, Effects, Ambient) with non-blocking missing asset fallback.
    - Haptic feedback with hardware safe fallbacks.
    - Accessibility options: minimum 48px touch targets, text scaling, subtitles, and reduced motion toggles.
