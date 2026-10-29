# Project File Index

This file provides an index of all files in the **Free-First AI English Speaking Learning Website** project. It details the purpose of each file and identifies files critical for the daily lesson flow, as well as those containing old UI or mock AI texts.

---

## 1. Project Root & Documentation Files

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `COMPLETE_AI_ENGLISH_LEARNING_PROJECT.md` | Documentation (Spec) | Main product specification document outlining features, data structures, and pages. | **No** (Reference spec only) |
| `PROJECT_WORK_PLAN.md` | Documentation (Plan) | The active work plan, chronological build checklist, and progress logs. | **No** (Reference plan only) |
| `rule.md` | Documentation (Rules) | AI developer guidelines, constraints, and coding instructions. | **No** (Reference instructions only) |
| `README.md` | Documentation (Index) | General project overview and developer environment startup instructions. | **No** (Developer readme only) |

---

## 2. Configuration Files

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/package.json` | Package Definition | Declares React project dependencies, scripts, and project metadata. | **No** (Build config) |
| `frontend/package-lock.json` | Dependency Lock | Auto-generated tree locking exact NPM dependency versions. | **No** (Dependency lock) |
| `frontend/tsconfig.json` | TS Configuration | Dictates TypeScript compiler options and workspace type checking. | **No** (TS settings) |
| `frontend/vite.config.ts` | Bundler Configuration | Configures Vite build options, dev server port settings, and plugins. | **No** (Bundler settings) |
| `frontend/tailwind.config.js` | Styling Configuration | Customizes Tailwind theme, utilities, and configures content scan paths. | **No** (Styling rules) |
| `frontend/postcss.config.js` | PostCSS Configuration | Sets up Tailwind and Autoprefixer CSS processing plugins. | **No** (Styling builder) |
| `frontend/index.html` | App Entry Point | HTML root template where the React application mounts. | **No** (HTML skeleton) |
| `frontend/.env.example` | Env Variable Template | Configuration file template for API base URL and mock modes. | **No** (Template environment) |
| `frontend/.gitignore` | Git Ignore | Defines paths and generated folders to exclude from version control. | **No** (Git config) |

---

## 3. Frontend Pages

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/pages/DailyLessonDetail.tsx` | Daily Lesson Page | Renders the day title, progress bar, section cards, and completion actions. | **Yes** (Primary daily lesson overview) |
| `frontend/src/pages/DailyLessons.tsx` | Timeline Directory | Lists all daily study plans grouped by Week and Day. | **Yes** (Access point for daily lessons) |
| `frontend/src/pages/EnglishCourse.tsx` | English Course Hub | Renders Today's plan, streaks, metrics, and roadmap Day cards. | **Yes** (Main route for the English Course roadmap) |
| `frontend/src/pages/Dashboard.tsx` | Student Dashboard | Displays today's agenda, progress charts, and quick-access practice tools. | **No** (General overview hub) |
| `frontend/src/pages/PracticeCenter.tsx` | Practice Dashboard | Houses AI writing, speaking, and skill calibration hub tools. | **No** (General practice launcher) |
| `frontend/src/pages/Reports.tsx` | Performance Reports | Displays study statistics, streak charts, and coach recommendations. | **No** (General reports view) |
| `frontend/src/pages/Profile.tsx` | User Preferences | Configures study goals, languages, and manages local data resets. | **No** (Settings page) |
| `frontend/src/pages/History.tsx` | Activity Logs | Displays a filterable chronological list of user learning actions. | **No** (Study audit history) |
| `frontend/src/pages/Mistakes.tsx` | Mistakes Ledger | Lists logged vocabulary/grammar mistakes with options to review/clear. | **No** (Weakness revision page) |
| `frontend/src/pages/ExtensionInbox.tsx` | Clip Importer Board | Dashboard page for converting clipboard items saved via extension. | **No** (Extension inbox manager) |
| `frontend/src/pages/LessonImport.tsx` | Lesson Creator | Allows pasting raw textbook texts to parse and import into library. | **No** (Content creation tool) |
| `frontend/src/pages/LessonLibrary.tsx` | Content Repository | Displays library of all imported customized lesson materials. | **No** (Internal library viewer) |
| `frontend/src/pages/LessonDetail.tsx` | Raw Content Detail | Admin/internal details page rendering raw lesson texts. | **No** (Admin utility page) |
| `frontend/src/pages/ImportPreview.tsx` | Importer Preview | Interactive review screen for parsed lessons prior to saving. | **No** (Import pipeline helper) |
| `frontend/src/pages/Prepositions.tsx` | Preposition Hub | Lists prepositions study cards (in, on, at, to, etc.). | **No** (Standalone module index) |
| `frontend/src/pages/PrepositionDetail.tsx` | Preposition Lessons | Interactive rules and mini-quizzes workspace for a preposition type. | **No** (Standalone preposition page) |
| `frontend/src/pages/DailyLessonPractice.tsx` | Practice Routing Bridge | Intermediate route bridge directing user to daily practice. | **No** (Routing utility) |
| `frontend/src/pages/PrepositionPractice.tsx` | Practice Routing Bridge | Intermediate route bridge directing user to preposition practice. | **No** (Routing utility) |
| `frontend/src/pages/AINotebook.tsx` | Notebook Archive | Grid page displaying saved notes, sentences, and translations. | **No** (Notebook workspace) |
| `frontend/src/pages/SmartRevision.tsx` | Spaced Repetition | Flashcards-based spaced repetition review module. | **No** (Review tool) |
| `frontend/src/pages/EnglishAssessment.tsx` | Level Assessment | Interactive questionnaire to identify English skill levels. | **No** (Diagnostic utility) |
| `frontend/src/pages/EnglishAssessmentResult.tsx` | Level Results | Shows level classification and recommended roadmap plans. | **No** (Diagnostic result page) |
| `frontend/src/pages/Login.tsx` | Sign-in Screen | Page containing credentials forms for user authentication. | **No** (Public auth page) |
| `frontend/src/pages/Register.tsx` | Sign-up Screen | Page containing forms for registering new learner accounts. | **No** (Public auth page) |
| `frontend/src/pages/ForgotPassword.tsx` | Recovery Screen | Form requesting password reset links. | **No** (Public auth page) |
| `frontend/src/pages/Home.tsx` | Landing Screen | Public homepage showcasing product features and options. | **No** (Public landing page) |
| `frontend/src/pages/NotFound.tsx` | Error Fallback | Displays 404 page when a non-existent URL is accessed. | **No** (Routing utility) |
| `frontend/src/pages/Progress.tsx` | Route Wrapper | Redirect wrapper rendering `Reports` component inside progress tab. | **No** (Routing wrapper) |
| `frontend/src/pages/EnglishModule.tsx` | Legacy View | Old course page now replaced by EnglishCourse page. | **No** (Obsolete legacy page) |
| `frontend/src/pages/EnglishPractice.tsx` | Legacy Practice | Standalone skill practicing view now housed in PracticeCenter. | **No** (Obsolete legacy page) |
| `frontend/src/pages/EnglishReport.tsx` | Legacy Reports | Individual skill charts page now combined inside Reports. | **No** (Obsolete legacy page) |
| `frontend/src/pages/EnglishSetup.tsx` | Legacy Setup | Old questionnaire wizard replaced by Profile / Assessment. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Grammar.tsx` | Legacy Grammar | Obsolete grammar exercises now inside SectionDetailView / Practice. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Homework.tsx` | Legacy Homework | Standalone writing module now inside SectionDetailView. | **No** (Obsolete legacy page) |
| `frontend/src/pages/PersonalImport.tsx` | Legacy Importer | Older custom notebooks importer now combined in LessonImport. | **No** (Obsolete legacy page) |
| `frontend/src/pages/PrepositionsPractice.tsx`| Legacy practice | Prepositions launcher replaced by PrepositionPractice. | **No** (Obsolete legacy page) |
| `frontend/src/pages/PrepositionsReport.tsx` | Legacy Reports | Preposition statistics replaced by general Reports page. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Reading.tsx` | Legacy Reading | Read-aloud practice replaced by SectionDetailView and Practice. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Speaking.tsx` | Legacy Speaking | Spoken audio practice replaced by SectionDetailView and Practice. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Vocabulary.tsx` | Legacy Vocabulary | Standalone words lists replaced by SectionDetailView and Practice. | **No** (Obsolete legacy page) |
| `frontend/src/pages/Writing.tsx` | Legacy Writing | Standalone essay typing replaced by SectionDetailView and Practice. | **No** (Obsolete legacy page) |

---

## 4. Frontend Components

### Lesson Detail & Section Workspace Components (Important)

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/lesson/SectionDetailView.tsx` | Section Workspace Router | Houses custom templates and exercises for all 12 section headings (Timetable, Vocabulary, Grammar, Speaking Drill, Conversation, Pronunciation, Mistakes Review, Q&A, Homework, Self Check, Summary). | **Yes** (Critical UI component for section activities) |
| `frontend/src/components/lesson/LessonSectionCard.tsx` | Section Card | Individual card button displaying status indicators on the daily lesson overview. | **Yes** (Critical daily page subsection layout) |
| `frontend/src/components/lesson/SectionProgressCard.tsx` | Progress Card | Summarizes the daily lesson completion status with a checklists review widget. | **Yes** (Critical daily completion tracker) |
| `frontend/src/components/lesson/NextStepCard.tsx` | Next Step Widget | Renders the primary CTA recommendation card for the next active lesson. | **Yes** (Drives roadmap daily learning decisions) |
| `frontend/src/components/lesson/MockAICoachPanel.tsx` | Coach Assistant | Interactive side panel offering rule-based dialog help during section study. | **Yes** (Primary AI learning helper in sections) |
| `frontend/src/components/lesson/SectionNotebookPanel.tsx` | Notebook Drawer | Side drawer allowing learners to save sentences or custom notes to their notebook. | **Yes** (Saves vocabulary and grammar notes) |
| `frontend/src/components/lesson/SectionPracticeTools.tsx` | Practice Tabs | Tab selector for Write Mode, Speak Mode, and AI Tips in general sections. | **Yes** (Legacy fallback tab renderer inside sections) |

