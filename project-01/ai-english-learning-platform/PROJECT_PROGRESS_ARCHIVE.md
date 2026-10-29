# Project Progress Archive

This file stores the archived progress log history for the AI English speaking learning website project.

---

- 2026-06-30 — **Simplify Mini Conversation Section — COMPLETE & VERIFIED.**
  - **Overhauled Mini Conversation Section:** Redesigned the conversational practice flow to be simple, clean, and beginner-friendly. Removed general guides, checklist cards, and unnecessary widgets specifically when in the Conversation section.
  - **Conversational Action Flow:** Configured the bubbles view to show "Listen Conversation" alongside the audio cues. Implemented the flow: Read Conversation -> Write/Speak Reply -> Check with AI -> Better Reply -> Hinglish Explanation -> Try Again.
  - **Mock AI Feedback:** Styled a unified feedback panel labeled "Mock AI Feedback — based on your typed/spoken reply text only" showing user reply, better reply, specific mistake, and Hinglish explanation. Replaced score metrics with a qualitative status (Good / Needs Practice).
  - **Coach Sidebar Integration:** Replaced the generic right-sidebar panels with a single "Conversation AI Coach" summary card explaining learning objectives.
  - **Tabs and Tips Polish:** Adjusted tab displays for Conversation sections to show only AI Tips, Notebook Notes, and Mistakes. Simplified AI Tips to present exactly 4 conversation practice tips with no save button.
  - **Build status:** `npx tsc --noEmit` compiled successfully with 0 errors.

- 2026-06-30 — **Final Small Fix — Speaking Drill Action Flow — COMPLETE & VERIFIED.**
  - **Button Renaming**: Renamed "Start Speaking" button references to "Speak / Record Answer" inside both `SectionDetailView.tsx` and `MockAICoachPanel.tsx` for visual and functional consistency.
  - **Show/Hide Transcript Box:** Configured the transcript textarea input to be hidden initially under Speaking Practice Coach. Clicking "Speak / Record Answer" or the manual fallback button ("Type transcript manually") reveals the input box.
  - **Check & Compare Flow:** Displayed the "Check / Compare" and "Clear / Reset" buttons only when the transcript box is active. Restructured the Mock AI Feedback block to display only after the comparison is run.
  - **Feedback Details & Branding:** Standardized the Mock AI feedback labels to "Mock AI Feedback — based on transcript comparison only" and replaced pronunciation terminology with "sentence clarity" or "transcript match". Includes Hinglish explanation, score, wrong words list, and mistake types.
  - **Notebook & Mistakes Persistence:** Configured "Save Note" to save attempts to Notebook Notes and "Save Mistake" to persist weak attempts to Mistakes list.
  - **Extra Speaking Practice:** Embedded the dynamic extra speaking lines in a collapsed "Extra Speaking Practice" accordion block.
  - **Build Verification:** Successfully ran production build command `npm run build` which compiled cleanly with 0 errors. Dev server remains running at http://localhost:5173.

- 2026-06-29 — **Grammar Section Detailed Polish & Speech Results — COMPLETE & VERIFIED.**
  - **Structured AI Coach Replies:** Updated `handleAskGrammarCoach` to return replies structured with Result, Answer, Correct Answer (if applicable), Explanation, and Weak Point fields.
  - **Pronunciation Drill Results:** Enhanced `handleStartSpeakGrammar` to set detailed status, transcript, and weak words lists in state and display them dynamically in the UI.
  - **Unified Focus Area Card:** Replaced old cards with a unified "Focus Area" card, mapping both weak grammar points and pronunciation focus words, visible only when issues exist.
  - **Build status:** `npm run build` compiled successfully with 0 errors.

- 2026-06-29 — **Grammar Section Simplification & Polish — COMPLETE & VERIFIED.**
  - **Refactored Grammar Section:** Overhauled `SectionDetailView.tsx` to display a single-column Grammar workspace. Kept the explanation rules, dynamic rule breakdown, and example sentences with text-to-speech support (individual Listen and global Listen All).
  - **Practice & AI Tutor Integration:** Built tabbed practice interfaces for Identify Parts, Make Sentence, Fix Sentence, and Quick Quiz. Integrated a custom Grammar Coach AI panel with quick actions, weak pronunciation points log, and completion-locked checklists.
  - **Build Verification:** Successfully ran production build command `npm run build` which compiled cleanly with 0 errors.

- 2026-06-29 — **Vocabulary Section Simplification & Polish — COMPLETE & VERIFIED.**
  - **Refactored Vocabulary Section:** Updated `SectionDetailView.tsx` to simplify and focus the Vocabulary section. Kept the Word table with Word | Meaning | Example | Listen, per-word listen action, bookmarking, and a global "Listen All" player.
  - **Practice & AI Coach Integration:** Created interactive sub-sections for Make Sentences, Quick Quiz, and Practice Pronunciation. Integrated the rule-based Vocabulary Coach dialog interface with quick actions (Explain, Examples, Check Sentence, Ask Quiz), a Weak Words manager storing failed quiz words, and a completion-locked Checklist.
  - **Build Verification:** Successfully ran production build command `npm run build` which compiled cleanly with 0 errors.

