# Live Deployment Test Results: LAST_RUN

- **Timestamp**: 2026-10-30T16:48:00+05:30
- **Test Runner**: Playwright Chromium (Automated End-to-End Suite)
- **Target**: Production (`urls.json`)
- **Status**: PASSED (2 consecutive clean runs)

---

## 1. Project Status Summary

| # | Project Name | Type | Status | Live Web URL | Live API URL | Test Result |
|---|---|---|---|---|---|---|
| **01** | `ai-english-learning-platform` | Full-Stack | Skipped (Pending deployment) | *TODO* | *TODO* | Skipped per user instructions |
| **02** | `aquasaver-gesture-water-simulator` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **03** | `developer-portfolio-react-typescript` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **04** | `eco-ninja-gesture-slicing-game` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **05** | `facetrack-ai-attendance-system` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **06** | `gamepulse-live-cricket-scoring-platform` | Full-Stack | Skipped (Pending deployment) | *TODO* | *TODO* | Skipped per user instructions |
| **07** | `mental-wellness-chat-and-meditation-platform` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **08** | `obliq-food-delivery-flutter` | Mobile App | Skipped (Out of scope) | N/A | N/A | Out of scope (Flutter mobile app) |
| **09** | `save-the-balloon-android-game` | Mobile App | Skipped (Out of scope) | N/A | N/A | Out of scope (Android native app) |
| **10** | `smart-gate-pass-android` | Mobile App | Skipped (Out of scope) | N/A | N/A | Out of scope (Android native app) |
| **11** | `smart-home-gesture-control-dashboard` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **12** | `smart-office-voice-dashboard` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |
| **13** | `time-loop-escape-flutter-game` | Mobile App | Skipped (Out of scope) | N/A | N/A | Out of scope (Flutter mobile app) |
| **14** | `touchless-hospital-gesture-interface` | Frontend-only | **Live & Verified** | [smart-hospital-chi.vercel.app](https://smart-hospital-chi.vercel.app) | N/A | **2 / 2 PASSED (Both Runs)** |
| **15** | `typing-runner-android-game` | Mobile App | Skipped (Out of scope) | N/A | N/A | Out of scope (Android native app) |
| **16** | `vocalic-voice-calculator-web-app` | Frontend-only | Pending Real URL | *TODO (`<asli URL>`)* | N/A | Skipped (placeholder `<asli URL>` provided) |

---

## 2. Consecutive Production Test Runs

### Run 1 (`npm run test:live`)
- **Total Specs**: 24 tests across 11 files
- **Results**: 2 passed, 22 skipped, 0 failed (17.2s)
  - `ok 21` [chromium] `project-14-touchless-hospital.spec.ts`: Smoke Test (200 OK, HUD directory, video feed) - 4.5s
  - `ok 22` [chromium] `project-14-touchless-hospital.spec.ts`: Interaction Test (HUD elements, section inspect) - 6.8s

### Run 2 (`npm run test:live`)
- **Total Specs**: 24 tests across 11 files
- **Results**: 2 passed, 22 skipped, 0 failed (11.9s)
  - `ok 21` [chromium] `project-14-touchless-hospital.spec.ts`: Smoke Test (200 OK, HUD directory, video feed) - 1.0s
  - `ok 22` [chromium] `project-14-touchless-hospital.spec.ts`: Interaction Test (HUD elements, section inspect) - 6.3s

---

## 3. Security & Bundle Scan

- Scanned production JavaScript and HTML bundles deployed at `https://smart-hospital-chi.vercel.app`.
- **Patterns Checked**: `AIza[0-9A-Za-z-_]{35}`, `sk-[a-zA-Z0-9]{20,}`, `ghp_[a-zA-Z0-9]{20,}`, `AKIA[0-9A-Z]{16}`, RSA/EC private keys, bearer/session tokens.
- **Result**: **0 hard-coded or exposed API keys / tokens detected**.

---

## 4. Known Issues / Pending Deployments

- **Projects 02, 03, 04, 05, 07, 11, 12, 16**: The placeholder `<asli URL>` was submitted instead of actual URLs (e.g. `https://<project-name>.vercel.app`). Per instructions ("Replace the placeholder 'pending' README text with the real verified URL only for projects that pass"), their README entries remain `Deployment pending`. Once deployed and provided with real HTTP(S) links, their live tests will run.
- **Projects 01, 06**: Full-stack backend/database deployments are pending.
