# Time Loop Escape — Flutter Production Master Implementation Plan

## Purpose

This is the single master implementation document for building the **Time Loop Escape / 11:57 — The Last Check-In** mobile application in Flutter.

The supplied research document is the product source of truth. The implementation technology is explicitly changed to **Flutter** by the project owner; the product concept, core loop, persistence model, MVP direction, and gameplay principles remain based on the research.

This document is intended to be used as one complete implementation plan. Each phase contains one complete master prompt. Do not unnecessarily split phases into sub-prompts.

---

# 1. Non-Negotiable Project Rules

1. Build production-oriented functionality, not a disposable demo.
2. Do not use fake API responses or pretend backend services exist.
3. Do not leave blank pages.
4. Every implemented button must perform a real, defined action.
5. Every active navigation destination must open a real implemented screen.
6. Do not repeatedly redesign an approved design.
7. Implement only requested changes; avoid unrelated changes.
8. Never repeat already-completed implementation.
9. Preserve working functionality after every change.
10. Frontend must be completed before backend implementation.
11. Backend technology must be selected according to actual application requirements.
12. Backend starts only after the owner explicitly says to start backend.
13. Each phase uses one complete master prompt.
14. Do not divide an approved phase into unnecessary sub-phases.
15. Use production-oriented architecture from the beginning.
16. Validate affected functionality after every implementation.
17. A page is not considered complete if its important behavior is missing.
18. Generate and validate an Android APK after the implementation is release-ready.
19. Once design is approved, treat it as locked unless the owner explicitly requests a redesign.
20. Do not ask for repeated approval inside an already-authorized phase unless a genuine product-level ambiguity materially affects the result.

---

# 2. Product Foundation

## Core concept

The game is a cinematic mobile mystery set inside a Rajasthan-inspired heritage hotel trapped in a repeating short timeline.

The player enters while searching for a missing sibling.

The hotel clocks are frozen around 11:57 PM.

At midnight, the world resets.

Resettable state includes things such as player/world position, doors, puzzle mechanisms, NPC positions and ordinary physical state.

Persistent state includes discoveries, clues, codes, knowledge, dialogue unlocks, achievements and the special anchored progression concept.

The core player loop is:

**Observe → Experiment → Discover → Remember → Reset → Apply Knowledge → Progress**

The research identifies the central product test as:

**Does every reset make the player feel smarter?**

## Research MVP baseline

- Android first
- Offline-first
- No multiplayer
- No custom backend required for the initial offline version
- One hotel floor plus basement
- 8 rooms
- 3 major NPCs
- 5-minute target loop
- 10–12 main puzzles
- 20–30 smaller interactions
- 15 major discoveries
- 2 endings
- English + Hindi
- 60–90 minutes target MVP gameplay

---

# 3. Technology Direction

## Required technology

**Flutter + Dart**

The original research recommends Unity 6/C#, but the project owner explicitly requires Flutter. Therefore:

- Use Flutter for the application.
- Translate the game/product requirements into Flutter-compatible architecture.
- Do not blindly reproduce Unity-specific architecture.
- Keep game-state, persistence, interaction and content systems independent from widgets.
- Use a scalable architecture that can later integrate with a backend.

## Backend

Do not select or implement a backend during the initial frontend phases.

When backend work is explicitly requested:

1. Inspect the completed frontend.
2. Identify actual backend requirements.
3. Select the technology according to those requirements.
4. Define contracts before implementation.
5. Implement real services, not mock endpoints.

---

# 4. Recommended Flutter Architecture

Use a feature-oriented architecture appropriate to the existing repository.

Possible structure:

```text
lib/
  app/
    app.dart
    app_router.dart
    app_theme.dart
    app_config.dart

  core/
    constants/
    errors/
    extensions/
    models/
    services/
    storage/
    utils/
    widgets/

  features/
    splash/
    home/
    game/
      loop/
      world/
      interaction/
      inventory/
      knowledge/
      puzzles/
      npc/
      dialogue/
      hints/
      story/
      endings/
    settings/
    localization/

  data/
    local/
    repositories/

  shared/
    widgets/
    animations/
    design/
```

Do not recreate this structure blindly. First inspect the existing project and preserve any sound architecture already present.

Use one consistent state-management strategy.

Separate:

**UI → State/Controller → Repository → Storage/API**

This ensures future backend integration does not require rewriting the UI.

---

# 5. Phase 01 — Project Foundation and Production Architecture

## Goal

Create a stable Flutter foundation.

## Master Prompt

> Inspect the current Flutter repository before changing anything. Identify the existing architecture, dependencies, routes, screens, state management, and reusable components. Do not recreate working code.
>
> Establish or improve a production-oriented Flutter architecture suitable for the Time Loop Escape application.
>
> Configure the Android-first application foundation, application entry point, routing foundation, theme foundation, error-handling foundation, reusable widgets, models, services, repositories, storage abstractions and feature boundaries.
>
> Do not add fake backend APIs. Do not create dummy network responses.
>
> Keep the application buildable throughout the phase.
>
> Make sure the application launches to a real non-blank screen.
>
> Add only dependencies that have a justified production purpose.
>
> Establish code quality and naming conventions.
>
> Validate the Android build after implementation.
>
> Do not perform visual redesign beyond the minimum foundation required for the application shell.

## Acceptance Criteria

- App launches successfully.
- Android build works.
- No blank initial screen.
- Routing foundation works.
- Theme foundation works.
- Existing functionality is preserved.
- No fake backend exists.

---

# 6. Phase 02 — Design System and Visual Language

## Goal

Create the reusable visual foundation.

## Master Prompt

> Implement the approved visual system for the application using the research direction: cinematic, mysterious, atmospheric, Rajasthan-inspired heritage environment.
>
> Create centralized design tokens for typography, spacing, shapes, elevation, icons, buttons, cards, dialogs, sheets, navigation and feedback.
>
> Build reusable components instead of duplicating styling across screens.
>
> Ensure components work on common Android screen sizes.
>
> Establish accessible contrast, touch targets and text hierarchy.
>
> Do not redesign existing approved screens unnecessarily.
>
> Once the owner approves the design, treat the visual system as locked.
>
> Future implementation changes must not modify colors, typography, layout patterns or navigation styling unless explicitly requested.

## Acceptance Criteria

- Centralized design tokens exist.
- Reusable UI components exist.
- Components are consistent.
- No unnecessary style duplication.
- Application remains functional.

---

# 7. Phase 03 — Application Shell and Navigation

## Goal

Create complete navigation.

## Master Prompt

> Implement the production application shell using the established design system.
>
> Implement all currently approved routes and navigation destinations.
>
> Every navigation control must lead to a real screen.
>
> Implement forward navigation, back navigation, dialogs, sheets and appropriate state restoration.
>
> Ensure navigation does not accidentally destroy game state.
>
> Do not create routes for screens that have no approved content.
>
> Do not create placeholder or blank destinations.
>
> Preserve the approved visual system.

## Acceptance Criteria

- All active navigation works.
- Back navigation works.
- No dead routes.
- No blank destinations.
- Navigation preserves required state.

---

# 8. Phase 04 — Home and Entry Experience

## Goal

Build the real game entry flow.

## Master Prompt

> Implement the production home/entry experience.
>
> Include approved actions such as New Game, Continue, Settings and other required entry actions.
>
> New Game must initialize real game state.
>
> Continue must load actual saved progress when available.
>
> When no save exists, Continue must show an appropriate real empty state rather than navigating to a blank page.
>
> Every button must have a defined behavior.
>
> Do not use fake progress, dummy save data or placeholder game sessions.
>
> Preserve the approved design.

## Acceptance Criteria

- First launch works.
- New Game works.
- Continue handles no-save state.
- Continue loads real saved state when available.
- Settings opens.
- No dead buttons.

---

# 9. Phase 05 — Game-State Architecture

## Goal

Implement the core state model.

## Master Prompt

> Implement a formal game-state architecture separating resettable world state from persistent player knowledge.
>
> Model at minimum:
>
> - current loop
> - elapsed loop time
> - remaining loop time
> - player location
> - world state
> - NPC state
> - puzzle state
> - inventory
> - discovered clues
> - discovered codes
> - map knowledge
> - dialogue topics
> - achievements
> - anchored item state
> - story progression
> - endings
>
> Do not scatter game state across widgets.
>
> Create explicit state transitions and validation.
>
> Make the state layer independent from the UI.
>
> Ensure future repository/backend integration can operate without rewriting widgets.
>
> Implement deterministic reset and persistence semantics.