- 2026-06-29 — **Time Table Section Customization & Simplification — COMPLETE & VERIFIED.**
  - **Simplified Time Table Section:** Updated `SectionDetailView.tsx` to display only the study plan, total time auto-calculated, activity list with duration, study tip, checklist, and completion controls. Hidden all other elements (AI panel, listening, writing tabs, mistakes, etc.) specifically when in the Time Table/Schedule section.
  - **Time Table Customization:** Added a "Customize Time" button to toggle edit mode, rendering number inputs (1-60 minutes) for each activity. Enabled "Save Time Table" to persist customized timings user-and-day-wise in localStorage (`eng_custom_timetable_day_${dayNumber}`), "Cancel" to discard modifications, and "Reset Default" to restore default durations.
  - **Build Verification:** Successfully ran production build command `npm run build` which compiled cleanly with 0 errors.

- 2026-06-29 — **Daily Lesson Detail & Section View Refactoring — COMPLETE & VERIFIED.**
  - **Improved & Simplified Daily Lesson Detail:** Converted raw lesson text into clean structured learning sections. Hidden original content by default behind a collapsible "View Original Content" trigger, removed repeated/coming-soon/unused cards and sections, renamed headers and buttons to user specifications (Today’s Next Step, Start Practice, Start, Save to Notebook).
  - **Structured Section Details:** Refactored `SectionDetailView.tsx` to dynamically render custom styled inline layouts for all 12 section headings including vertical timetables, rich vocabulary tables with TTS playbacks, grammar definition cards, example sentence lists, Q&A accordion groups, speaking drills with 5x repetition completion tracking, chat bubble conversation layouts, pronunciation pills, side-by-side wrong vs correct mistakes comparison blocks, interactive homework textareas (saving to localStorage), and checkbox checklists.
  - **Build status:** `npm run build` compiled successfully with 0 errors.

- 2026-06-29 — **Simplified English Course UI & Polish — COMPLETE & VERIFIED.**
  - **Simplified English Course page UI:** Cleaned up layout to focus on Today's Lesson and Course Roadmap, removed Customize Your English Learning Plan banner, FRONTEND PREVIEW badge, MOCK AI/mock-related text, extra stats/cards, 7-Day Journey step cards, bottom Mistakes Review and Course Report cards, and Day/Week/Month tabs.
  - **Kept Elements:** Kept English Course title/hero, short course description, Today's Lesson card (Today's English Plan), Continue Today’s Lesson button, Start Practice button, Open AI Notebook as secondary button, Course Roadmap schedule, and Day cards.
  - **Added Elements:** Added Continue Learning card near top, Week progress bar (Week 1: X/7 days completed), Today's Practice buttons (Read, Speak, Write), and a small Review Mistakes button shown only when unresolved mistakes exist.
  - **Build & Dev Status:** `npm run build` compiled successfully with 0 errors. Vite dev server started successfully on `http://localhost:5173/`.

- 2026-06-27 — **English Course Content + Day-wise Practice + Section Timer + Section-wise Mock AI — COMPLETE & VERIFIED.**
  - **Dynamic Timer & History System:** Built `sectionTimeService` and `learningTimerService` to handle auto-saving learning seconds to the `mockDatabase`. Implemented `SectionTimerSidebar` showing a real-time ticking clock, total study minutes, and slide-over studying history drawer.
  - **Overhauled Reports Page:** Modified `Reports.tsx` with dynamic percentage metrics, skill badges categorized into Needs Focus (<40%), Improving (40-70%), and Good (>70%), and integrated dynamic coach recommendations from `learnerInsightsService`.
  - **Clean Roadmap View:** Refactored `EnglishCourse.tsx` to remove the redundant timer hooks, variables, and cards to keep the roadmap flow clean and mobile-responsive.
  - **Build Verification:** Successfully ran `npm run build` which compiled cleanly with 0 errors.

- 2026-06-27 — **Simplified Frontend MVP & QA Pass — COMPLETE & VERIFIED.**
  - **Weekly Review Polish:** Added the missing description paragraph to Step 7 (Weekly Review) of the learning journey steps in `EnglishCourse.tsx`.
  - **QA Pass:** Code-reviewed and verified visual layouts, routing links, clean styling, and responsiveness for all primary user flow components and views: `DailyLessons`, `DailyLessonDetail`, `SectionDetailView`, `AINotebook`, `Mistakes`, `Reports` / `Progress`, and `Profile`.
  - **Build Verification:** Successfully ran production build command `npm run build` which compiled cleanly with 0 errors. Verified code validation check with `npx tsc --noEmit`.
  - **Dev Server Status:** Verified that the Vite development server starts up correctly under `npm run dev` and remains active on `http://localhost:5176/`.

