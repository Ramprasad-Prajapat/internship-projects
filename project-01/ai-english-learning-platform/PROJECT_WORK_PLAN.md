# PROJECT_WORK_PLAN

## 1. Project Overview

* Project name: Ai-English-Learning frontend
* Stack: React + Vite + TypeScript + Tailwind CSS
* Current mode: Frontend mock / localStorage based
* Backend/API/OpenAI integration: paused/not active

## 2. Current Working Rules

* No full rebuild for small section changes
* No direct localStorage in components
* Use flow: Component → service → mockDatabase → localStorage
* Do not put all logic into `SectionDetailView.tsx`
* Use existing services/components/styles
* Create new file only if no suitable related file exists
* Do not change unrelated sections/routes/layouts

## 3. Current Run Flow

* Go to frontend folder:
  `cd frontend`
* Install dependencies only if missing:
  `npm install`
* Start dev server:
  `npm run dev`
* Build test:
  `npm run build`
* Do not start duplicate dev server if already running
* Run build once after completing changes, not after every small edit

## 4. Current Section Update Pattern
For each section update:

* Read `rule.md` and `PROJECT_WORK_PLAN.md` for context
* Open only related section files
* Update only that section
* Keep UI clean and simple
* Add Mock AI only if section needs it
* Notes only inside Notebook Notes tab
* Mistakes only inside Mistakes tab
* Progress through existing progress service
* No fake real AI/score/accuracy claims

## 5. Recently Polished / Planned Sections
Current section polish status:

| Section name | Main flow | Mock AI usage | Status |
| :--- | :--- | :--- | :--- |
| Common Mistakes | Read Mistake → Try/Compare | Mock correction / feedback | Polished |
| Homework | Read task → Write answer → Submit | Mock grammar feedback | Polished |
| Self Check | Checklist → Check Learning → Save Note | Mock AI Coach revision tips | Polished |
| Day 3 Preview | Read Preview → Listen → Prepare | Mock AI Preparation Tips | Polished |