## Acceptance Criteria

- State is centralized.
- Resettable and persistent state are explicitly separated.
- State transitions are testable.
- UI does not own the complete game state.
- No fake data is required.

---

# 10. Phase 06 — Five-Minute Timeline and Loop

## Goal

Implement the central game mechanic.

## Master Prompt

> Implement the production time-loop system.
>
> The system must:
>
> - start the loop from the correct initial state
> - track elapsed time
> - expose remaining time
> - execute scheduled events
> - trigger reset at the loop boundary
> - restore resettable world state
> - preserve persistent knowledge
> - restore the correct player starting state
> - trigger reset feedback hooks
> - start the next loop deterministically
>
> The loop engine must be independent from visual widgets.
>
> Prevent multiple timers from running simultaneously.
>
> Correctly dispose timers/listeners.
>
> Define pause behavior according to the approved UX. Reading important information must not unfairly punish the player.
>
> Support faster/skippable repeated known actions where required by the game design.
>
> Make reset deterministic and testable.

## Acceptance Criteria

- Timer starts correctly.
- Remaining time updates.
- Scheduled events execute.
- Reset happens once per loop.
- Persistent knowledge survives.
- Resettable state resets.
- No duplicate timers.
- No lifecycle leaks.

---

# 11. Phase 07 — Hotel World and Exploration

## Goal

Create the MVP environment.

## Master Prompt

> Implement the MVP hotel environment based on the research:
>
> - hotel floor
> - basement
> - up to 8 rooms
> - reception
> - elevator
> - generator/maintenance area
> - ballroom
> - archive/other approved locations
>
> Use an interaction-oriented Flutter world representation appropriate to the selected presentation style.
>
> Do not create empty decorative rooms.
>
> Each implemented room must have at least one meaningful purpose: interaction, clue, puzzle dependency, NPC event, story progression or navigation.
>
> Implement entering, leaving and revisiting rooms.
>
> Make room state participate correctly in the loop system.
>
> Preserve the atmospheric visual direction.

## Acceptance Criteria

- Every implemented room is reachable.
- Entry and exit work.
- Backtracking works.
- Room state resets/persists correctly.
- Important locations have functional interactions.

---

# 12. Phase 08 — Interaction System

## Goal

Create reusable interactions.

## Master Prompt

> Implement a reusable interaction framework for relevant mobile interactions such as tap, inspect, drag/manipulate, swipe/view, hold/highlight and movement/navigation.
>
> Define interactables with:
>
> - unique identifier
> - interaction type
> - availability conditions
> - action
> - feedback
> - optional clue/state result
>
> Interaction conditions must respect game state, loop state and persistent knowledge.
>
> Important interactables must have clear visual hierarchy.
>
> Failed interactions must provide useful feedback.
>
> Do not require random tapping for mandatory progression.
>
> Do not hard-code every interaction separately inside UI widgets.

## Acceptance Criteria

- Interaction framework is reusable.
- Interactions create real state changes.
- Invalid actions explain why they fail.
- Required interactables are discoverable.
- No dead interaction controls.

---

# 13. Phase 09 — Inventory and Knowledge Board

## Goal

Implement persistent knowledge and physical inventory.

## Master Prompt

> Implement Inventory and Knowledge Board as separate but connected systems.
>
> Inventory must manage physical items according to the reset/persistence rules.
>
> Knowledge Board must persist discoveries such as:
>
> - character profiles
> - timeline events
> - locations
> - codes and symbols
> - unanswered questions
> - confirmed facts
> - contradictions
> - leads
> - theories
>
> The Knowledge Board must not automatically reveal solutions.
>
> New discoveries should be visibly identified.
>
> Duplicate discoveries must not create duplicate records.
>
> Clearly distinguish new, known, unresolved and confirmed information.

## Acceptance Criteria

- Inventory updates correctly.
- Inventory follows reset rules.
- Knowledge persists across loops.
- Duplicate discoveries are prevented.
- Knowledge UI is complete and non-blank.

---

# 14. Phase 10 — Puzzle Framework

## Goal

Create reusable puzzles and implement the MVP puzzle set.

## Master Prompt