- 2026-06-27 — **English Skills Practice Hub — COMPLETE & VERIFIED (mock).**
  - **Skills Practice Hub Dashboard:** Designed and implemented a responsive, grid-based Skills Hub (`"hub"` tab) inside the `PracticeCenter` component. Added calibration suggestions and assessment status CTA banners.
  - **Weak Area Highlights:** Highlighted target skills (e.g. Grammar, speaking, listening, vocab) with rose `🎯 Weak Area Focus` borders/badges dynamically reading user profiles and diagnostic scores.
  - **Navigation Integrations:** Linked Step 5 "Skills Practice Hub" on the English Course page, added a calibrated "Practice Skills" CTA on the roadmap banner, linked "Open Skills Hub" from the Dashboard's Today Plan, and added a secondary "Go to Skills Practice Hub" action on the Assessment Result page.
  - **Verification:** Ran `npm run build` which compiled successfully with 0 errors.

- 2026-06-26 — **Backend-Ready Real AI Integration Plan for Content + Spoken English — COMPLETE & VERIFIED.**
  - **Unified Real AI Services Integration:** Connected the backend-ready AI services (`speakingAiService`, `writingAiService`, `notebookAiService`, `aiTutorService`) across key frontend modules with seamless Mock AI fallbacks when the backend is offline.
  - **AI Notebook Upgrade:** Linked `notebookAiService` to generate dynamic 3-bullet summaries, vocabulary extractions, and tutor questions. Wired SpeechRecognition transcription and text-to-speech playback controls.
  - **Practice Center Upgrade:** Updated writing and speaking tabs to run `writingAiService.checkWriting` and `speakingAiService.analyzeSpeaking`. Wired custom practice quizzes to call `aiTutorService.generatePracticeQuestions` dynamically from Mistakes, Notebook notes, or Saved Sentences. Enabled voice-to-text recording and text-to-speech correct pronunciation playbacks.
  - **Mistakes Coach Upgrade:** Programmed Mistakes page to fetch real tutor explanations via `aiTutorService.explainContent` for the dominant error pattern, and check rewrite correctness via `writingAiService.checkWriting`.
  - **Current build status:** `npm run build` compiled successfully (exit code 0). Vite dev server is running and fully functional.
  - **Next recommended step:** Proceed with building the real Spring Boot backend APIs to connect this service layer to MySQL/Gemini models.

- 2026-06-26 — **Unified Learner Data Consistency & Final Integration Cleanup — COMPLETE & VERIFIED (mock).**
  - **Latest completed frontend work:** Fixed invisible button text color in the orange/pink "Personal Setup Plan Missing" banner on the Dashboard page to use high-contrast dark indigo text on a white pill background with proper focus/hover rings.
  - **Dashboard/user flow updates:** Connected user preferences (goals, level, weak areas) to the main dashboard welcome cards and setup plan checkers.
  - **Dynamic learner engagement features:** Integrated unified learner insights layer (`learnerInsightsService.ts`) to compute stats like streaks, completed lessons, completed sections, writing/speaking checks, and mock AI coach suggestions based on active localStorage data.
  - **English Course status:** Refactored English Course page to read metrics from unified insights and hide administrative buttons/actions from users.
  - **AI Notebook / Practice / Mistakes / Reports status:** Unified stats across AINotebook, PracticeCenter, Mistakes, Reports, and Profile pages to pull directly from the centralized insights. Implemented clean, helpful empty states with call-to-action buttons for AINotebook, PracticeCenter, and Mistakes pages.
  - **Prepositions AI Hub:** Stays paused.
  - **Backend/Admin CMS/Deployment:** Stays paused.
  - **Current build status:** `npm run build` compiled successfully (exit code 0). Vite dev server is running and fully functional.
  - **Next recommended step:** Proceed with planning the backend API integration when the user decides to un-pause it.

- 2026-06-26 — **Dynamic Learner Engagement Features — COMPLETE & VERIFIED (mock).**
  - Integrated dynamic calculators inside `learnerInsightsService.ts` to compute user streaks, level completions, study metrics, and mock AI coach suggestions based on active localStorage data.
  - Linked Dashboard and English Course widgets to display live learner settings, streak counters, goal completion rates, and focus areas.
  - Added Setup CTA banners to Dashboard and English Course when study plans remain unconfigured.
  - Redesigned the Mistakes page to feature tabbed filters (All, Checked, Unchecked) and an interactive mock AI practice/review form checking user input inline and updating database status.
  - Added a Saved Sentences widget under the AI Notebook left sidebar detailing challenging sentences, their explanations, and links to source lessons.
  - Implemented lesson/section bookmarking triggers and inline difficult sentence saving textboxes in `DailyLessonDetail.tsx` and `SectionDetailView.tsx`.
  - Verification: `npm run build` compiled successfully (exit code 0).

