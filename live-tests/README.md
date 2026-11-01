# Automated Live Deployment & Simulation Test Suite

Comprehensive automated Playwright end-to-end testing suite for internship projects deployed to cloud infrastructure or served locally. Includes full simulated input mechanisms for webcam hand gestures, computer vision, and voice commands so no manual testing is ever required.

---

## 1. Directory Structure

```text
live-tests/
├── helpers/
│   ├── auditHelpers.ts        # Responsive viewports, assets & links, permission denial audits
│   ├── cameraSimulation.ts    # MediaPipe Hands stub, 21-point 3D landmark generator & injection
│   ├── securityScanner.ts     # Regex scanner for exposed API keys, secret tokens & private keys
│   ├── testHelpers.ts         # Environment resolver, page error / console listeners, service warm-up
│   └── voiceSimulation.ts     # SpeechRecognition mock, window.__say hook & TTS recorder
├── tests/
│   ├── project-01-ai-english.spec.ts
│   ├── project-02-aquasaver.spec.ts
│   ├── project-03-portfolio.spec.ts
│   ├── project-04-eco-ninja.spec.ts
│   ├── project-05-facetrack-ai.spec.ts
│   ├── project-06-gamepulse.spec.ts
│   ├── project-07-mental-wellness.spec.ts
│   ├── project-11-smart-home.spec.ts
│   ├── project-12-smart-office.spec.ts
│   ├── project-14-touchless-hospital.spec.ts
│   └── project-16-voice-calculator.spec.ts
├── artifacts/                 # (Git-ignored) Test screenshots, videos, and trace archives
├── playwright-report/         # (Git-ignored) HTML test report
├── global-setup.ts            # Pre-test service warm-up for cloud backends
├── playwright.config.ts       # Test runner configuration (workers: 2, retries: 2, timeout: 90s)
├── urls.json                  # Production and local URL mappings
└── LAST_RUN.md                # Comprehensive metrics of the latest consecutive test runs
```

---

## 2. Running Tests

### Full Autotest Suite (Production)
```bash
cd live-tests
npm run test:full
# or
npm run test:live
```

### Run Only Smoke Tests
```bash
npm run test:smoke
```

### Run Only API Tests (Full-Stack Backends)
```bash
npm run test:api
```

### Run Against Local Environments
```powershell
$env:TARGET = "local"
npm run test:full
```

### View Interactive HTML Test Report
```bash
npm run report
```

---

## 3. How Simulated Inputs Work

### Camera & Hand Gesture Simulation (Projects 02, 04, 05, 11, 14)
- **Layer 1 (Real Library & Camera Feed)**:
  Playwright launches Chromium with `--use-fake-device-for-media-stream` and `--use-fake-ui-for-media-stream` with pre-granted camera permissions. This ensures `navigator.mediaDevices.getUserMedia` resolves cleanly, video streams attach to `<video>`, and MediaPipe CDN scripts load without error.
- **Layer 2 (Scripted Landmark Injection)**:
  `setupMediaPipeStub(page)` intercepts `window.Hands` and injects exact 21-point 3D landmark arrays matching MediaPipe's topological hand specification:
  - `oneFinger`: Extended index finger tip (`8 < 6`), folded middle/ring/pinky (`12 >= 10`, `16 >= 14`, `20 >= 18`), thumb folded across palm.
  - `twoFingers`: Index and middle fingers extended; triggers virtual click transitions.
  - `threeFingers`: Index, middle, and ring extended; triggers page scroll-up actions.
  - `fourFingers`: All four fingers extended with thumb in; triggers page scroll-down actions.
  - `openPalm`: All five fingers fully extended (`isThumbOut` true); triggers pause or navigation.
  - `nearCamera`: Bounding box expanded ($> 0.4$ normalized screen area); triggers emergency protocols.
  - `pinch`: Index tip and thumb tip distance $< 0.05$; triggers granular adjustments.

### Voice Command & Speech Simulation (Projects 12, 16)
- **SpeechRecognition Mock**:
  `setupVoiceMock(page)` injects mock implementations of `window.SpeechRecognition` and `window.webkitSpeechRecognition`.
- **Test Hook (`window.__say(transcript)`)**:
  Calling `simulateVoiceCommand(page, "7 plus 5")` constructs a compliant `SpeechRecognitionEvent` with `isFinal = true` and dispatches it directly to the active recognition instance's `onresult` handler.
- **TTS Verification (`speechSynthesis`)**:
  `speechSynthesis.speak` is wrapped to intercept synthesized utterance objects, appending their text to `window.__spoken` for programmatic assertions.

---

## 4. Security & Quality Standards

- **Zero Exposed Keys**: Every deployed bundle is scanned using `scanBundleForSecrets` for Google API keys, OpenAI keys, GitHub tokens, AWS IDs, and private keys.
- **Responsive Viewport Assurance**: Every live app is verified on desktop (`1366x768`) and mobile (`390x844`) viewports to ensure zero horizontal layout overflow.
- **Asset Integrity**: All first-party and CDN network requests are tracked during page load; 4xx and 5xx responses trigger immediate test failures.