> Create a reusable puzzle framework supporting:
>
> - observation
> - timing
> - physical manipulation
> - dialogue
> - cross-loop
> - environmental
> - moral decision puzzles
>
> Each puzzle must have:
>
> - unique ID
> - prerequisites
> - state
> - inputs
> - validation
> - success result
> - failure feedback
> - knowledge result
> - optional inventory result
> - story dependency
>
> Implement 10–12 meaningful MVP main puzzles.
>
> Every puzzle must be connected to actual progression.
>
> Required information must exist before the solution.
>
> Important objects must be visually identifiable.
>
> Failed attempts must provide useful feedback.
>
> Successful solutions must be understandable.
>
> Repeated solved actions should be accelerated/skipped when appropriate.

## Acceptance Criteria

- Puzzle framework is reusable.
- MVP puzzles are integrated into real progression.
- Puzzle completion changes actual state.
- Reset behavior is correct.
- Persistent knowledge is awarded correctly.

---

# 15. Phase 11 — NPC Schedule and Dialogue

## Goal

Implement deterministic NPC routines.

## Master Prompt

> Implement a data-driven NPC schedule system.
>
> NPC schedules should support timed events such as:
>
> 11:57 reception
> 11:57:40 phone call
> 11:58:05 key placement
> 11:58:30 movement
> 11:59:10 corridor event
> 11:59:30 ballroom lock
> 12:00 reset
>
> Use data/state-driven schedules rather than embedding schedule logic in UI.
>
> Implement conditional dialogue topics that unlock based on persistent knowledge.
>
> NPC state must reset correctly while knowledge of prior dialogue persists.
>
> Prevent impossible combinations of NPC and story state.

## Acceptance Criteria

- NPC schedules are deterministic.
- Dialogue conditions work.
- NPC reset works.
- Dialogue knowledge persists.
- No invalid NPC state is produced.

---

# 16. Phase 12 — Hint System

## Goal

Implement staged, non-spoiler hints.

## Master Prompt

> Implement the three-level hint system:
>
> Level 1 — Direction
> Level 2 — Focus
> Level 3 — Guidance
>
> Hints must be based on actual puzzle state.
>
> Never invent a solution.
>
> Never show hints for irrelevant puzzles.
>
> Record hint usage through the analytics abstraction.
>
> Implement complete request, display, close and state behavior.

## Acceptance Criteria

- Correct hint level appears.
- Hint matches actual puzzle state.
- No misleading hint exists.
- Hint UI works across supported devices.

---

# 17. Phase 13 — Story and Chapter Framework

## Goal

Implement the story structure.

## Master Prompt

> Implement a data/state-driven story framework supporting the research structure:
>
> Chapter 1 — The Lobby
> Introduce the loop, generator, elevator and missing-sibling mystery.
>
> Chapter 2 — The Guest Floor
> Introduce NPC schedules, Room 305 and Timeline Anchor.
>
> Chapter 3 — The Ballroom
> Introduce the major multi-step reveal.
>
> Chapter 4 — The Clock Tower
> Connect past and present.
>
> Chapter 5 — The Laboratory
> Final action chain, sibling resolution and ending selection.
>
> Implement only the approved MVP subset while keeping the architecture extensible for future chapters.
>
> Story progression must be data/state driven.
>
> Do not embed story progression directly inside individual UI widgets.

## Acceptance Criteria

- Story state persists correctly.
- Chapter transitions work.
- Story dependencies are validated.
- No implemented chapter screen is blank.

---

# 18. Phase 14 — Endings

## Goal

Implement ending state logic.

## Master Prompt

> Implement the ending framework based on the research:
>
> - Escape Alone
> - Save the Sibling
> - Reveal the Truth
> - Secret Ending — The First Loop
>
> For the MVP, expose only the approved number of endings if the MVP remains scoped to two endings.
>
> Endings must be selected from actual accumulated state.
>
> Do not randomly select endings.
>
> After an ending, preserve valid save state and provide a complete completion experience.

## Acceptance Criteria

- Ending conditions are state-driven.
- Ending state is testable.
- Ending UI is complete.
- Save state remains valid.

---

# 19. Phase 15 — Local Save and Persistence

## Goal

Implement offline-first persistence.

## Master Prompt