### Common UI Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/common/Button.tsx` | Custom Button | Core button supporting primary, secondary, outline, ghost, and danger styles. | **Yes** (Used on all pages/sections) |
| `frontend/src/components/common/Card.tsx` | Card Container | Wrapper providing consistent borders, shadow, and rounded corner layout. | **Yes** (Used on all pages/sections) |
| `frontend/src/components/common/Badge.tsx` | Text Tag | Renders status tags (e.g. Completed, In Progress, Unknown, Known). | **Yes** (Used on all pages/sections) |
| `frontend/src/components/common/PageHeader.tsx` | Page Heading | Renders standard page title, description, and contextual Back buttons. | **Yes** (Standard layout helper) |
| `frontend/src/components/common/LoadingState.tsx` | Loader | Renders spin loading animations for data fetch latency. | **Yes** (Prevents app crashes on empty load) |
| `frontend/src/components/common/ErrorState.tsx` | Error Handler | Displays error notifications with retry callbacks. | **Yes** (Prevents app crashes on empty load) |
| `frontend/src/components/common/EmptyState.tsx` | Empty Placeholder | Displays clean layouts with descriptions and CTAs when no lists exist. | **No** (Dashboard / library utility) |
| `frontend/src/components/common/ProgressBar.tsx` | Progress Strip | Displays a horizontal completion percentage bar. | **Yes** (Streaks and daily completion) |
| `frontend/src/components/common/ProgressRing.tsx` | Circular Progress | Displays percentage metrics in a circular svg path. | **No** (Reports/Dashboard widget) |
| `frontend/src/components/common/SectionCard.tsx` | Container Card | Standard card layout styled for lesson sub-modules. | **No** (General components helper) |
| `frontend/src/components/common/StatCard.tsx` | Metrics Card | Displays numeric dashboard statistics with hover transitions. | **No** (General dashboard helper) |
| `frontend/src/components/common/StreakCard.tsx` | Streak Tracker | Displays active consecutive study days. | **Yes** (English Course metrics strip) |
| `frontend/src/components/common/HomeButton.tsx` | Floating Link | Home routing trigger shown on public pages (hidden inside application). | **No** (Auth pages utility) |

