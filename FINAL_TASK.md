# FINAL TASK: DEPLOY, TEST, FIX, REPORT

This is the LAST task file of this repo. Run it completely in one go. It is safe to re-run at any time: it always checks what already exists, updates it in place, and re-tests. After the final report, do NOT suggest or write any new prompt or task.

Do NOT ask me any questions. Never stop because of a mobile app. One failing project must never stop the others. I do not want to do anything manually: you deploy, test, fix, redeploy and verify everything yourself.

## RULES

- AUTHENTICATION: use ONLY the Vercel CLI login session, or the env var `VERCEL_TOKEN` if it is set. Do not look for credentials anywhere else: do not read PowerShell or PSReadLine history, other environment variables, the registry, auth files, config files, Desktop or Documents. Do not use Render or Aiven. Never print, log or commit a token or secret.
- Always pass `--scope ramprasad-prajapats-projects` in permanent mode. Never delete, rename or modify any Vercel project, domain, environment variable or setting that does not belong to a project of this repo. No `vercel remove`.
- Do not change file permissions, ownership or ACLs.
- Never force push. Never commit secrets, claim URLs, `.vercel/`, `node_modules/` or test artifacts. Make sure `.vercel` is in the root `.gitignore`.
- Never weaken, delete or skip a test to make it pass.
- Mobile apps (08, 09, 10, 13, 15) are out of scope.

## STEP 0: PRE-CHECKS AND MODE

- Repo `R:\internship-projects`: git status clean, in sync with origin/main. Node.js and npm available.
- `R:\AUTOTEST_TASK.md` must exist. If it does not, STOP and tell me.
- Run `npx vercel whoami` (with `VERCEL_TOKEN` if it is set).
  - It prints an account: MODE = PERMANENT.
  - It says logged out: MODE = TEMPORARY. Do not stop, do not ask me, and do not look for credentials. Temporary mode needs no credentials.
- Print the chosen mode in the log.

## STEP 1A: PERMANENT MODE (Vercel login works)

Projects: 02, 03, 04, 05, 07, 11, 12, 14, 16.

For each project:
1. Find the folder that really contains the web app (index.html or package.json, or a `frontend` subfolder).
2. Vercel project name = the project folder name. Project 14 must use the EXISTING Vercel project `smart-hospital-chi`: update it in place and keep its name and domain.
3. From that folder run `vercel link --yes --project <name> --scope ramprasad-prajapats-projects`, then `vercel deploy --prod --yes --scope ramprasad-prajapats-projects`.
4. Vite apps (03, 05): build command `npm run build`, output `dist`. If the build fails, fix it once and retry. If the app has client-side routes and a direct route or reload gives 404, add a minimal `vercel.json` SPA rewrite to `/index.html` in that project folder, commit it and redeploy.
5. Take the REAL production URL from the CLI output (use `vercel inspect <deployment-url>` to read the alias if unclear). Never guess a URL. Check that its page title or main heading matches the project's own source. Write the verified URLs into `live-tests/urls.json`.
6. If a build needs a secret key or env value that I have not provided, put no secret anywhere: skip that project and report the reason.
7. If a deployment fails after 2 attempts, mark it FAILED with the exact error and continue with the next project.

## STEP 1B: TEMPORARY MODE (no login, no credentials)

Facts: `vercel deploy --temporary` needs no account, builds framework projects locally, deploys to production, and prints a claim URL and an expiry time. A temporary deployment expires after a server-set period unless it is claimed, and it can be redeployed until it expires. Because it expires, it is used here only as a test target, never as a final link.