> Implement local persistence for:
>
> - game progress
> - current chapter
> - persistent knowledge
> - discovered clues
> - codes
> - dialogue unlocks
> - achievements
> - settings
> - ending state
> - required inventory/anchored item state
>
> Use repository abstractions so future backend synchronization can be introduced without rewriting UI.
>
> Handle corrupted/incomplete data safely.
>
> Never silently wipe valid progress.
>
> Implement deterministic serialization and deserialization.
>
> Do not persist transient UI state unless explicitly required.

## Acceptance Criteria

- Progress survives app restart.
- Save/load works.
- Invalid/corrupt data is handled safely.
- No fake save data exists.

---

# 20. Phase 16 — Audio, Feedback and Accessibility

## Goal

Implement atmospheric feedback.

## Master Prompt

> Implement audio and feedback hooks for:
>
> - 11:57 ambience
> - 11:58 telephone cue
> - 11:59 escalating clock
> - final countdown
> - heartbeat/bell
> - reset
>
> Do not make required puzzle information depend only on audio.
>
> Provide visual alternatives/subtitles where necessary.
>
> Implement sound, music and haptic controls.
>
> Ensure audio and vibration lifecycles follow the game loop and page lifecycle.

## Acceptance Criteria

- Audio follows game state.
- Settings work.
- Important audio information has an appropriate visual alternative.
- No audio continues incorrectly after leaving the game.

---

# 21. Phase 17 — Settings and Localization

## Goal

Complete settings and English/Hindi support.

## Master Prompt

> Implement the complete settings screen using only meaningful production controls.
>
> Include approved controls for:
>
> - music
> - sound effects
> - haptics
> - language
> - accessibility/story mode where approved
> - graphics/performance where required
> - progress management where appropriate
>
> Implement English and Hindi through a real localization architecture.
>
> Avoid scattering hard-coded user-facing strings throughout the application.
>
> Changing language must update the interface correctly and persist the selection.

## Acceptance Criteria

- Settings work.
- Settings persist.
- English works.
- Hindi works.
- No missing production localization keys.

---

# 22. Phase 18 — Analytics-Ready Architecture

## Goal

Prepare analytics without fake analytics services.

## Master Prompt

> Create an analytics abstraction capable of emitting:
>
> - game_started
> - tutorial_completed
> - loop_started
> - loop_completed
> - clue_discovered
> - puzzle_attempted
> - puzzle_solved
> - hint_requested
> - npc_dialogue_unlocked
> - chapter_completed
> - purchase_completed
> - ending_reached
>
> Centralize event definitions and payload structures.
>
> Do not fabricate analytics results.
>
> If no provider is configured, use a safe internal interface that can accept events without pretending they were uploaded to a live service.
>
> Future analytics providers must be integrable without rewriting game systems.

## Acceptance Criteria

- Events are centralized.
- Payloads are consistent.
- Relevant game systems emit correct events.
- Provider can later be replaced/added cleanly.

---

# 23. Phase 19 — Complete MVP Integration

## Goal

Combine all systems into a coherent playable MVP.

## Master Prompt

> Integrate all implemented systems into the research-defined MVP:
>
> - one hotel floor plus basement
> - eight rooms
> - three major NPCs
> - five-minute loop
> - ten to twelve main puzzles
> - twenty to thirty smaller interactions
> - fifteen major discoveries
> - two endings
> - English and Hindi
> - sixty to ninety minutes target gameplay
> - no backend
> - no multiplayer
>
> Ensure the player can:
>
> start a new game
> → explore
> → observe events
> → interact
> → discover clues
> → reset
> → retain knowledge
> → use knowledge
> → solve puzzles
> → progress the story
> → reach an ending
> → save
> → close the app
> → reopen
> → continue.
>
> Remove disconnected demonstration screens.
>
> Do not add unnecessary scope.

## Acceptance Criteria

- MVP is a coherent playable experience.
- All major systems interact correctly.
- No core screen is blank.
- No core button is dead.
- Progress persists.

---

# 24. Phase 20 — QA, Performance and Physical Device Validation

## Goal

Validate frontend production readiness.

## Master Prompt

