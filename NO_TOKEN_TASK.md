# NO-TOKEN DEPLOY + AUTOTEST TASK (2 PHASES)

I will NOT give you any Vercel, Render or Aiven token or API key. I will create the services myself in the dashboards, following a guide that YOU write. After that, you test the live URLs.

Work fully autonomously: do NOT ask me any questions.

## CONTEXT

- Local repo: `R:\internship-projects` (synced with https://github.com/Ramprasad-Prajapat/internship-projects, branch main). Layout: `project-NN/<project-name>/` (16 projects).
- Full details of the project classification (Step 1), the deploy-ready code changes (Step 3) and the test suite (Step 7, 8) are in `R:\DEPLOY_TASK.md`. Follow those sections exactly, EXCEPT every part that needs a Vercel, Render or Aiven credential or API call. If `R:\DEPLOY_TASK.md` does not exist, STOP and tell me.
- `R:\_local-only-backup` is READ-ONLY (never delete, modify, or copy from it into the repo).
- Accounts: Vercel scope `ramprasad-prajapats-projects`, Render (render.com), Aiven project `ramprasadprajapat709-500c` (console: https://console.aiven.io/account/a5c9a2562d42/project/ramprasadprajapat709-500c/services). Use free plans only.
- Existing Vercel project: `smart-hospital-chi` (smart-hospital-chi.vercel.app) belongs to project-14. It must be updated in place, not duplicated.
- CREDENTIAL RULES: Do not use, request or look for any token or password. Do not read environment variables for tokens, shell history, the registry, config files or other folders. Do not call the Vercel, Render or Aiven APIs. Never print, log or commit secrets. Do not change permissions, ownership or ACLs.

## PHASE 1 (run now)

1. Pre-checks: git status clean and in sync with origin/main; Node.js and npm available. Nothing else. If a check fails, stop and tell me what to fix.
2. Classify every project (A frontend-only, B full-stack 01 and 06, C Flutter 08 and 13, D Android 09, 10 and 15), exactly as in `R:\DEPLOY_TASK.md` Step 1. Android and Flutter are skipped.
3. Make the projects deploy-ready: do `R:\DEPLOY_TASK.md` Step 3 completely (Dockerfile, PORT, env-based database config, CORS from env, JVM settings, health endpoint, VITE_* API URLs, .env.example updates). Commit separately as `chore(deploy): ...` and push to main.
4. Build the test suite in `live-tests/` as in `R:\DEPLOY_TASK.md` Step 7. In `urls.json` use the value `TODO` for every URL for now. The suite must also support running against local servers through an environment variable (for example `TARGET=local` with a local URL map), so you can validate it before deployment.
5. Validate the suite BEFORE I deploy anything:
   - Frontend-only projects: serve each project locally (static server or `vite preview`) and run its specs against it. Everything must pass.
   - Full-stack projects (01, 06): run the backend locally with the H2/local profile if it starts reasonably fast and run the API and UI specs against it. If that is not feasible, at least make sure the specs compile (`npx tsc --noEmit`) and are listed (`npx playwright test --list`) and say so in the report.
   - Fix test bugs now. Do not weaken tests.
6. Commit `test: add live deployment test suite` and push to origin main.
7. Write the guide `R:\MANUAL_DEPLOY_GUIDE.md` (OUTSIDE the repo). Rules for the guide:
   - Language: simple Hinglish (Hindi written in English letters), short numbered steps, no long paragraphs.
   - It must contain NO secrets. For secret values use placeholders like `<Aiven host yahan paste karo>`.
   - Make it exact for THIS repo (names and values from the real code, not generic), with these parts:
     a) AIVEN: open the project, make sure one free MySQL service exists (create the free one if not), check that Allowed IP addresses is `0.0.0.0/0`, and where to find host, port, user, password. The two databases are created automatically by the backends (`ai_english_learning` and `gamepulse_live`). Tell me NOT to paste these values in any chat, only into the Render dashboard.
     b) RENDER, one section per backend (01 and 06): New -> Web Service -> the GitHub repo (connect GitHub so auto-deploy on push works) -> Branch `main` -> Root Directory (exact path) -> Runtime Docker (exact Dockerfile path) -> Instance type Free -> Health Check Path (exact) -> a TABLE of every environment variable: name, and the exact value or the placeholder (database variables, JWT/secret with a PowerShell one-liner that generates a random value locally, third-party API keys: list only the variable NAMES and which file in `R:\_local-only-backup` they come from, never print their values, `CORS_ALLOWED_ORIGINS` to be filled after Vercel). Then: copy the service URL.
     c) VERCEL, one row/section per frontend project: Add New -> Project -> import `internship-projects` -> Root Directory (exact path) -> Framework Preset (exact) -> Build/Output settings (exact, or "leave default") -> Environment Variables (name and value, using the Render URL placeholder) -> Deploy -> copy the production URL. For project-14: do NOT create a new project; open the existing `smart-hospital-chi` project -> Settings -> Git (connect this repo) and Build and Deployment -> Root Directory (exact path) -> redeploy.
     d) The final step: put the Vercel URLs into `CORS_ALLOWED_ORIGINS` of each Render service and redeploy it.
     e) A short copy-paste template for me to send you the URLs in Phase 2 (project -> web URL, API URL). URLs are not secret.
     f) The order of work (Aiven -> Render -> Vercel -> CORS) and a tip that Render free services sleep after 15 minutes without traffic, so the first open can take about a minute.
   - If you are not sure about a button name in a dashboard, write it generic and say "naam thoda alag ho sakta hai".
8. STOP after Phase 1. Final message: what you changed (list of commits), the validation results, the path of the guide, and exactly what I must do next.

## PHASE 2 (run only when I send you the live URLs)

1. Read my URLs. Check that each one is reachable. Warm up the Render services first (poll the health endpoint up to 120 seconds).
2. Fill `live-tests/urls.json` and run `npm run test:live` against the production URLs.
3. Fix problems you can fix in the repo (code or config), push, and wait for the auto-deploy. For a problem that needs a dashboard change (for example a wrong environment variable or the CORS value), tell me the exact change in simple Hinglish and wait for my message. Maximum 2 fix attempts per issue. Do NOT weaken or delete a test just to make it pass. Unfixable issues are marked as known issues with the reason in `live-tests/LAST_RUN.md`.
4. Finish with TWO consecutive full runs that pass. Clean up all test data (see `R:\DEPLOY_TASK.md` Step 7). Generate `live-tests/LAST_RUN.md`.
5. Docs: update the root README and each project README with the REAL verified live URLs, add the Render wake-up note for backend projects, "Not deployed (mobile app)" for the others, and the "Live tests" section. Commit `docs: add verified live demo links` and push. No broken links anywhere.
6. Final report: table (project, type, status: live and tested / live, needs manual check / skipped with reason, web URL, API URL), the test results of the last two runs, known issues, and what I must still do manually (for example real camera and voice checks).

## STRICT RULES

- Never force push. Never commit secrets or tokens. Never change feature code, only the deployment-readiness changes from Step 3.
- Do not ask questions. If something is unclear, take the safest option and mention it in the report.