### Daily Lesson Timeline Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/dailyLessons/DayLessonTimeline.tsx` | Timeline Layout | Renders weekly vertical roadmap rows of study days. | **Yes** (Index roadmap layout) |
| `frontend/src/components/dailyLessons/DayLessonCard.tsx` | Timeline Card | Details topic, status, and button handlers for an individual day. | **Yes** (Index roadmap card) |
| `frontend/src/components/dailyLessons/DayProgressCard.tsx` | Progress Summary | Renders completed percentage stats for a single day. | **Yes** (Timeline header statistics) |

### Dashboard Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/dashboard/DailyGoalCard.tsx` | Study Target | Displays today's planned minutes versus actual study seconds. | **No** (Dashboard widget) |
| `frontend/src/components/dashboard/TodayPracticeCard.tsx` | Practice Launchpad | Dashboard tile launching skills revision templates. | **No** (Dashboard widget) |
| `frontend/src/components/dashboard/SkillProgressCard.tsx` | Grid Tracker | Shows current proficiency ratings in Writing, Vocab, speaking. | **No** (Dashboard widget) |
| `frontend/src/components/dashboard/WeakAreaCard.tsx` | Calibration Widget | Highlights weak English skills flagged for study. | **No** (Dashboard widget) |

### Import & Lesson Library Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/lessons/LessonFullView.tsx` | Parsed Sections list | Standard segmented preview layout showing details of raw lessons. | **No** (Admin viewer panel) |
| `frontend/src/components/lessons/LessonImportForm.tsx`| Importer Fields | Form interface with validation for adding raw lessons. | **No** (Importer tool) |
| `frontend/src/components/lessons/LessonCard.tsx` | List Card | Individual library card rendering for custom materials. | **No** (Library list item) |
| `frontend/src/components/lessons/LessonFilters.tsx` | Search Panel | Allows filtering library lessons by topic or source types. | **No** (Library filtering) |
| `frontend/src/components/lessons/LessonList.tsx` | List Grid | Card wrapper for rendering collections of custom lessons. | **No** (Library layout) |
| `frontend/src/components/import/ClipboardPasteBox.tsx` | Textarea Box | Importer text box supporting automatic system clipboard read-outs. | **No** (Importer widget) |
| `frontend/src/components/import/ImportPreviewCard.tsx` | Preview Container | Renders detected fields and clean sections before importing. | **No** (Importer preview) |
| `frontend/src/components/import/ImportSourceSelector.tsx`| Dropdown selector | Selector designating whether text comes from YouTube, article, etc. | **No** (Importer utility) |
| `frontend/src/components/import/AutoDetectBadge.tsx` | Detection Tag | Renders type badges (e.g. YouTube, PDF, Web Page) detected from text. | **No** (Importer tag) |