- 2026-06-26 — **User Reports + History Pages Redesign — COMPLETE & VERIFIED (mock).**
  - Redesigned the `/reports` page into a single-column layout containing the 6 learner report sections: Header (My English Report, Frontend Preview badge), Summary Cards (Lessons completed, sections completed, writing checks, speaking checks, notebook notes, mistakes saved, revision tasks completed, study streak), English Course Progress, Skill Progress progress bars, Mistake Report, and Mock AI Suggestions.
  - Simplified the `/progress` page to import and render the redesigned Reports component directly to maintain route alignment.
  - Redesigned the `/history` page to show the 7 learner filters: All, Lessons, Notebook, Mistakes, Writing, Speaking, Revision. Cleaned up timeline cards to show activity titles, descriptions, source page/module tags, times, and dynamic action buttons. Added empty state for new learners.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active and verified.

- 2026-06-26 — **Demo User Profile Improvements — COMPLETE & VERIFIED (mock).**
  - Redesigned the `/profile` page for Demo User with high-fidelity styled sections: initials avatar header, English learning preferences (English level, daily study minutes, main goal, weak areas checkboxes), daily study goal trackers, learning progress summary grids, AI Notebook preferences (quick statistics and auto-save toggles), content permission rules (demarcating user vs. admin-controlled content), and account display name/preferred language settings.
  - Connected the main dashboard welcome card to read/render target goals and weak area badges from the profile preferences.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active on http://localhost:5173.

- 2026-06-26 — **Learner-Flow Dashboard Redesign & Refactoring — COMPLETE & VERIFIED (mock).**
  - Redesigned the `/dashboard` for learner flow only: Welcome Card (Frontend Preview), Today's English Plan (Admin-controlled content, read-only), Continue Learning (Admin-controlled content, read-only), Practice Tools (User learning content, Mock AI), Import Text (User learning content), Progress Summary, and Mock AI Coach.
  - Refactored `aiNotebookService` to route all notebook operations through the mock database layer (`mockDatabase.ts`) under the custom `notebookItems` collection to respect the `Page → service → mockDatabase → localStorage` flow.
  - Saved imported text notes with: `sourceType: "User Import"`, `moduleKey: "user-notebook"`, `isUserCreated: true`, `isAdminContent: false`, `contentOwner: "user"`.
  - Verification: `npm run build` completed successfully.

- 2026-06-25 — **Modules Page Support Card Cleanup — COMPLETE & VERIFIED (mock).**
  - Removed duplicate Reports, History, and Profile cards from the Modules page Support & Utilities section since they are already present in the sidebar/navigation layout. Kept the AI Notebook and Smart Revision cards active and realigned them nicely into a responsive 2-column grid.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active on http://localhost:5176.

- 2026-06-25 — **English Course AI Learning Hub — COMPLETE & VERIFIED (mock).**
  - Overhauled `/modules/english-course` to implement a comprehensive English Course AI Learning Hub featuring dynamic stats summaries, Today's English Plan, Day/Week/Month Roadmap Tabs, Skill Modules preview grids, Mock AI Coach recommendations, Section Practice, Mistakes (preposition-filtered), Notebook and Report summaries, and an interactive study timer. Keep Prepositions separate. Updated the English Course card in `/modules`.

- 2026-06-25 — **Reports, Progress, and Profile Polish (Module 6) — COMPLETE & VERIFIED (mock).**
  - Polished the Reports page (`Reports.tsx`) to show 4 separate module report cards (English Course, Prepositions, Mistakes, and Overall Progress) dynamically filtered by periods (Today, Last 7 days, This month, All time). Added custom action buttons for browser print, clipboard text copying, and interactive mock study data generation.
  - Polished the Progress page (`Progress.tsx`) to show back buttons, study stats, streak details, custom Tailwind activity bar charts, active module progress bars (English Course, Prepositions, Practice, Mistakes, and Extension Inbox summary), and detailed timelines.
  - Polished the Profile page (`Profile.tsx`) to show back buttons, active streak details, user levels, settings forms, study modes (mock offline mode), and clear database options with confirmation matching.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active on http://localhost:5176.