> Perform a complete frontend QA pass.
>
> Test:
>
> - first launch
> - new game
> - continue
> - every route
> - every active button
> - room navigation
> - interactions
> - loop timer
> - loop reset
> - knowledge persistence
> - inventory
> - puzzles
> - NPC schedules
> - dialogue
> - hints
> - save/load
> - settings
> - localization
> - endings
> - app restart
> - lifecycle interruption
> - Android device behavior
>
> Test on physical Android hardware.
>
> Find and fix crashes, timer duplication, state corruption, navigation errors, rendering problems, memory problems and performance bottlenecks.
>
> Do not redesign the application during QA.
>
> Fix defects only.

## Research Performance Direction

Where applicable to the Flutter rendering approach:

- target stable 30 FPS on lower mid-range Android devices
- optional 60 FPS mode
- optimize asset sizes
- compress audio
- avoid unnecessary real-time effects
- manage memory carefully
- use efficient reuse/pooling where appropriate
- keep offline gameplay functional

---

# 25. Phase 21 — Frontend Production Freeze

## Goal

Freeze frontend before backend work.

## Master Prompt

> Freeze the approved frontend architecture and design.
>
> Record the final:
>
> - screen inventory
> - routes
> - models
> - state contracts
> - repositories
> - storage contracts
> - service interfaces
> - analytics events
> - localization keys
> - future backend integration points
>
> Verify that the frontend works independently in offline mode.
>
> Produce the technical contract required for future backend planning.
>
> Do not implement backend functionality.

## Acceptance Criteria

- Frontend is stable.
- Design is locked.
- Contracts are clear.
- Offline mode works.
- No fake backend remains.

---

# 26. Backend Approval Gate

Backend implementation must not begin automatically.

The owner must explicitly request backend implementation.

When requested, inspect the finalized frontend and determine actual backend needs.

The research states that the initial version can work offline and that a custom backend is not required for the initial version. Therefore backend should only be introduced when there is a real requirement.

Potential backend requirements may include:

- authentication
- cloud saves
- purchases
- analytics
- remote content
- account synchronization
- admin/content management
- security

Do not create backend functionality simply because a backend is common in mobile apps.

---

# 27. Phase 22 — Backend Planning

## Master Prompt

> Inspect the completed Flutter frontend contracts.
>
> Determine exactly which backend capabilities are required.
>
> Define:
>
> - authentication if required
> - API boundaries
> - database entities
> - authorization
> - cloud-save model
> - purchase verification
> - analytics integration
> - content management
> - offline synchronization
> - error contracts
> - rate limiting
> - logging
> - deployment
> - secrets management
>
> Select backend technologies based on actual requirements.
>
> Do not create endpoints that have no frontend consumer.
>
> Do not create mock endpoints.

## Acceptance Criteria

- Backend architecture is justified.
- API contracts are defined.
- Security model is defined.
- Deployment model is defined.
- Flutter integration points are documented.

---

# 28. Phase 23 — Backend Implementation

## Master Prompt

> Implement the approved backend architecture using production code.
>
> Every endpoint must have:
>
> - request contract
> - response contract
> - validation
> - authentication/authorization where required
> - persistence
> - error handling
> - logging
> - security controls
> - automated tests where appropriate
>
> Do not use hardcoded fake responses.
>
> Integrate backend services through repository/service interfaces.
>
> Do not couple network calls directly into presentation widgets.

## Acceptance Criteria

- Backend services run correctly.
- Persistence is real.
- Validation works.
- Error contracts work.
- Security controls are present.
- Tests cover important behavior.

---

# 29. Phase 24 — Backend Integration

## Master Prompt

> Integrate the approved backend into the existing Flutter application without redesigning the frontend.
>
> Replace or extend repository implementations only where backend functionality is required.
>
> Preserve offline behavior where required.
>
> Implement loading, success, empty, retry and error states for network-dependent features.
>
> Never leave network-dependent pages blank.
>
> Handle loss of connectivity gracefully.
>
> Do not modify unrelated screens or game systems.

## Acceptance Criteria

- Backend features work from the Flutter app.
- Offline behavior remains correct.
- Error states are complete.
- No dead network buttons.
- No unrelated redesign occurs.

---

# 30. Phase 25 — Release Engineering and APK

## Goal

Generate the production Android build.

## Master Prompt

