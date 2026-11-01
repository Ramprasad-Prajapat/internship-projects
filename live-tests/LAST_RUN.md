# Live Deployment Test Results: LAST_RUN

- **Timestamp**: 2026-11-01T12:49:00+05:30
- **Test Runner**: Playwright Chromium (Automated Full Autotest Suite)
- **Target**: Production (`urls.json`)
- **Status**: PASSED (2 consecutive clean runs)
- **Parallel Workers**: 2
- **Retries**: 2
- **Timeout**: 90s

---

## 1. Project Status & Test Execution Summary

| # | Project Name | Type | Status | Live Web URL | Live API URL | Total / Passed / Failed / Flaky | Simulated Items |
|---|---|---|---|---|---|---|---|
| **01** | `ai-english-learning-platform` | Full-Stack | NOT DEPLOYED | *TODO* | *TODO* | 0 / 0 / 0 / 0 | N/A (Pending deployment) |
| **02** | `aquasaver-gesture-water-simulator` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | MediaPipe hand gestures stubbed |
| **03** | `developer-portfolio-react-typescript` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | Responsive & security audits ready |
| **04** | `eco-ninja-gesture-slicing-game` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | MediaPipe slicing coordinates stubbed |
| **05** | `facetrack-ai-attendance-system` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | Camera diagnostics & mock face scan |
| **06** | `gamepulse-live-cricket-scoring-platform` | Full-Stack | NOT DEPLOYED | *TODO* | *TODO* | 0 / 0 / 0 / 0 | N/A (Pending deployment) |
| **07** | `mental-wellness-chat-and-meditation-platform` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | Responsive & security audits ready |
| **08** | `obliq-food-delivery-flutter` | Mobile App | OUT OF SCOPE | N/A | N/A | N/A | Out of scope (Flutter mobile app) |
| **09** | `save-the-balloon-android-game` | Mobile App | OUT OF SCOPE | N/A | N/A | N/A | Out of scope (Android native app) |
| **10** | `smart-gate-pass-android` | Mobile App | OUT OF SCOPE | N/A | N/A | N/A | Out of scope (Android native app) |
| **11** | `smart-home-gesture-control-dashboard` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | MediaPipe gesture controls stubbed |
| **12** | `smart-office-voice-dashboard` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | SpeechRecognition & TTS synthesis mock |
| **13** | `time-loop-escape-flutter-game` | Mobile App | OUT OF SCOPE | N/A | N/A | N/A | Out of scope (Flutter mobile app) |
| **14** | `touchless-hospital-gesture-interface` | Frontend-only | **VERIFIED** | [smart-hospital-chi.vercel.app](https://smart-hospital-chi.vercel.app) | N/A | **9 / 9 / 0 / 0** | MediaPipe fake stream + 21-pt gestures |
| **15** | `typing-runner-android-game` | Mobile App | OUT OF SCOPE | N/A | N/A | N/A | Out of scope (Android native app) |
| **16** | `vocalic-voice-calculator-web-app` | Frontend-only | NOT DEPLOYED | *TODO* | N/A | 0 / 0 / 0 / 0 | SpeechRecognition math parser & TTS |

---

## 2. Consecutive Production Test Runs

### Run 1 (`npm run test:full`)
- **Total Specs**: 62 tests across 11 files (2 parallel workers)
- **Outcome**: **9 passed, 53 skipped, 0 failed, 0 flaky** (Duration: 31.7s)
  - `ok 43` [chromium] `project-14-touchless-hospital.spec.ts`: 1. Smoke Test (HTTP 200, title, HUD & video attached) - 968ms
  - `ok 50` [chromium] `project-14-touchless-hospital.spec.ts`: 2. Responsive Test (desktop 1366x768 & mobile 390x844) - 5.5s
  - `ok 56` [chromium] `project-14-touchless-hospital.spec.ts`: 3. Assets and Links Test (scripts, styles, MediaPipe CDN 2xx) - 4.7s
  - `ok 57` [chromium] `project-14-touchless-hospital.spec.ts`: 4. Core Features Test (hospital navigation, detection matrix, vision toggle) - 3.7s
  - `ok 58` [chromium] `project-14-touchless-hospital.spec.ts`: 5. Reload and State Test (page reload preserves DOM integrity) - 4.3s
  - `ok 59` [chromium] `project-14-touchless-hospital.spec.ts`: 6. Error Handling Test (camera permission denied shows graceful fallback) - 4.8s
  - `ok 60` [chromium] `project-14-touchless-hospital.spec.ts`: 7. Security Scan Test (deployed bundle contains 0 exposed keys) - 386ms
  - `ok 61` [chromium] `project-14-touchless-hospital.spec.ts`: 8. Simulated Camera Layer 1 (real CDN scripts with fake video feed) - 843ms
  - `ok 62` [chromium] `project-14-touchless-hospital.spec.ts`: 9. Simulated Gestures Layer 2 (1-finger cursor, 2-finger click, 3-finger scroll, near-camera emergency) - 2.3s

### Run 2 (`npm run test:full`)
- **Total Specs**: 62 tests across 11 files (2 parallel workers)
- **Outcome**: **9 passed, 53 skipped, 0 failed, 0 flaky** (Duration: 33.8s)
  - `ok 44` [chromium] `project-14-touchless-hospital.spec.ts`: 1. Smoke Test (HTTP 200, title, HUD & video attached) - 881ms
  - `ok 50` [chromium] `project-14-touchless-hospital.spec.ts`: 2. Responsive Test (desktop 1366x768 & mobile 390x844) - 6.6s
  - `ok 56` [chromium] `project-14-touchless-hospital.spec.ts`: 3. Assets and Links Test (scripts, styles, MediaPipe CDN 2xx) - 4.8s
  - `ok 57` [chromium] `project-14-touchless-hospital.spec.ts`: 4. Core Features Test (hospital navigation, detection matrix, vision toggle) - 4.4s
  - `ok 58` [chromium] `project-14-touchless-hospital.spec.ts`: 5. Reload and State Test (page reload preserves DOM integrity) - 5.0s
  - `ok 59` [chromium] `project-14-touchless-hospital.spec.ts`: 6. Error Handling Test (camera permission denied shows graceful fallback) - 4.4s
  - `ok 60` [chromium] `project-14-touchless-hospital.spec.ts`: 7. Security Scan Test (deployed bundle contains 0 exposed keys) - 337ms
  - `ok 61` [chromium] `project-14-touchless-hospital.spec.ts`: 8. Simulated Camera Layer 1 (real CDN scripts with fake video feed) - 847ms
  - `ok 62` [chromium] `project-14-touchless-hospital.spec.ts`: 9. Simulated Gestures Layer 2 (1-finger cursor, 2-finger click, 3-finger scroll, near-camera emergency) - 2.4s

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

## 4. Known Issues / Pending Deployments

- **Projects 02, 03, 04, 05, 07, 11, 12, 16**: Not deployed to Vercel yet (URL candidate checks returned 404). Their test specs are fully upgraded with simulated camera/voice helpers and responsive checks, and will run automatically once deployed.
- **Projects 01, 06**: Full-stack backend/database deployments are pending.