- 2026-06-25 — **Practice, Mistakes, and History Polish (Module 5) — COMPLETE & VERIFIED (mock).**
  - Polished `/english/practice` and `/prepositions/practice` to include interactive inline mock AI practice launchers utilizing the `PracticeRunner` component, including details about mock AI feedback, saving English/preposition mistakes separately, and lists of recent practice activities.
  - Redesigned the Mistakes page (`Mistakes.tsx`) to show summary metrics (Total, English Course, Prepositions, Reviewed), clean module tabs (All, English, Prepositions, Writing, Speaking), correct empty states, and links to Reports/Progress.
  - Redesigned the History page (`History.tsx`) to feature a premium dotted timeline layout, Module filters (All, English, Prepositions, Practice, Mistakes, Extension Inbox, Profile), Period filters (Today, This Week, This Month, All Time), search, and links to Reports.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active on http://localhost:5176.

- 2026-06-25 — **Home Button and Back Navigation Fixes — COMPLETE & VERIFIED (mock).**
  - Restricted floating Home button visibility to public/auth routes: `/login`, `/register`, and `/forgot-password` (hidden on the Home landing page `/` and all protected application pages).
  - Removed `<HomeButton inline />` from the global authenticated `Navbar` component.
  - Added clean, outline/ghost-styled contextual Back buttons to detail, practice, and submodule views: `/modules/english-course`, `/daily-lessons/day/:dayNumber`, `/lesson/:id`, `/prepositions/:type`, `/practice/daily/:lessonId`, `/practice/preposition/:type`, and `/reports`.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active and running on port 5176.

- 2026-06-25 — **Learning Modules Redesign (Two Main Modules Flow) — COMPLETE & VERIFIED (mock).**
  - Redesigned the `/modules` page to display only two main learning module cards: English Course and Prepositions.
  - Moved all related features (Today Progress, Day/Week/Month stats, Daily Lessons paths, Vocabulary/Speaking AI/Reading/Writing/Grammar status, English Practice, Reports, History, Mistakes and Timers) inside the respective module cards (with tabbed/sectional filters to keep them uncluttered).
  - Added a top summary statistics strip featuring: Today Progress, Study Time, Mistakes Saved, and Reports Generated.
  - Added support grids below the main cards for: Overall Reports, All Module History, and Profile/Extension Inbox links.
  - Kept desktop sidebar and mobile bottom navigation links simplified to only: Dashboard, Modules, History, Reports, and Profile.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active and running on port 5176.

- 2026-06-25 — **Learning Modules Redesign (Simple Explore Flow) — COMPLETE & VERIFIED (mock).**
  - Redesigned the `/modules` overview page to feature exactly 9 top-level cards: English Course, Prepositions, Mistakes, Extension Inbox, History, Reports & Progress, Today Learn, Focus Timer, and Profile.
  - Simplified the desktop sidebar and mobile bottom navigation to show only: Dashboard, Modules, History, Reports, and Profile (removing Daily Lessons, English Course, Prepositions, Mistakes, Extension Inbox, and Progress).
  - Kept English Course and Prepositions separate; moved all English skill sub-modules inside the English Course cards and detail view.
  - Added an interactive, responsive, visual pomodoro sprint countdown block inside the **Focus Timer** card on the Modules page.
  - Updated progress log stats, checklist trackers, and report buttons across all module cards.
  - Verification: `npm run build` completed successfully (exit code 0). Dev server is active and running on port 5176.

- 2026-06-25 — **English Course restructure — COMPLETE & VERIFIED (mock).**
  - Renamed English Lessons module to English Course.
  - Moved Vocabulary/Speaking AI/Reading/Writing Drafts/Grammar Core into English Course as sub-modules (with coming-soon status, leaving Daily Lessons as active).
  - Kept Prepositions as a separate active top-level module card.
  - Added new English Course Detail Page at `/modules/english-course` listing sub-modules, progress metrics, and action links.
  - Updated `/modules` overview page to show: English Course, Prepositions, Mistakes, Extension Inbox, and Reports & Progress.
  - Updated desktop sidebar and mobile bottom navigation labels and links.
  - Build result: Successful (`npm run build` returned exit code 0).
  - Dev server started for manual testing on port 5176.
  - Next pending: Module 4 detailed learning page polish OR backend/MySQL later.

- 2026-06-25 — **Updated project plan** to reflect current state: frontend completed up to Option A,
  Option B (Frontend Mock Admin CMS) removed from active work, backend/MySQL/browser extension paused,
  deployment removed from active build plan until full website completion, and next work set to combined
  Final Frontend Design & Polish.