> Prepare the Flutter application for Android release.
>
> Verify:
>
> - application ID
> - application name
> - launcher icon
> - launch behavior
> - Android permissions
> - version
> - release configuration
> - signing configuration
> - assets
> - localization
> - offline behavior
> - backend configuration if applicable
> - crash-free startup
>
> Generate the release APK.
>
> Install and test the release APK on a physical Android device.
>
> Verify startup, navigation, game start, loop behavior, persistence and critical gameplay.
>
> Do not claim release readiness if the APK fails to build, install or run.

## Deliverable

A validated Android APK suitable for installation on the target device.

---

# 31. Global Definition of Done

The application is complete only when:

- App launches.
- No production page is blank.
- Navigation works.
- Every implemented button works.
- New Game works.
- Continue works.
- Loop works.
- Loop resets correctly.
- Knowledge persists.
- Transient state resets.
- Inventory works.
- Interactions work.
- Puzzles work.
- NPC routines work.
- Dialogue works.
- Hints work.
- Story progression works.
- Endings work.
- Save/load works.
- Settings work.
- English works.
- Hindi works.
- Offline behavior works.
- Existing features remain functional after later changes.
- No known critical crash remains.
- No fake backend is represented as real.
- Backend integration, when implemented, uses real services.
- Release APK builds.
- Release APK installs.
- Release APK runs on a physical Android device.

---

# 32. Change Management Master Rule

For every future change:

1. Inspect the current implementation first.
2. Identify exactly what is requested.
3. Identify affected files/components.
4. Reuse existing implementation.
5. Modify only the requested functionality and technically necessary dependencies.
6. Do not redesign unrelated UI.
7. Do not recreate existing components.
8. Do not duplicate services.
9. Preserve existing behavior.
10. Run relevant validation.
11. Fix regressions caused by the change.
12. Report the actual changes.

---

# 33. No-Repeat Rule

Before implementing anything, determine whether it already exists.

If it exists and works:

**Do not rebuild it.**

If it exists but is broken:

**Fix it.**

If it is partially implemented:

**Complete it.**

Only create a new implementation when the required capability genuinely does not exist.

---

# 34. Design Lock Rule

After design approval:

- Do not change colors without explicit instruction.
- Do not change typography without explicit instruction.
- Do not change navigation without explicit instruction.
- Do not change layout without explicit instruction.
- Do not change component styles without explicit instruction.
- Do not change screen hierarchy without explicit instruction.
- Do not replace the approved visual direction.

Only explicitly requested design changes override this rule.

---

# 35. Production Quality Rule

A screen is not complete merely because it looks finished.

Evaluate every feature through:

**UI → State → Business Logic → Persistence → Feedback → Error Handling**

A visually complete screen with missing behavior is not considered complete.

---

# 36. Master Execution Order

Execute in this order:

**01 Foundation**
→ **02 Design System**
→ **03 Navigation**
→ **04 Home**
→ **05 Game State**
→ **06 Loop**
→ **07 World**
→ **08 Interaction**
→ **09 Inventory + Knowledge**
→ **10 Puzzles**
→ **11 NPC + Dialogue**
→ **12 Hints**
→ **13 Story**
→ **14 Endings**
→ **15 Persistence**
→ **16 Audio + Accessibility**
→ **17 Settings + Localization**
→ **18 Analytics Architecture**
→ **19 MVP Integration**
→ **20 QA + Performance**
→ **21 Frontend Freeze**
→ **BACKEND APPROVAL GATE**
→ **22 Backend Planning**
→ **23 Backend**
→ **24 Backend Integration**
→ **25 Release + APK**

Do not restart completed phases.

Do not split a phase into unnecessary sub-phases.

Do not repeat completed work.

Do not redesign locked UI.

Do not introduce unrelated changes.

---

# 37. Final Implementing-Agent Instruction

Treat this document as the project's master implementation contract.

Before every implementation:

- inspect the current project;
- compare the request with this document;
- preserve existing functionality;
- implement only required changes;
- use production architecture;
- never fake backend functionality;
- never leave blank pages;
- never create dead buttons;
- never repeat completed work;
- never redesign locked UI without explicit instruction;
- validate affected functionality;
- keep the application buildable.

The final objective is a real Flutter Android application that can be installed and used on a physical mobile device, with the frontend completed first, backend introduced only after explicit authorization, and a validated APK generated at release stage.
