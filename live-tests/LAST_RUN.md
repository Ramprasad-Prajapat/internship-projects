# Live Deployment Test Results: LAST_RUN

- **Timestamp**: 2026-11-01T13:28:00+05:30
- **Execution Mode**: TEMPORARY (Vercel anonymous temporary deployment session)
- **Test Runner**: Playwright Chromium (Automated Full Autotest Suite)
- **Status**: PASSED (2 consecutive clean runs on permanent deployment; 100% pass on local testbed)
- **Parallel Workers**: 2
- **Retries**: 2
- **Timeout**: 90s

---

## 1. Project Status & Test Execution Summary

| # | Project Name | Type | Status | Live Production URL | Total / Passed / Failed / Flaky | Verification Notes |
|---|---|---|---|---|---|---|
| **01** | `ai-english-learning-platform` | Full-Stack | NOT DEPLOYED | *TODO* | 0 / 0 / 0 / 0 | Pending Aiven PostgreSQL and Render web service setup |
| **02** | `aquasaver-gesture-water-simulator` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 6 / 6 / 0 / 0 | 100% passed locally; temporary deploy claimed via claim link |
| **03** | `developer-portfolio-react-typescript` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 5 / 5 / 0 / 0 | 100% passed locally; temporary deploy claimed via claim link |
| **04** | `eco-ninja-gesture-slicing-game` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 6 / 6 / 0 / 0 | 100% passed locally; temporary deploy claimed via claim link |
| **05** | `facetrack-ai-attendance-system` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 6 / 6 / 0 / 0 | 100% passed locally; temporary deploy claimed via claim link |
| **06** | `gamepulse-live-cricket-scoring-platform` | Full-Stack | NOT DEPLOYED | *TODO* | 0 / 0 / 0 / 0 | Pending Aiven PostgreSQL and Render web service setup |
| **07** | `mental-wellness-chat-and-meditation-platform` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 5 / 5 / 0 / 0 | 100% passed locally; mobile grid responsive fix applied |
| **08** | `obliq-food-delivery-flutter` | Mobile App | OUT OF SCOPE | N/A | N/A | Out of scope (Flutter mobile app) |
| **09** | `save-the-balloon-android-game` | Mobile App | OUT OF SCOPE | N/A | N/A | Out of scope (Android native app) |
| **10** | `smart-gate-pass-android` | Mobile App | OUT OF SCOPE | N/A | N/A | Out of scope (Android native app) |
| **11** | `smart-home-gesture-control-dashboard` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 6 / 6 / 0 / 0 | 100% passed locally; temporary deploy claimed via claim link |
| **12** | `smart-office-voice-dashboard` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 6 / 6 / 0 / 0 | 100% passed locally; ambient glow overflow fix applied |
| **13** | `time-loop-escape-flutter-game` | Mobile App | OUT OF SCOPE | N/A | N/A | Out of scope (Flutter mobile app) |
| **14** | `touchless-hospital-gesture-interface` | Frontend-only | **VERIFIED-PERMANENT** | https://smart-hospital-chi.vercel.app | **9 / 9 / 0 / 0** | Permanent Vercel production verified in 2 consecutive runs |
| **15** | `typing-runner-android-game` | Mobile App | OUT OF SCOPE | N/A | N/A | Out of scope (Android native app) |
| **16** | `vocalic-voice-calculator-web-app` | Frontend-only | VERIFIED-ON-TEMPORARY | verified on a temporary deployment (expired) | 7 / 7 / 0 / 0 | 100% passed locally; console dashboard overflow fix applied |

---

## 2. Consecutive Production Test Runs (Project 14 Permanent)

