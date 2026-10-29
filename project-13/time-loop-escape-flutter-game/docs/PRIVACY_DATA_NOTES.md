# Privacy and Local Data Handling Notes — Time Loop Escape

## Application Privacy Overview

*11:57 — The Last Check-In* is designed and built as a **100% offline-first application**.

---

## Data Storage Practices

1. **Gameplay Save State**:
   - Saved locally to device file storage (`time_loop_local_storage.json` / `time_loop_save_game_v1`).
   - Contains only gameplay progress (loop count, discovered clues, unlocked codes, inventory, and solved puzzles).

2. **User Preferences**:
   - Saved locally under storage key `time_loop_user_preferences_v1`.
   - Contains audio volume toggles, haptic settings, subtitle flags, and reduced motion toggles.

3. **Zero Network Transmission**:
   - The application does not contain network request libraries, analytics tracking, or ad SDKs.
   - Android Manifest omits `android.permission.INTERNET`.

4. **Zero Account Data**:
   - No user authentication, user IDs, or login forms exist.

5. **Secrets & Credentials Audit Result**:
   - `NO EMBEDDED PRODUCTION SECRETS DETECTED`
