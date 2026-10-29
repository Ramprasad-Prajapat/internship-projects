# rule.md — AI Assistant Rules

Read this file before doing any work in this project.

Project:
AI English Learning Website for a beginner English learner. The goal is daily English practice, simple learning, mistake tracking, and motivation.

---

## 1. Current Project Direction

* Frontend is active.
* Backend, MySQL, real AI API, browser extension, and deployment are paused until the user approves.
* Use mock data and localStorage for frontend work.
* Do not start backend, MySQL, browser extension, Admin CMS, or deployment unless the user clearly asks.

---

## 2. Main Rules

* Keep the app simple, beginner-friendly, and free-first.
* Do not rebuild from zero.
* Do not delete existing working features.
* Do not create duplicate pages, components, services, or types.
* Before creating a new file, check if an equivalent file already exists.
* Use only files related to the current task.
* Do not deep-read the whole project every time.
* Read PROJECT_WORK_PLAN.md only for current status and next work.
* Read COMPLETE_AI_ENGLISH_LEARNING_PROJECT.md only when deeper spec details are needed.

---

## 3. Frontend Rules

* Use React + Vite + TypeScript + Tailwind.
* Keep pages backend-ready through service files.
* Pages should not directly use localStorage.
* Correct mock flow:
  Page → service → mockDatabase/localStorage
* Future backend flow:
  Page → service → axiosClient → Spring Boot API → MySQL
* Use existing components and design patterns where possible.
* Keep UI responsive for mobile, tablet, and laptop.
* Keep loading, empty, and error states safe.

---

## 4. Backend Rules

Backend is paused for now.

When backend is approved later:

* Use Java Spring Boot + MySQL.
* Keep secrets in environment variables.
* Never put API keys, DB passwords, or JWT secrets in frontend code.
* Use DTOs, validation, JWT auth, BCrypt passwords, and user-based data filtering.

---

## 5. AI / Voice Rules

* Do not add real AI API keys in frontend.
* If AI is used later, use fallback:
  Gemini → LanguageTool → rule-based → save raw text
* Feedback must be beginner-friendly.
* Voice features must have typing fallback.

---

## 6. Git Rules

* Do not commit unless user says: commit karo.
* Do not push unless user clearly asks.
* Do not create remote.
* Do not reset, stash, or delete files unless user approves.
* Always show git status when starting or finishing a coding task.

---

## 7. Build and Run Rules

After completing frontend changes, run only the required commands automatically:
1. cd frontend
2. npm run build
3. npm run dev only after successful build

If the frontend dev server is already running, do not start a duplicate server. Report the existing local URL if visible.

After starting, show:
* Local URL
* Network URL if available
* Git status

---

## 8. Website Testing Rule

Do not perform automatic website testing.
Do not open the browser for testing.
Do not run Playwright, Cypress, Selenium, browser automation, or any UI test automation unless the user explicitly asks.

The user will manually test the website in the browser.

---

## 9. Efficiency Rule

Use minimum tokens.

For every task:

* Read rule.md first.
* Read PROJECT_WORK_PLAN.md only for current status.
* Read only directly related files.
* Make only the requested change.
* Avoid repeated analysis.
* Avoid unnecessary summaries.
* Do not create duplicate files.
* Preserve existing work.

---

## 10. Final Response Format

After completing a task, reply with:

1. What changed
2. Files created
3. Files updated
4. Build status
5. Dev server status
6. Local URL
7. Git status
8. Website testing status: Not performed automatically
9. No commit, no push

Final line:
Frontend dev server is running. Please test manually in your browser.
