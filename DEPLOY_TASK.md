# FINAL DEPLOYMENT + AUTOTEST TASK

Goal: Make ALL deployable projects of my repo live, and prove with automated tests that they really work. Use Vercel (frontends), Render (backends) and Aiven (MySQL database).

Work fully autonomously: do NOT ask me any questions and do not wait for confirmation. The task must be safe to re-run: always check what already exists first and update it in place instead of creating duplicates.

## CONTEXT

- Local repo: `R:\internship-projects` (clean, synced with https://github.com/Ramprasad-Prajapat/internship-projects, branch main). Layout: `project-NN/<project-name>/` (16 projects).
- `R:\_local-only-backup` holds my old .env files, keystores and nested .git folders. It is READ-ONLY: never delete or modify it, and never copy anything from it into the repo.
- Vercel: scope `ramprasad-prajapats-projects` (https://vercel.com/ramprasad-prajapats-projects). Credential: env var `VERCEL_TOKEN` (or an existing CLI login).
- Render: https://render.com. Credential: env var `RENDER_API_KEY`.
- Aiven: project `ramprasadprajapat709-500c` (console: https://console.aiven.io/account/a5c9a2562d42/project/ramprasadprajapat709-500c/services). Credential: env var `AIVEN_TOKEN`. Fallback if there is no token: env vars `AIVEN_MYSQL_HOST`, `AIVEN_MYSQL_PORT`, `AIVEN_MYSQL_USER`, `AIVEN_MYSQL_PASSWORD`.
- The credentials are Windows USER environment variables. Read them from the process environment only.
- A previous run added "Live Demo" links to the READMEs WITHOUT deploying anything. Treat those links as untrusted and rewrite them at the end with verified URLs.
- Never print, log or commit any token, password or API key. Use FREE plans only and never add a payment method. If something needs a paid plan, skip it and report.

## STEP 0: Pre-checks

Check ONLY the items below. If one fails, STOP immediately and tell me exactly what to fix.

- git status clean and in sync with origin/main.
- Node.js and npm are available.
- Vercel: `VERCEL_TOKEN` is set (or `npx vercel whoami` works) AND scope `ramprasad-prajapats-projects` is accessible (for example `npx vercel project ls --scope ramprasad-prajapats-projects`).
- `RENDER_API_KEY` works (list owners and services through the Render API).
- `AIVEN_TOKEN` works (list services of the Aiven project above).

Credential rules for this step:
- If a credential is missing or invalid, STOP and tell me what to set. Do NOT look for credentials anywhere else: do not read shell or PowerShell history, the registry, config files, auth.json files, Desktop, Documents or any other folder, and do not search the disk for tokens. Use only the variables and the CLI login named above.
- Do not change file permissions, ownership or ACLs of anything. If a git command fails because of permissions, report it and stop.

## STEP 1: Inventory and classification (read-only first)

- List the existing Vercel projects, Render services and Aiven services. Match existing ones to repo projects ONLY when the match is clear (same name ignoring case, "-" and "_", or already connected to this repo). project-14 belongs to the existing Vercel project `smart-hospital-chi` (smart-hospital-chi.vercel.app): update it in place and keep its name and domain.
- Read each project's code and classify it:
  - A) Frontend-only web apps -> Vercel: 02, 03, 04, 05, 07, 11, 12, 14, 16.
  - B) Full-stack with backend + database: 01 ai-english-learning-platform (React + Spring Boot + MySQL), 06 gamepulse-live-cricket-scoring-platform (React + Spring Boot + WebSocket + MySQL). Backend -> Render (Docker), database -> Aiven MySQL, frontend -> Vercel.
  - C) Flutter apps 08, 13: only if the `flutter` command is installed and `flutter build web` works. Otherwise skip. Do not download the Flutter SDK.
  - D) Android apps 09, 10, 15: cannot be hosted. If one depends on a backend inside this repo, deploy that backend. Otherwise skip and report.

## STEP 2: Database on Aiven