### Navigation & Layout Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/layout/AppLayout.tsx` | Shell Frame | Houses Sidebar navigation, Top Navbar header, and Bottom Mobile Nav. | **Yes** (Layout wrapper for all routes) |
| `frontend/src/components/layout/MobileBottomNav.tsx` | Mobile Navigation | Horizontally scrollable bottom navigation bar optimized for mobile. | **Yes** (Navigation hub on mobile) |
| `frontend/src/components/layout/Sidebar.tsx` | Desktop Sidebar | Left navigation menu displayed on desktop screen viewports. | **Yes** (Navigation hub on desktop) |
| `frontend/src/components/layout/Navbar.tsx` | Desktop Header | Top bar header showing streak counters and profile avatar actions. | **Yes** (Header info display) |
| `frontend/src/components/layout/navItems.ts` | Nav Constants | Defines routes, labels, and Lucide icon keys for navigation menus. | **Yes** (Route definitions) |

### Practice & Mistakes Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/practice/PracticeRunner.tsx` | Practice Engine | Houses the main interactive testing wizard for speaking and writing. | **No** (Practice Center hub executor) |
| `frontend/src/components/practice/QuestionPracticeCard.tsx`| Quiz Question | Renders multiple-choice questions with answers comparison. | **No** (Practice quiz utility) |
| `frontend/src/components/practice/AiFeedbackCard.tsx` | Score Evaluation | Renders correctness evaluations and grammar suggestions. | **No** (Practice checker panel) |
| `frontend/src/components/practice/PracticeSummaryCard.tsx` | Practice Summary | Renders achievements, scores, and mistakes saved after practice. | **No** (Practice summary page) |
| `frontend/src/components/practice/WritingPracticeCard.tsx` | Essay Writer | Free-text typing practice interface with word count meters. | **No** (Practice writing widget) |
| `frontend/src/components/practice/SpeakingPracticeCard.tsx`| Voice Recorder | Speech-to-text recording launcher for voice exercises. | **No** (Practice speaking widget) |
| `frontend/src/components/practice/ReadingPracticeCard.tsx` | Aloud Reader | Focuses on checking read accuracy of text segments. | **No** (Practice reading widget) |
| `frontend/src/components/practice/VocabularyCard.tsx` | Word Practice | Flashcard layout for practicing random vocabulary cards. | **No** (Practice vocab widget) |
| `frontend/src/components/mistakes/MistakeCard.tsx` | Mistake Details | Displays incorrect inputs alongside correct rewrites. | **No** (Mistakes log card) |
| `frontend/src/components/mistakes/MistakeFilters.tsx` | Filter Tabs | Filter controls to group mistakes by skills categories. | **No** (Mistakes filter widget) |
| `frontend/src/components/mistakes/MistakeList.tsx` | Mistakes Grid | Layout container displaying saved mistake items. | **No** (Mistakes list layout) |