Projects: 02, 03, 04, 05, 07, 11, 12, 16. (Project 14 already has the permanent deployment https://smart-hospital-chi.vercel.app: test that one directly, do not deploy it temporarily.)

For each project:
1. Copy the app folder (the folder that really contains index.html or package.json, or its `frontend` subfolder) to `R:\_tmp_deploy\<project-folder-name>`, OUTSIDE the repo, without node_modules, .vercel, .git and dist. This copy must NOT be linked to any Vercel project.
2. If there is a package.json, run `npm ci` (or `npm install`) in the copy. Then run `npx vercel deploy --temporary` in the copy.
3. From the CLI output take the temporary URL, the claim URL and the expiry time. Save the claim URLs and expiry times ONLY in `R:\claim-urls.txt` (outside the repo). Claim URLs are private: never put them in the repo, in README, in LAST_RUN.md or in git.
4. Handle SPA routes the same way as in permanent mode (minimal `vercel.json` rewrite in the repo project folder and in the copy).
5. Write the temporary URLs into `R:\_tmp_deploy\urls.temp.json`. Make the test suite read its URLs from the path in an env var `URLS_FILE` when it is set (add this support to `live-tests` if it is missing; the default stays `urls.json`). Never commit temporary URLs.
6. Timing: deploy ALL projects first and test immediately, in one continuous flow, because the deployments expire. If a deployment expires or is refused, make a new temporary deployment from a fresh unlinked copy and continue. Never wait for me.
7. If a deployment fails after 2 attempts, mark it FAILED with the exact error and continue.

## STEP 2: FULL AUTOTEST

Execute `R:\AUTOTEST_TASK.md` completely (sections 1 to 7: URL discovery, test standard, simulated camera and voice, work order, failure handling, reports). These overrides apply:
- URLs: in PERMANENT mode use the URLs from Step 1A. In TEMPORARY mode use `URLS_FILE=R:\_tmp_deploy\urls.temp.json` plus the permanent URL of project 14. URL auto-discovery and `R:\live-urls.txt` are only needed for projects 01 and 06.
- Do NOT write `R:\redeploy.ps1`. When a real bug is fixed in the repo, commit as `fix(<project>): ...`, push, then redeploy that project yourself (permanent mode: `vercel deploy --prod` from the linked folder; temporary mode: copy the updated sources to its `R:\_tmp_deploy\...` folder and run `npx vercel deploy --temporary` again), wait until it is live, and re-test.
- Projects 01 and 06 (Render + Aiven): if their live URLs are found, test them completely as described in AUTOTEST_TASK.md. If not, mark them NOT DEPLOYED with the exact reason and do nothing else for them. Never create Render or Aiven resources.
- Everything that used to be a manual check must be automated (simulated camera landmarks, simulated speech input, fake camera device). Report it as "simulated input", never as "manual check".

## STEP 3: FIX AND REPEAT

- Wrong test: fix the test without making it check less. Real bug: fix it in the app, push, redeploy, re-test.
- At most 2 fix attempts per issue. After that mark it as a known issue with the reason and continue.
- Finish with TWO consecutive full runs in which every test of every deployed project passes. A test that only passes after a retry is "flaky": make it stable.

## STEP 4: DOCS AND GIT

- Generate `live-tests/LAST_RUN.md` (date and time, mode, per-project table with tests total / passed / failed / flaky, known issues).
- PERMANENT mode: for projects that PASS put the real verified URL as "Live Demo" in the root README table and in the project README. Projects that are not deployed or failed keep an honest status.
- TEMPORARY mode: do NOT put any temporary URL anywhere in the repo. Leave the README entries unchanged (project 14 keeps its permanent link). In LAST_RUN.md write "verified on a temporary deployment (expired)" without URLs. Commit only test, fix and LAST_RUN.md changes.
- Never leave placeholder text or broken links in any README.
- Commit in clean steps and push to origin main. At the end `git status` must be clean and in sync with origin/main.
- Delete the `R:\_tmp_deploy` copies at the end (keep `R:\claim-urls.txt`).

## STEP 5: FINAL REPORT

- The mode that was used.
- Table: project, type, URL, tests total / passed / failed / flaky, status: VERIFIED-PERMANENT, VERIFIED-ON-TEMPORARY (tests all passed, but not permanent yet), FAILED with reason, or NOT DEPLOYED with reason.
- What was simulated and what that covers.
- Known issues and the two consecutive run results.
- TEMPORARY mode only, in simple Hinglish: "Ye deployments temporary the aur expire ho jayenge. Permanent karne ke liye ek baar Vercel login chahiye: normal PowerShell me npx vercel login --no-browser chalao, link browser me kholo, login poora karo, npx vercel whoami se check karo, phir yahi task dobara chalao. Agent khud permanent deploy karega, dobara test karega aur README me links dalega." Also tell me that `R:\claim-urls.txt` holds the private claim links.
- Projects 01 and 06: say in simple Hinglish that they need the Aiven and Render steps from `R:\MANUAL_DEPLOY_GUIDE.md`, and that this same task file can be run again afterwards to test them.
- PERMANENT mode only, last line: remind me to run `npx vercel logout` when I am finished. Do NOT run it yourself.