- 2026-06-25 — **Option A: Extension Inbox mock page + Progress/Profile Polish — COMPLETE & VERIFIED (mock).**
  - **Extension Inbox:** Added `types/extension.types.ts`, `services/extensionImportService.ts` (manages mock clips, seeds 3 realistic items, routes conversions, integrates history), `components/extension/ExtensionInboxCard.tsx` (collapsible preview, metadata), `components/extension/ExtensionImportForm.tsx` (validates manually added clips via RHF + Zod), and `pages/ExtensionInbox.tsx` (status card, conversion detail wizard modal, delete/clear actions).
  - **Progress Polish:** Rewrote `/progress` to display a detailed stats dashboard, weekly activity bar chart, tabbed navigators with Day-by-Day lesson timelines (view/practice states), and preposition trackers (notes, mistakes, latest quiz scores).
  - **Profile Polish:** Added preferred practice focus dropdown, mock status cards, and a confirmation-locked local database reset (requires typing "delete my data" exactly to avoid accidental deletes).
  - **Wiring & Integration:** Registered route `/extension-inbox` in `App.tsx` and updated navigation bars (`navItems.ts` and `MobileBottomNav.tsx`). Added inbox and progress widgets to `Dashboard.tsx`. Added history logs for new extension actions.
  - **Build:** Checked `npm run build` which passes cleanly (0 errors).

- 2026-06-25 — **Local checkpoint: Phase 3 + Phase 4 frontend saved (no push).** Created a local
  checkpoint commit of the completed frontend work (Phase 1 + Phase 2 were already committed earlier at
  `e3b6333`). This checkpoint bundles the previously-uncommitted Phase 3 and Phase 4 work — see the two
  detailed entries below. Summary of what exists in code: separate **Daily Lessons** and **Prepositions**
  modules + their gap-fill; a **Practice** system (shared `PracticeRunner`) with **mock AI** question
  generation + answer checking, **mistake saving** + a source-filtered **Mistakes** page, and **History**
  integration for practice actions. New routes: `/practice/daily/:lessonId`,
  `/practice/preposition/:type` (Mistakes reuses the existing `/mistakes`). **Build:** `npm run build`
  passes (tsc --noEmit + vite build, 0 errors). Backend / MySQL / real browser extension remain
  **PAUSED**. **Next phase pending user approval.**

- 2026-06-24 — **Phase 4: Practice + Mock AI + Mistake saving + History — COMPLETE & VERIFIED (mock).**
  Added a practice system shared by Daily Lessons and Prepositions, with sources kept fully separate
  (`sourceType` DAILY_LESSON vs PREPOSITION) — no real AI, no API keys, localStorage only.
  - **New types:** `types/ai.types.ts` (PracticeSourceType, Question, AnswerCheckResult, PracticeAnswer,
    PracticeSession, PracticeSummary) and `types/mistake.types.ts` (rich Mistake + MistakeType); extended
    `types/history.types.ts` with 6 events (QUESTIONS_GENERATED, ANSWER_CHECKED, MISTAKE_SAVED,
    DAILY_LESSON_PRACTICED, PREPOSITION_PRACTICED, MISTAKE_REVIEWED) + optional sourceType/sourceId.
  - **New services:** `services/mockDatabase.ts` (generic localStorage gateway — Page → service →
    mockDatabase → localStorage), `services/aiPracticeService.ts` (mock question generation from lesson /
    preposition content, rule-based beginner-friendly answer checking, save answers + rolling sessions +
    summaries), `services/mistakeService.ts` (rich mistakes in mockDatabase + read-only bridge of the
    legacy learning-mode mistakes so nothing disappears).
  - **New components:** `practice/QuestionPracticeCard`, `AiFeedbackCard`, `PracticeSummaryCard`,
    `PracticeRunner` (shared engine); `mistakes/MistakeCard`, `MistakeFilters`, `MistakeList`.
  - **New/updated pages:** `DailyLessonPractice` (`/practice/daily/:lessonId`), `PrepositionPractice`
    (`/practice/preposition/:type`), and a rewritten `Mistakes` page (`/mistakes`) with source filters
    (All / Daily Lessons / Prepositions / Writing / Speaking), Repeat practice, delete, empty/loading states.
  - **Wiring:** routes added in `App.tsx`; "Practice Day" / "Practice" buttons on Daily Lessons (list +
    detail) and Prepositions (list + detail) now open the practice routes; Mistakes added to the mobile
    bottom nav; Dashboard gained a "Practice today" card (continue latest daily/preposition practice +
    recent sessions); History page shows the 6 new practice activities.
  - **History:** practice actions logged only on user actions (ref-guarded once-per-open for
    "questions generated" / "practiced"; per-click for checked / saved / reviewed) — no re-render or
    StrictMode spam.
  - **Build:** `npm run build` passes (tsc --noEmit + vite build, 0 errors). **Verified:** a 4-way
    adversarial review (data separation, history-spam/StrictMode, mistake-bridge integrity,
    regressions/data-flow) all PASS (high confidence; tsc 0, no direct localStorage in pages/components) +
    an 18/18 logic simulation of the mock checker and mistake bridge. Applied 2 hardening fixes
    (sourceType in question ids; double-click guard on Check). No existing routes/data broken; backend /
    MySQL / extension remain PAUSED. Not committed (awaiting "commit karo").
  - **Next pending (your choice):** Extension Inbox mock + Progress/Profile polish, OR a frontend mock Admin CMS.

