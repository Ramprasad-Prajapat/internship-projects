# FULL AUTOTEST TASK (NO MANUAL TESTING)

Goal: Test ALL my deployed web projects completely and automatically, so I never have to test a website by hand. Camera, hand-gesture, face and voice features must ALSO be tested automatically, with simulated input. Work fully autonomously: do NOT ask me any questions.

## RULES

- CREDENTIALS: Do not use or look for any credential. Do not use the Vercel, Render or Aiven CLIs or APIs. Do not read PowerShell or PSReadLine history, environment variables, the registry, auth files or config files. Never print, log or commit secrets.
- Do not change file permissions, ownership or ACLs.
- Never weaken, delete or skip a test just to make it pass. A real bug is a failing test until it is fixed.
- Never force push. Never commit secrets.
- Mobile apps (08, 09, 10, 13, 15) are out of scope. Never stop because of them.
- If one project fails after 2 fix attempts, mark it as a known issue and CONTINUE with the other projects. Never stop the whole run for one project.
- Do not write "needs manual check" in any report. If something is simulated, write "simulated input" and say what was simulated. If something truly cannot be automated, write "not automatable" with the technical reason.

## 1. CONTEXT AND LIVE URLS

- Repo: `R:\internship-projects` (branch main). The Playwright suite already exists in `live-tests/` (24 tests, 11 specs, `urls.json`, `LAST_RUN.md`). EXTEND and UPGRADE it, do not start from scratch.
- Web projects to test: 02, 03, 04, 05, 07, 11, 12, 14, 16 (frontend-only) and, if deployed, 01 and 06 (full-stack: Vercel frontend + Render API + MySQL).
- Find the real live URL of every project in this order:
  1. `R:\live-urls.txt` if it exists. Lines look like `project-02 web: https://...` or `project-01 api: https://...`. Ignore any line that contains a placeholder ("<", ">", "...", "asli", "PASTE").
  2. Auto-discovery: try `https://<project-folder-name>.vercel.app` for frontends (project-14 is `https://smart-hospital-chi.vercel.app`), and `https://<project-folder-name>-api.onrender.com` for the 01 and 06 APIs. Accept a candidate ONLY if it answers with HTTP 200 and its page title or main heading matches the project's own source (index.html title or app heading). Never accept someone else's site.
  3. The current `live-tests/urls.json`.
- A project whose URL cannot be found is "not deployed yet": do NOT fake a URL, mark it as not deployed, leave its README entry unchanged, and continue.
- Write the found URLs into `live-tests/urls.json` (they are public, not secret).
- First check that each URL is reachable. Render free services sleep when idle, so warm them up by polling the health endpoint for up to 120 seconds.

## 2. TEST STANDARD: every live web project must have all of these

Read each project's real code first, so the tests check its real features.

1. SMOKE: HTTP 200, correct title or main heading, no uncaught page errors, no console errors, no failed network requests (allow-list third-party analytics only).
2. RESPONSIVE: open on a desktop viewport (1366x768) and a phone viewport (390x844). No horizontal page overflow, main content visible, no console errors. Save one screenshot of each.
3. ASSETS AND LINKS: every same-origin link, image, script and stylesheet answers with 2xx. Every required CDN asset (for example MediaPipe scripts and models, Chart.js, fonts) loads with 2xx.
4. CORE FEATURES: at least 3 real user actions per project that change the UI or state (click, type, navigate, toggle, submit). Assert the visible RESULT (text, value, state, route), not only that an element exists. Cover every main feature listed in the project's README.
5. RELOAD/ROUTING: for apps with routes, open an inner route directly and after a reload; it must not 404. If the app keeps state, check it after reload.
6. ERROR HANDLING: deny the camera or microphone permission (for apps that use them) and assert the app shows a clear message and does not crash. Enter invalid input where the app has inputs and assert it is handled.
7. SECURITY SCAN: fetch the deployed HTML and JavaScript bundles and check for exposed secrets (patterns such as AIza..., sk-..., ghp_..., AKIA..., private keys, "api_key"/"secret" assignments with real-looking values). Report file names only, never the values. Any hit fails the project.
8. PERFORMANCE SANITY (warning, not a failure): first load should finish within 10 seconds on a warm service.

Full-stack projects (01, 06) additionally:
- API: health, register, login, token use, and CRUD on the main entities.
- DATABASE: create data through the API, read it back after a second request, and make sure it is really stored.
- CORS: a request with the Vercel origin succeeds; a request with a foreign origin is not allowed.
- UI end-to-end on the LIVE frontend against the LIVE backend (01: sign up, log in, use one core learning feature; 06: create a match, add scores, see the update on screen).
- 06: WebSocket test that receives a live score update in the browser.
- Test data uses unique names like `autotest-<timestamp>` and is deleted afterwards through the API. If there is no delete API, report it as a problem. Never leave test rows behind.

## 3. SIMULATION HELPERS (so camera and voice need no manual test)

Create these helpers in `live-tests/helpers/` and use them in the specs.