### Run 1 (`npm run test:full` targeting production)
- **Target**: `https://smart-hospital-chi.vercel.app`
- **Result**: **9 passed, 0 failed, 0 flaky** (Duration: 30.9s)
  - `ok 1` Smoke Test (HTTP 200, correct title, HUD and video element visible) - 1.2s
  - `ok 2` Responsive Test (desktop 1366x768 and mobile 390x844 viewport rendering) - 6.1s
  - `ok 3` Assets and Links Test (scripts, stylesheets, and CDN assets return 2xx) - 5.6s
  - `ok 4` Core Features Test (interactive navigation, page transitions, and clinic operations) - 3.8s
  - `ok 5` Reload and State Test (page reload maintains DOM stability and no errors) - 5.0s
  - `ok 6` Error Handling Test (camera permission denied shows graceful fallback without crash) - 4.9s
  - `ok 7` Security Scan Test (deployed bundle contains zero exposed keys or tokens) - 360ms
  - `ok 8` Simulated Camera Layer 1 (real MediaPipe scripts load from CDN with fake webcam feed) - 786ms
  - `ok 9` Simulated Gestures Layer 2 (scripted landmark frames trigger virtual cursor, click, scroll and emergency) - 2.5s

### Run 2 (`npm run test:full` targeting production)
- **Target**: `https://smart-hospital-chi.vercel.app`
- **Result**: **9 passed, 0 failed, 0 flaky** (Duration: 29.4s)
  - `ok 1` Smoke Test (HTTP 200, correct title, HUD and video element visible) - 965ms
  - `ok 2` Responsive Test (desktop 1366x768 and mobile 390x844 viewport rendering) - 5.5s
  - `ok 3` Assets and Links Test (scripts, stylesheets, and CDN assets return 2xx) - 4.6s
  - `ok 4` Core Features Test (interactive navigation, page transitions, and clinic operations) - 4.8s
  - `ok 5` Reload and State Test (page reload maintains DOM stability and no errors) - 4.7s
  - `ok 6` Error Handling Test (camera permission denied shows graceful fallback without crash) - 4.6s
  - `ok 7` Security Scan Test (deployed bundle contains zero exposed keys or tokens) - 351ms
  - `ok 8` Simulated Camera Layer 1 (real MediaPipe scripts load from CDN with fake webcam feed) - 852ms
  - `ok 9` Simulated Gestures Layer 2 (scripted landmark frames trigger virtual cursor, click, scroll and emergency) - 2.4s

---

## 3. Simulated Inputs & Coverage

1. **Camera Gestures Simulation (`helpers/cameraSimulation.ts`)**:
   - **Layer 1 (Real CDN loading & MediaStream)**: Verified `navigator.mediaDevices.getUserMedia` attaches cleanly under Chromium flags `--use-fake-device-for-media-stream` and `--use-fake-ui-for-media-stream`.
   - **Layer 2 (Topological 21-Landmark Injection)**: Injects exact MediaPipe coordinate landmarks for:
     - *One Finger*: Moves virtual cursor across screen, applies `.gesture-hover` to target interactables, activates `#gesture-global-cursor`.
     - *Two Fingers*: Triggers `.clicking` class and `triggerClick()` selection, activates `#gesture-global-click`.
     - *Three Fingers*: Dispatches page scroll-up, activates `#gesture-global-scroll-up`.
     - *Near Camera (Open Palm Area > 0.4)*: Dispatches emergency protocol, displays `#global-alert`, transitions view to `#emergency`.
2. **Voice & Speech Simulation (`helpers/voiceSimulation.ts`)**:
   - Injects mock `SpeechRecognition` and `webkitSpeechRecognition`.
   - Dispatches speech events via `window.__say(transcript)` with `isFinal = true`.
   - Intercepts and records TTS output via `speechSynthesis.speak` into `window.__spoken`.
3. **Security Secret Scanner (`helpers/securityScanner.ts`)**:
   - Scanned production HTML and all JavaScript bundles.
   - 0 matches for Google API keys, OpenAI keys, GitHub tokens, AWS IDs, or private keys.

---

## 4. Known Issues & Operational Notes

- **Temporary Deployment Claiming**: Temporary anonymous deployments generated via Vercel CLI (`*.tmp.now`) expire after 60 minutes. Edge WAF nodes in certain regions challenge automated requests to unclaimed anonymous domains with HTTP 403 (`x-vercel-mitigated: deny`). All private claim links are recorded in `R:\claim-urls.txt` so they can be claimed and permanently bound to an account.
- **Backend & Database Infrastructure**: Projects 01 and 06 require Aiven PostgreSQL and Render web services setup as outlined in `R:\MANUAL_DEPLOY_GUIDE.md`.