- Use the Aiven REST API (https://api.aiven.io/v1, header `Authorization: aivenv1 <AIVEN_TOKEN>`) for project `ramprasadprajapat709-500c`.
- If a MySQL service already exists, reuse it. Make sure it is RUNNING (if powered off, power it on). If none exists, create ONE MySQL service on the free plan (look up the exact free plan name from the API). Never touch any other Aiven service.
- Read host, port, user and password from the service connection info. SSL is required.
- Each full-stack project gets its OWN database on that server: `ai_english_learning` (01) and `gamepulse_live` (06).
- If connections from Render are blocked by the service IP filter, allow 0.0.0.0/0 on THIS service only and mention it in the report.

## STEP 3: Make the projects deploy-ready

Minimal changes only, no feature changes. Commit separately as `chore(deploy): ...` and push to main BEFORE deploying.

Backends (01, 06):
- Dockerfile (multi-stage build, then slim JRE; the Java version must match the project) and .dockerignore.
- Server port from the PORT env var (`server.port=${PORT:8080}`).
- Database settings from env vars (SPRING_DATASOURCE_URL / USERNAME / PASSWORD), SSL on, `createDatabaseIfNotExist=true`. Tables must be created automatically (ddl-auto=update or the project's own migrations). Keep local H2/MySQL development working by using a prod profile.
- CORS and WebSocket allowed origins from the env var `CORS_ALLOWED_ORIGINS`, no hard-coded localhost.
- Small-memory JVM settings (free instances are small): `JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=70 -XX:+UseSerialGC`.
- A health endpoint for the Render health check (actuator if present, otherwise an existing simple GET endpoint).

Frontends:
- API base URL (and the WebSocket URL for 06, using wss://) must come from VITE_* env vars instead of localhost. Update .env.example files with variable names only.

## STEP 4: Render (backends of 01 and 06)

- Create (or update in place) one free Web Service per backend through the Render API: runtime docker, plan free, repo https://github.com/Ramprasad-Prajapat/internship-projects, branch main, rootDir = the backend folder, correct dockerfile path, auto-deploy on, health check path set. Service name = project folder name + `-api`.
- Environment variables: the database variables from Aiven; `CORS_ALLOWED_ORIGINS` = the production Vercel URL(s) of the frontend (set it after step 5 and redeploy if needed); a NEW random JWT/secret value that you generate (never reuse local secrets); and any third-party API key the backend really needs, taken from the matching .env in `R:\_local-only-backup` (server-side only, never in the repo).
- If Render cannot access the repo through the API, report the exact manual step instead of guessing.

## STEP 5: Vercel (all frontends), scope ramprasad-prajapats-projects

- Projects (name = project folder name; Root Directory = `project-NN/<folder>`, or its frontend folder for 01 and 06): 02, 03, 04, 05, 07, 11, 12, 14 (existing smart-hospital-chi), 16, and the frontends of 01 and 06.
- Set Root Directory through the Vercel REST API (`PATCH /v9/projects/{id}`, field `rootDirectory`) using VERCEL_TOKEN or the CLI login. Connect the GitHub repo (branch main). Set the framework (static HTML = no build; Vite = `npm run build`, output `dist`). Set VITE_API_URL (and the WebSocket URL) to the Render URLs.
- When Root Directory is set, deploy from the REPO ROOT using the VERCEL_ORG_ID and VERCEL_PROJECT_ID env vars, not from inside the subfolder. Add a minimal vercel.json SPA rewrite only if client-side routing needs it.
- Use the REAL production URL that Vercel returns for each project. Never assume `<name>.vercel.app`, because the name may be taken and Vercel can add a suffix.
- Never put secrets into Vercel env vars (they become public in the browser bundle). If a frontend cannot work without a secret key, skip it and report.

## STEP 6: Flutter web (only 08 and 13, only if step 1 C allows it)

- Build with `flutter build web` and deploy build/web as a static Vercel project (name = folder name). Do not commit the build output. Say in the report that redeploy is manual.

## STEP 7: Build the automated test suite in the repo (folder `live-tests/` at the repo root)

Structure:
- `live-tests/package.json` (scripts: test:live, test:smoke, test:api, report)
- `playwright.config.ts`, `urls.json`, `global-setup.ts`, `helpers/`
- `tests/<project-folder>.spec.ts` (one spec per live project)
- `README.md`
- `.gitignore` (node_modules, playwright-report, test-results)

Rules:
- `urls.json` holds the web URL, API URL and type for every live project. Tests read ONLY from urls.json, nothing hard-coded.
- Tool: @playwright/test with Chromium. Launch args: `--use-fake-device-for-media-stream` and `--use-fake-ui-for-media-stream`. Grant camera and microphone permissions. Test timeout 90 s, expect timeout 15 s, retries 2. Reporters: list, html and json.
- global-setup warms up every Render service by polling its health endpoint until it answers (up to 120 seconds, because free services sleep when idle).

Every live project gets at least:
1. SMOKE test: HTTP 200, correct title or main heading, no uncaught page errors, no console errors, no failed network requests (allow-list third-party analytics only), and one screenshot.
2. INTERACTION tests: at least 2 real user actions that change the UI or state, checked by a visible result (not just "element exists"). Read the project's code to decide what its real features are.

Full-stack projects (01, 06) additionally:
- API tests: health, auth flow (register, login, token use) and CRUD on the main entities.
- DB persistence: create data through the API, read it back, and confirm it comes from the Aiven database.
- CORS: a request with the Vercel origin must succeed.
- UI end-to-end on the LIVE frontend against the LIVE backend (01: sign up / log in and one core learning feature; 06: create a match, add scores, see the live update).
- 06: WebSocket test that receives a live score update.

Camera apps (02, 04, 05, 11, 14 and similar): with the fake camera feed assert that tracking/verification starts without errors, the canvas or video is not blank, and the MediaPipe assets load with status 200.

Speech apps (12, 16 and similar): headless Chromium has no speech recognition, so test the buttons/manual input and that the page handles a missing SpeechRecognition without crashing. Real voice use is listed as "needs manual check".

Test data and reporting:
- Use unique names like `autotest-<timestamp>`. Clean up in afterAll through the API; if there is no delete API, remove the rows with SQL using env vars at runtime. Never leave test rows in the database. No secrets inside the tests.
- After the run, generate `live-tests/LAST_RUN.md`: date and time, a pass/fail table per project, and the live links.

## STEP 8: Run, fix, repeat

- Install dependencies and Chromium (`npm ci`, `npx playwright install chromium`), then run `npm run test:live` against the production URLs.
- Fix real problems you find in the deployment or app configuration, redeploy and re-run (at most 2 fix attempts per issue). Do NOT weaken or delete a test just to make it pass. If an issue cannot be fixed, mark it as a known issue with the reason in LAST_RUN.md, never skip it silently.
- Finish with TWO consecutive full runs that pass, to prove the suite is stable and the cleanup works.

## STEP 9: Docs (normal push, no force)

- Root README and each project README: put the real, verified Live Demo URL (and the API URL for 01 and 06). For backend projects add: "The backend runs on Render's free plan and may take about 1 minute to wake up on the first request."
- Projects that are not live: "Not deployed (mobile app)" or the real reason. No broken links anywhere.
- Add a "Live tests" section to the root README: `cd live-tests`, `npm ci`, `npx playwright install chromium`, `npm run test:live`.
- Commit `test: add live deployment test suite` and `docs: add verified live demo links`, push to origin main. Finally git status must be clean and in sync with origin/main.

## STRICT RULES

- Vercel, Render and Aiven: never delete, rename or modify any resource that does not belong to a project of this repo. No domain, team or other-project changes. No `vercel remove`.
- Never force push. Never commit secrets or tokens. Never change feature code, only the deployment-readiness changes from step 3 (and a minimal vercel.json if needed).
- Never search for credentials outside the variables named in this file. Never change permissions, ownership or ACLs.
- Do not ask questions. If something is unclear, take the safest option and mention it in the report.

## FINAL REPORT

- Table: project, type (frontend / backend / full-stack / mobile), status (live and tested / live, needs manual check / skipped with reason), Vercel project, Render service, live URL, API URL.
- Test results per project from the last two runs (what was tested, what passed, known issues).
- Aiven: service name, database names created, and any IP filter change.
- Everything I must do manually.
- Last line: remind me to remove the user environment variables VERCEL_TOKEN, RENDER_API_KEY, AIVEN_TOKEN and to revoke the three tokens in their dashboards. Do NOT remove them yourself.