- 2026-06-24 — **Phase 3 gap-fill — COMPLETE & VERIFIED (mock, additive only).** Fixed three real gaps
  found in the Phase 3 verification, without rebuilding or overwriting working code:
  - **Daily Lessons / Prepositions separation.** `dailyLessonService.listDailyLessons()` now also excludes
    `topicType === "preposition"`, so preposition content can never appear under `/daily-lessons` or
    `/daily-lessons/day/:n` — even for older saved data that mixed them in. Preposition lessons are NOT
    deleted (they still show in the Lesson Library). The seed's old "Preposition IN" Day 2 is replaced by a
    real "Week 1 Day 2 — Basic Sentences" daily lesson.
  - **History view-logging.** Added `DAILY_LESSON_VIEWED` + `PREPOSITION_VIEWED` event types (and History
    page labels/tones) and one-time, ref-guarded logging in `DailyLessonDetail` + `PrepositionDetail`
    (one entry per day/preposition on open or id change; no 3s-poll or StrictMode duplicate spam).
  - **Daily-lesson seed Day 3–5.** Added `DEFAULT_DAILY_LESSONS` (Week 1, Day 1–5: Daily Routine, Basic
    Sentences, Self Introduction, This/That/These/Those, There is/There are) and an idempotent
    `ensureDailyLessonsSeeded()` top-up that adds only MISSING default days (own flag
    `eng_daily_lessons_seeded_v1`) without overwriting or duplicating user lessons.
  Files updated: `services/lessonService.ts`, `services/dailyLessonService.ts`, `types/history.types.ts`,
  `pages/History.tsx`, `pages/DailyLessonDetail.tsx`, `pages/PrepositionDetail.tsx`. No files created/deleted.
  **Build:** `npm run build` passes (tsc --noEmit + vite build, 0 errors). **Verified:** adversarial review
  (history-spam PASS, seed-safety PASS) + a data-state simulation proving no preposition leak and Day 1–5
  present for fresh / old-v1 / custom users. Not committed (awaiting "commit karo"). **Next pending (your
  choice):** Phase 4 Practice + Mock AI + Mistake saving, OR a frontend mock Admin CMS.

- 2026-06-24 — **Frontend Redesign Phase 2: Import workflow + History — COMPLETE & VERIFIED (mock).**
  Completed items:
  - Full import workflow: clipboard → auto-detect → auto-saved draft → preview → save.
  - Added `types/import.types.ts` and `types/history.types.ts`.
  - Added `services/clipboardImportService.ts` and `services/historyService.ts` (localStorage gateways).
  - Added components `import/ClipboardPasteBox`, `AutoDetectBadge`, `ImportSourceSelector`, `ImportPreviewCard`.
  - Rewrote the `LessonImport` page (`/lesson-import`): paste button + manual fallback, auto-detect +
    auto-fill, tags, debounced draft auto-save (with a "saving/saved" status), Create Preview, Save as
    Daily / Preposition / General, Clear Draft.
  - Added the `ImportPreview` page at `/import-preview` (detected fields + raw + clean preview +
    save-type selector + Final Save / Back to Edit / Clear Draft).
  - Added the `History` page at `/history` (type badges, date/time, related lesson/day links, search,
    filters, clear-with-confirmation, JSON export).
  - Added `LESSON_VIEWED` logging in `LessonDetail` (once per view, not on every poll).
  - Wired routes (`/import-preview`, `/history`) and navigation (sidebar + mobile bottom nav, which now
    auto-scrolls the active tab into view).
  - Updated Dashboard cards: import-copied-content quick button, recent import-draft card, recent-history card.
  - Added `"writing"` topic type support (enum + labels + tones).
  - History events: IMPORT_DRAFT_SAVED, IMPORT_PREVIEW_CREATED, IMPORT_FINAL_SAVED, LESSON_SAVED,
    DAILY_LESSON_SAVED, PREPOSITION_NOTE_SAVED, LESSON_VIEWED.

  Verified: clipboard fallback works when permission is blocked; manual paste always works; import
  preview works; draft auto-save works; JSON history export works; clear-history confirmation works.
  A multi-agent review's 9 findings were all fixed and re-verified; detection unit checks 18/18;
  `npm run build` passed (tsc --noEmit + vite build, 0 errors). Backend / MySQL / browser extension
  remain **PAUSED**. **Phase 3 is pending and must wait for user approval.**

