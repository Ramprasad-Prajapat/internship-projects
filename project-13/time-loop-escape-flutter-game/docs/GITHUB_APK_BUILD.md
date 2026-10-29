# GitHub APK Build Guide

## Overview
This guide explains how **the `time-loop-game` Flutter project is built entirely in the cloud** using GitHub Actions. No Flutter, Android SDK, Java, or Gradle needs to be installed on your Windows PC.

## Prerequisites on your local machine
- **Git** – to commit and push source code.
- **GitHub account** – with write access to a repository where you will store the project.

Everything else (Flutter SDK, Android SDK, Gradle, ADB, etc.) is provided by the GitHub‑hosted runner.

---

## 1. Create / connect a GitHub repository
1. On GitHub, create a new repository (e.g., `username/time-loop-game`).
2. In the terminal, navigate to the project root:
   ```bash
   cd "r:/Inernship/WebDevelopment/Project/time-loop-game"
   ```
3. Initialise Git if the folder is not already a repository:
   ```bash
   git init
   ```
4. Add the remote (replace `USERNAME` and `REPO` with your values):
   ```bash
   git remote add origin https://github.com/USERNAME/REPO.git
   ```
5. Add all files and commit:
   ```bash
   git add .
   git commit -m "ci: add cloud Flutter Android release pipeline"
   ```
6. Push to GitHub (default branch is `main`):
   ```bash
   git branch -M main
   git push -u origin main
   ```
   > **Note:** If the repository already exists remote, skip steps 3‑4 and simply push.

---

## 2. Workflow file
The workflow lives at `.github/workflows/android-release.yml`. It:
- Checks out the code.
- Installs **Java 11** (compatible with the Android Gradle Plugin).
- Installs **Flutter 3.10.6** (the stable version that satisfies `pubspec.yaml`).
- Caches `pub` packages.
- Runs `flutter pub get`, `flutter analyze`, and `flutter test`.
- Builds a **release APK** with `flutter build apk --release`.
- Locates the generated APK, records its size and SHA‑256 checksum.
- Uploads the APK and a `build_metadata.txt` file as artifacts.

---

## 3. Triggering a build
### Manual trigger
1. Open the **Actions** tab of your repository on GitHub.
2. Select **Android Release** workflow.
3. Click **Run workflow** → **Run workflow**.

### Automatic trigger
- Pushing to the `main` branch automatically starts the workflow.
- Opening a pull request targeting `main` runs analysis and tests only (no APK artifact).

---

## 4. Retrieving the APK
After a successful run, the workflow page shows an **Artifacts** section.
1. Click on the artifact named `time-loop-escape-release-apk`.
2. Download the `.zip` file; it contains the generated `app‑release.apk`.
3. The same page also contains `build-metadata` with version info, commit SHA, build timestamp, APK size, and SHA‑256.

---

## 5. Installing the APK on a device
1. Transfer the APK to your Android phone (e.g., via USB, email, or cloud storage).
2. On the device enable **Install unknown apps** for the source you used.
3. Open the APK and follow the installation prompts.
4. Launch the app and verify it runs as expected.

---

## 6. Signing considerations
- The project currently **does not contain a production keystore**. The workflow builds a **debug‑signed APK** (the `signingConfig` in `android/app/build.gradle` points to `signingConfigs.debug`).
- A debug‑signed APK is installable on devices that allow unknown sources.
- To produce a **production‑signed** APK you must:
  1. Generate a keystore (`keytool -genkeypair …`).
  2. Add the keystore (base64‑encoded) and passwords as GitHub Secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`).
  3. Update `android/app/build.gradle` to reference `signingConfigs.release` and use those secrets.
- **Do not** commit any keystore files or passwords to the repository.

---

## 7. Troubleshooting
| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| Workflow fails at `flutter pub get` | Missing or incompatible dependencies | Ensure `pubspec.yaml` constraints are satisfied; the workflow uses Flutter 3.10.6 which matches `>=3.10.0`.
| `flutter analyze` fails | Code errors introduced locally | Resolve the reported lint/analysis issues and push again.
| Tests fail | Failing unit/integration tests | Fix failing tests or, if acceptable, temporarily disable them (not recommended).
| No APK artifact | Build step failed or `flutter build apk` produced no file | Review the **Build release APK** step logs; common reasons are missing Android SDK (handled by the runner) or Gradle configuration errors.
| SHA‑256 mismatch / checksum missing | Artifact upload issue | Verify that `build_metadata.txt` is generated; the workflow automatically computes SHA‑256.

---

## 8. Important notes
- **No local Flutter/Android SDK is required** – the entire build runs on GitHub’s Ubuntu runners.
- The workflow **does not publish** to Google Play; you can manually upload the generated APK later.
- Keep the **`android/app/build.gradle` signing configuration** as‑is unless you add real signing secrets.
- The `.gitignore` already excludes build artefacts, local Gradle files, and any keystore files.

---

*End of Guide*