### Revision, Reports & Other Components

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/components/revision/RevisionPlanCard.tsx` | Spaced Repetition | Card listing active reviews generated from mistakes database. | **No** (Spaced repetition plan) |
| `frontend/src/components/revision/RevisionPracticeCard.tsx`| Flashcard Practice | Interactive flashcards launcher checking user answers. | **No** (Spaced repetition practice) |
| `frontend/src/components/revision/WeakAreaCard.tsx` | Target Skill card | Suggests revisions based on identified study weaknesses. | **No** (Revision advice) |
| `frontend/src/components/reports/ReportSummaryCard.tsx` | Stats Overview | Grid of overview boxes for lesson completions and saved notes. | **No** (Reports widget) |
| `frontend/src/components/reports/ReportPeriodFilter.tsx` | Time Selector | Period picker for report durations (Today, 7 days, 30 days). | **No** (Reports widget) |
| `frontend/src/components/prepositions/PrepositionCard.tsx` | Preposition Summary | Mini card summarising rules and definitions. | **No** (Prepositions list widget) |
| `frontend/src/components/prepositions/PrepositionRuleCard.tsx` | Rules explanation | Displays detailed prepositions rules with usage tabs. | **No** (Prepositions detail card) |
| `frontend/src/components/prepositions/PrepositionExampleList.tsx`| Examples display | Renders usage examples with text-to-speech triggers. | **No** (Prepositions example card) |
| `frontend/src/components/prepositions/PrepositionQuizCard.tsx`| Quiz launcher | Interactive multiple-choice preposition quiz launcher. | **No** (Prepositions quiz card) |
| `frontend/src/components/extension/ExtensionInboxCard.tsx`| Inbox item card | Displays collapsible imported clipping item details. | **No** (Extension inbox widget) |
| `frontend/src/components/extension/ExtensionImportForm.tsx`| Clip Input Form | Text inputs validating extension clips manually added. | **No** (Extension import wizard) |
| `frontend/src/components/notebook/NotebookCard.tsx` | Saved Note Card | Grid card representing an individual notebook entry. | **No** (Notebook list widget) |
| `frontend/src/components/notebook/NotebookEditor.tsx` | Note Editing form | Simple textarea editor allowing manual changes to saved notes. | **No** (Notebook editing form) |
| `frontend/src/components/notebook/NotebookPracticePanel.tsx`| Notebook Quiz | Launchpad creating custom vocabulary quizzes from notebook words. | **No** (Notebook quiz widget) |
| `frontend/src/components/notebook/NotebookToolCard.tsx` | Quick action tile | Dashboard tile redirecting user to notebook editor. | **No** (Dashboard tile widget) |
| `frontend/src/components/modules/ModuleCard.tsx` | Core Track Card | Displays description, progress bar, and link for main modules. | **No** (Course modules index card) |
| `frontend/src/components/forms/LoginForm.tsx` | Login Fields | Username and password form handler managed via RHF and Zod. | **No** (Auth widget) |
| `frontend/src/components/forms/RegisterForm.tsx` | Register Fields | Username, email, password validation inputs via Zod. | **No** (Auth widget) |

---

## 5. Frontend Services

| File Path | Type / Purpose | Description | Important for Lesson/Section Pages? |
| :--- | :--- | :--- | :--- |
| `frontend/src/services/dailyLessonService.ts` | Daily Lesson Gateway | Handles mapping of daily lesson entities, progress trackers, and day-completions checks. | **Yes** (Manages daily study flows) |
| `frontend/src/services/lessonService.ts` | Course Content CRUD | Handles CRUD operations for lessons, parsing sections from text, and seeding default day content. | **Yes** (Core content parser and database) |
| `frontend/src/services/aiTutorService.ts` | Content AI Tutor | Generates quizzes, answers, rule breakdowns, and translations for study pages. | **Yes** (Grammar quizzes, pronoun checks, chat) |
| `frontend/src/services/mockDatabase.ts` | LocalStorage DB | Unified local database abstraction mimicking document collection CRUD. | **Yes** (Primary data persistence layer) |
| `frontend/src/services/learnerInsightsService.ts` | Progress Analytics | Analyzes study metrics, streaks, completions, and AI coach recommendations. | **Yes** (Calculates dashboard and course metrics) |
| `frontend/src/services/sectionProgressService.ts` | Section completion | Reads and updates section completion checklists in `mockDatabase`. | **Yes** (Tracks completed lesson steps) |
| `frontend/src/services/sectionTimeService.ts` | Section timers | Records studied duration seconds per individual lesson section. | **Yes** (Auto-saves learning timer data) |
| `frontend/src/services/demoSeedService.ts` | Database Seeder | Seeds mock historical events, mistakes, notes, and progress on startup. | **Yes** (Seeds learning data) |
| `frontend/src/services/learningTimerService.ts` | Active Session Timer | Controls the global ticking clock tracking active study seconds. | **No** (Global dashboard / modules tracker) |
| `frontend/src/services/aiPracticeService.ts` | Practice Generator | Custom question generator creating MCQ quiz sheets. | **No** (Practice center questions generator) |
| `frontend/src/services/mistakeService.ts` | Mistakes manager | Handles reading, deleting, and logging incorrect answers to the ledger. | **No** (Mistakes log editor) |
| `frontend/src/services/authService.ts` | User Session mock | Mock login/register helpers setting credentials tokens in localStorage. | **No** (Auth gatekeeper) |
| `frontend/src/services/extensionImportService.ts` | Web clipping manager | Custom service holding extension clips and importing them. | **No** (Extension import manager) |
| `frontend/src/services/historyService.ts` | Activity Event Logger | Logs study achievements (e.g. lesson viewed, completed) to logs. | **No** (History recorder) |
| `frontend/src/services/aiNotebookService.ts` | Notes CRUD | Manages user notes and imports saved inside the notebook. | **No** (Notebook database manager) |
| `frontend/src/services/notebookAiService.ts` | Notebook AI helpers | Generates vocabulary highlights and summaries for notes. | **No** (Notebook AI helper) |
| `frontend/src/services/practiceCenterService.ts` | AI Practice logs | Tracks essays and oral recordings sent to the practice center. | **No** (Practice center database logger) |
| `frontend/src/services/speakingAiService.ts` | Voice Evaluation AI | Simulates pronunciation and accuracy assessments for voice files. | **No** (Speaking analyzer) |
| `frontend/src/services/writingAiService.ts` | Essay Correction AI | Simulates grammar, vocabulary, and spelling audits for texts. | **No** (Writing analyzer) |
| `frontend/src/services/prepositionService.ts` | Preposition rules | Static data store holding rules and quiz questions for prepositions. | **No** (Prepositions content engine) |
| `frontend/src/services/revisionService.ts` | Revision planner | Generates daily spaced-repetition schedules from mistake logs. | **No** (Revision content engine) |
| `frontend/src/services/reportService.ts` | Legacy Reports | Older report analyzer. | **No** (Obsolete legacy service) |
| `frontend/src/services/mockLearningService.ts` | Legacy Mock service | Older local storage gateway. | **No** (Obsolete legacy service) |
| `frontend/src/services/clipboardImportService.ts` | Importer parsing | Parses raw copy-pastes to extract metadata and tags. | **No** (Import parsing engine) |
| `frontend/src/services/englishAssessmentService.ts`| Diagnostic manager | Manages assessment progress and saves final levels. | **No** (Diagnostic engine) |

---

## 6. Frontend Hooks, Utils, Constants & Types

### Hooks & Utils
- `frontend/src/hooks/useAuth.tsx`: Custom React context hook exposing active user profiles, login, and registration states.
- `frontend/src/hooks/useLocalStorage.ts`: Reactive state hook synchronized automatically with localStorage values.
- `frontend/src/hooks/usePolling.ts`: Polling interval hook used in imported lessons pages to refresh data.
- `frontend/src/utils/cn.ts`: Classname utility combining `clsx` and `tailwind-merge` to resolve duplicate class names.
- `frontend/src/utils/dateUtils.ts`: Common helpers formatting relative and calendar dates.

### Constants
- `frontend/src/constants/learningModules.ts`: Hardcoded descriptors, paths, and status keys for top-level learning categories.

### TypeScript Types (`frontend/src/types/`)
- `ai.types.ts`: Practice questions, answer checker results, and session summaries interfaces.
- `aiNotebook.types.ts`: Notebook notes schema.
- `auth.types.ts`: User credentials schemas.
- `dailyLesson.types.ts`: Daily lesson progress structures.
- `extension.types.ts`: Browser extension clips interface.
- `history.types.ts`: Logging events enum and layout.
- `import.types.ts`: Importer draft and preview formats.
- `learning.types.ts`: Legacy learning progress metrics.
- `lesson.types.ts`: Main course lesson structures.
- `lessonSection.types.ts`: Enums matching the 12 lesson section tags.
- `mistake.types.ts`: Vocabulary and grammar mistake records.
- `practiceCenter.types.ts`: Practice essay prompts and statistics.
- `preposition.types.ts`: Rules and quiz schemas for preposition lessons.
- `revision.types.ts`: Flashcard templates and study lists.
- `sectionProgress.types.ts`: Checklist indicators mapping completed sections.
- `sectionTime.types.ts`: Section tracking duration log files.

---

## 7. Important Files for Daily Lesson Flow

The daily lesson flow operates along the following pipeline:
`DailyLessons` (Roadmap Timeline) $\rightarrow$ `DailyLessonDetail` (Day Overview & Completion Check) $\rightarrow$ `SectionDetailView` (Interactive Section Activities).

The key files managing this user experience include:

1. **`frontend/src/pages/DailyLessonDetail.tsx`**: Renders the daily curriculum overview page. Ensures that all 5 mandatory segments (*Vocabulary, Grammar, Speaking Drill, Homework, Self Check*) are complete before allowing the day to be marked finished.
2. **`frontend/src/components/lesson/SectionDetailView.tsx`**: The workspace router component rendering custom layouts for each of the 12 lesson segments. Handles timetable customization editing, sequential vocabulary "Listen All" readouts, interactive grammar tabs (Identify Parts, Make Sentence, Fix Sentence, Quiz), pronunciation evaluations, homework updates, and self-evaluation cards.
3. **`frontend/src/services/dailyLessonService.ts`**: Computes completed lessons progress and manages tracking of active study days.
4. **`frontend/src/services/lessonService.ts`**: Seeds the standard Days 1-5 learning lessons, parses raw imported text into structured segment objects, and manages course content updates in local storage.
5. **`frontend/src/services/aiTutorService.ts`**: Generates grammar quizzes, processes chat-based questions from learners inside Section Coach modules, and evaluates spoken pronunciation transcripts.
6. **`frontend/src/components/lesson/LessonSectionCard.tsx`**: Displays the individual segment list cards on the daily overview.
7. **`frontend/src/components/lesson/SectionProgressCard.tsx`**: Renders the checkboxes showing completed steps for a lesson day.
8. **`frontend/src/components/lesson/NextStepCard.tsx`**: Displays the "Today's Next Step" call-to-action recommending the next activity.
9. **`frontend/src/components/lesson/MockAICoachPanel.tsx`**: Interactive AI coach dialog box displayed inside sections.
10. **`frontend/src/components/lesson/SectionNotebookPanel.tsx`**: Side drawer enabling users to save notes directly to the AI Notebook.
11. **`frontend/src/components/lesson/SectionPracticeTools.tsx`**: Provides general practice tabs (Write, Speak, AI Tips) for standard sections.

---

## 8. Files That Contain Old UI Text

The following files contain legacy wording or mock AI terminology:

| File Path | Matched Text | Why It May Be Important |
| :--- | :--- | :--- |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Mock AI Recommendations"` | Line 4107. Renders in the obsolete "AI Tips" fallback layout. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Save Difficult Sentence to notebook"` | Line 4033. Legacy text box rendering in the general section fallback. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Study Reference"` | Line 3994. Reference tab rendering in the general section fallback. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"AI Tips"` | Lines 112, 2164, 2170, 4079, 4102, 4117. Fallback tabs and references. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Write Mode"` | Lines 117, 4080, 4137, 4141, 4534. Obsolete tabs and completion warnings. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Speak Mode"` | Lines 124, 4081, 4288, 4295. Obsolete tabs and completion warnings. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Vocabulary Coach"` | Lines 220, 1093, 3001, 3005. Vocabulary section tutor dialog title. |
| `frontend/src/components/lesson/SectionDetailView.tsx` | `"Section Progress"` | Lines 146, 1784. Completion checklist hooks. |
| `frontend/src/components/lesson/SectionPracticeTools.tsx` | `"AI Tips"` | Lines 65, 184. Obsolete tabs inside practice utility. |
| `frontend/src/components/lesson/SectionPracticeTools.tsx` | `"Write Mode"` | Lines 42, 194, 256. Obsolete tabs inside practice utility. |
| `frontend/src/components/lesson/SectionPracticeTools.tsx` | `"Speak Mode"` | Lines 47, 204, 246, 363. Obsolete tabs inside practice utility. |
| `frontend/src/components/lesson/MockAICoachPanel.tsx` | `"Write Mode"` | Lines 40, 60, 68. Coach panel recommendations for old tabs. |
| `frontend/src/components/lesson/MockAICoachPanel.tsx` | `"Grammar & Preposition Coach"`| Line 36. Header title for the general mock AI coach. |
| `frontend/src/components/lesson/MockAICoachPanel.tsx` | `"Vocabulary Coach"` | Line 26. Header title for the vocabulary coach. |
| `frontend/src/components/lesson/NextStepCard.tsx` | `"Write Mode"` | Lines 52, 63. Recommends users to practice using Write Mode. |
| `frontend/src/components/lesson/NextStepCard.tsx` | `"Speak Mode"` | Lines 55, 63. Recommends users to practice using Speak Mode. |
| `frontend/src/pages/Dashboard.tsx` | `"Write Mode"` | Lines 233, 244. Recommends user actions in Write Mode. |
| `frontend/src/pages/Dashboard.tsx` | `"Speak Mode"` | Lines 233, 246. Recommends user actions in Speak Mode. |
| `frontend/src/services/lessonSectionPracticeService.ts`| `"Write Mode"` | Line 269. Formats recommendations using Write Mode. |
| `frontend/src/services/lessonSectionPracticeService.ts`| `"Speak Mode"` | Lines 255, 277. Formats recommendations using Speak Mode. |
| `frontend/src/services/revisionService.ts` | `"Section Progress"` | Line 40. Reads completion states from local storage. |
| `frontend/src/pages/DailyLessonDetail.tsx` | `"Section Progress"` | Line 52. Loads completion progress for daily lessons. |
| `frontend/src/components/lesson/SectionProgressCard.tsx` | `"Section Progress"` | Line 23. Title text for the checklist container. |