- 2026-06-24 — **Frontend Redesign Phase 1: foundation audit/refactor (not a reset).** Audited the
  existing frontend: app shell (AppLayout/Navbar/Sidebar/MobileBottomNav), mock auth
  (authService + AuthProvider, wired in main.tsx), protected routing (App.tsx), and core pages
  (Home/Login/Register/Dashboard/NotFound) — all present and working; existing Lesson / Daily
  Lessons / Prepositions features left intact. Added two missing foundation components
  `common/LoadingState.tsx` and `common/ErrorState.tsx`, and wired them into Dashboard (graceful
  loading + error-with-retry, per the "app must not break" rule). Updated `frontend/.env.example`
  to add `VITE_API_MODE=mock` and align `VITE_API_BASE_URL`. Added the "Frontend Redesign
  Phase-wise Plan — Active Override" section (Section 0) noting backend is paused and existing
  features must be preserved. No backend / MySQL / extension created. **Build:** `npm run build`
  passes (tsc --noEmit + vite build, 0 errors). **Next:** wait for the user to say "Start Phase 2".

- 2026-06-24 — **Continuation Phase A: Daily Lessons + Prepositions modules** (mock mode, frontend
  only). New routes: `/daily-lessons`, `/daily-lessons/day/:dayNumber`, `/prepositions`,
  `/prepositions/:type`. **Daily Lessons** (a "daily lesson" = any saved lesson with a day number):
  `dailyLessonService` (delegates lesson reads to `lessonService`, stores per-day progress),
  `dailyLesson.types.ts`, components `DayProgressCard`/`DayLessonCard`/`DayLessonTimeline`, pages
  `DailyLessons` (week→day grouping, progress, timeline, search + week/day/topic filters, empty
  state) + `DailyLessonDetail` (reuses `LessonFullView` for raw + clean sections, Practice/complete
  buttons, per-day placeholders). **Prepositions**: `prepositionService` (static beginner content
  for in/on/at/to/from/by/with/for/about/between, notes + quiz results in localStorage, save-mistake
  delegates to `learningService`), `preposition.types.ts`, components
  `PrepositionCard`/`RuleCard`/`ExampleList`/`QuizCard`, pages `Prepositions` (10 cards) +
  `PrepositionDetail` (rule, when to/not to use, examples, common mistakes, interactive mini-quiz,
  save note, save mistake). **Nav/Dashboard**: added Daily Lessons + Prepositions to the sidebar and
  the (now horizontally scrollable) mobile bottom nav; added Dashboard quick-action tiles (Daily
  Lessons, Prepositions, Continue latest lesson). A multi-agent review fixed 5 issues (mobile-nav
  scroll affordance, unsafe `getPreposition` cast → type guard, `DailyLessonFilter` topic field,
  timeline duplicate-day rows, quiz a11y). **Build:** `npm run build` passes (tsc --noEmit + vite
  build, 0 errors). **Next pending (your choice):** Import Preview / Clipboard paste / History /
  Extension Inbox mock, OR start the real Spring Boot backend.

- 2026-06-24 — Added the **Lesson feature** (mock mode): routes `/lesson-import`, `/lesson-library`,
  `/lesson/:id`. New files: `types/lesson.types.ts`, `services/lessonService.ts` (localStorage CRUD
  + seed + raw→clean-sections parser), `hooks/usePolling.ts` (3s auto-refresh), 5 components
  (`lessons/LessonImportForm|LessonCard|LessonList|LessonFilters|LessonFullView`), and 3 pages
  (`pages/LessonImport|LessonLibrary|LessonDetail`). Wired routes in `App.tsx` and added "Lessons"
  + "Import Lesson" to the sidebar (`navItems.ts`) and a "Lessons" tab to the mobile bottom nav.
  Library + Detail auto-refresh every 3s (Workflow §17); Full Lesson View shows the original raw
  content AND auto-split clean sections (§20). A multi-agent review pass fixed: section-parser edge
  cases (bullet list items, ChatGPT `**bold**` headings, inline known-words like "Rule: ...", Time
  Table fragmentation), a stale submit-mode bug in the import form, and a filter-chip-stranding bug
  in the library. **Build:** `npm run build` passes (tsc --noEmit + vite build, 0 errors); parser
  unit checks 7/7. **Next:** real Spring Boot backend (auth + lesson APIs), then switch the service
  layer from mock → backend. NOTE: lessons are still single-user localStorage (no user_id) — the
  real backend must store + filter lessons per logged-in user.

- 2026-06-24 — Completed frontend-first UI prototype (`frontend/`): Vite + React + TS + Tailwind.
  Added all routes, app layout (sidebar / navbar / mobile bottom nav), 14 pages, mock auth
  (localStorage + demo token), and a central `mockLearningService` (localStorage data for
  vocabulary, mistakes, homework, speaking, reading, progress, streak). Browser voice (speech
  recognition + text-to-speech) wired with typing fallback. `npm run build` passes; dev server
  runs at http://localhost:5173. **Backend API integration is still pending** (no real backend yet).

- 2026-06-24 — Created project folder, moved spec file, added work plan + rules. Ready for Phase 1.