CAMERA (apps 02, 04, 05, 11, 14 and any other app that uses the webcam):
- Launch Chromium with `--use-fake-ui-for-media-stream` and `--use-fake-device-for-media-stream` and grant the camera permission, so getUserMedia works with a fake video feed.
- LAYER 1, real library: let the real MediaPipe scripts load from the CDN with the fake camera. Assert the library object exists, the models/wasm files load with 2xx, the video element is playing, and the app reports no errors.
- LAYER 2, gesture logic: before the app loads, replace the MediaPipe Hands (or FaceMesh/Face detection) class with a stub. Do it with `page.route` (serve a stub script instead of the CDN script) or `page.addInitScript`. The stub calls the app's own `onResults` callback with scripted landmark frames, for example: index fingertip at a chosen x,y; moving across the screen; pinch; open palm; fist; face present; no hand. Read each app's code to learn what results shape it expects. Then assert the app's reaction: virtual cursor moves, hover-click fires, the right button or card is activated, a game object is sliced and the score increases, an appliance toggles, attendance is marked, and so on.
- For each camera app write at least 3 gesture or face scenarios with asserted outcomes.

VOICE (apps 12, 16 and any other app that uses speech):
- Before the app loads, inject with `page.addInitScript` a fake `window.SpeechRecognition` and `window.webkitSpeechRecognition` class (start, stop, abort, continuous, interimResults, lang, onresult, onend, onerror, onstart) and a test hook such as `window.__say("seven plus five")` that fires `onresult` with the correct event shape (results[0][0].transcript, isFinal) and then `onend`.
- Wrap `speechSynthesis.speak` to record every utterance text in `window.__spoken`, so spoken answers can be asserted.
- Voice scenarios with asserted results (for example "seven plus five" -> display shows 12 and the spoken text contains 12; dashboard voice commands -> the matching panel or room action happens). Also test unknown commands and a recognition error event.
- Keep the button/keyboard path tests as well.

## 4. WORK ORDER

1. Read `live-tests/` (config, helpers, specs, urls.json, LAST_RUN.md), the root README and each project's README.
2. Discover the URLs (section 1) and check reachability.
3. Upgrade the suite: add the helpers and extend every spec to meet sections 2 and 3. Use `workers: 2` so the free hosting is not overloaded. Retries 2, test timeout 90 seconds. Keep `TARGET=local` support.
4. Validate the NEW specs locally first (`TARGET=local` against a local static server or `vite preview` per project) and fix wrong selectors until they pass. This is only to debug the tests; the real verdict is the live run.
5. Run the full suite against the LIVE URLs with HTML, JSON and list reporters. Keep screenshots, and traces/videos for failures, in `live-tests/artifacts/` (git-ignored).
6. Fix and repeat (section 5).
7. Finish with TWO consecutive full live runs where every test of every deployed project passes. A test that only passes after a retry is reported as "flaky" with the count and must be made stable.
8. Reports and docs (section 6).

## 5. WHEN A TEST FAILS

- First decide: is it a wrong test or a real app/deployment bug?
- Wrong test: fix the test (never loosen it so it checks less).
- Real bug in the code: fix it in the repo, run it locally to confirm, commit as `fix(<project>): ...` and push. IMPORTANT: my Vercel projects are deployed with the CLI, so a push does NOT redeploy them, and you cannot deploy. After the fix, write the file `R:\redeploy.ps1` with exact PowerShell commands (link and `vercel deploy --prod --yes --scope ramprasad-prajapats-projects`, per affected project folder), tell me in simple Hinglish to run it, and continue testing the other projects meanwhile. When I run the same prompt again, the affected projects are re-tested automatically.
- Problem that needs a dashboard setting (for example a wrong environment variable or CORS value on Render): tell me the exact change in simple Hinglish and continue with the other projects.
- At most 2 fix attempts per issue. After that mark it as a known issue with the reason and continue.

## 6. REPORTS, README AND GIT

- Generate `live-tests/LAST_RUN.md`: date and time, per-project table (tests total, passed, failed, flaky, simulated items), live links, known issues.
- README: for projects that PASS, put the real verified URL as "Live Demo" in the root README table and in the project README. Projects that are not deployed or failed keep "Deployment pending" or the honest reason. No placeholder text and no broken links anywhere.
- Add `"test:full": "playwright test"` to `live-tests/package.json` if it is missing, and update `live-tests/README.md` with how to run the suite and how simulated camera and voice input work.
- Commit in clean steps (for example `test: full autotest suite with simulated camera and voice`, `docs: update live demo links and test report`) and push to origin main. Make sure `live-tests/artifacts/`, `.vercel/` and `node_modules/` are git-ignored. At the end `git status` must be clean and in sync with origin/main.

## 7. FINAL REPORT

- Table: project, type, live web URL, API URL (if any), tests total / passed / failed / flaky, status (VERIFIED / FAILED with the reason / NOT DEPLOYED).
- What was simulated (camera landmarks, speech input) and what that covers.
- Known issues, with the fix applied or the exact next action for me.
- The two consecutive run results.
- Last line: a reminder that I should run `npx vercel logout` after all deployments are finished.
