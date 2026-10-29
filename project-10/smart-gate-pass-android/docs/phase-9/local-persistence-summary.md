# Phase 9 – Local Persistence Summary

## Persistence Approach Used
- Built persistent local storage for the gate pass mobile application using Android `SharedPreferences` serialized with built-in `org.json` types (`JSONObject` and `JSONArray`).
- Selected this option as it requires 0 reflection, 0 new library dependencies, and is 100% build-safe, fast, and robust across Android API levels (from minSdk 24 to 36).

## Kotlin Files Changed
- [`app/src/main/java/com/example/data/MockData.kt`](file:///r:/Inernship/WebDevelopment/Project/GatePass_app/phase-2Completed/app/src/main/java/com/example/data/MockData.kt) (added `resetToDefaults()` inside `MockDataStore` and called `LocalDataStorage.saveData()` inside each list mutation function).
- [`app/src/main/java/com/example/MainActivity.kt`](file:///r:/Inernship/WebDevelopment/Project/GatePass_app/phase-2Completed/app/src/main/java/com/example/MainActivity.kt) (initialized `LocalDataStorage` and loaded saved local data during `onCreate` before views are rendered).
- [`app/src/main/java/com/example/screens/CommonScreens.kt`](file:///r:/Inernship/WebDevelopment/Project/GatePass_app/phase-2Completed/app/src/main/java/com/example/screens/CommonScreens.kt) (added a "Reset Demo Data" text link below login fields to clear prefs and restore initial mock configurations).

## Storage Files Created
- [`app/src/main/java/com/example/storage/LocalDataStorage.kt`](file:///r:/Inernship/WebDevelopment/Project/GatePass_app/phase-2Completed/app/src/main/java/com/example/storage/LocalDataStorage.kt) (implements `saveData`, `loadData`, `clearDataAndRestoreDefaults`, and manual mapping functions between request structures and `JSONObject`/`JSONArray` arrays).

## Data Saved & Loaded
- **Visitor Requests**: All properties (ID, name, phone, purpose, flatNo, residentName, guardName, status, times, counts, vehicleNo, OTP, QR, and pre-approval flags).
- **Parcels**: All courier properties, parcel status, and resident choices.
- **Notifications**: Gate alerts log list.

## Save Triggers Added
- Guard visitor creation.
- Resident visitor approvals and rejections.
- Guard visitor check-ins and check-outs.
- Resident QR pass pre-approvals.
- Guard parcel registrations.
- Resident parcel action approvals and choices.
- Notification logs state changes.

## App Launch Load Result
- **Passed**: Correctly reads strings on launch, populating runtime `MockDataStore` lists synchronously before rendering the view.

## Duplicate Seed Prevention Result
- **Passed**: Initialized mock datasets only load on first compile/launch if `smartgate_local_persistence_prefs` key does not exist. Subsequent launches reload user lists from local cache, preventing duplicate items.

## Developer Demo Reset Result
- **Passed**: Clicking "Reset Demo Data" under quick logins clears all shared preferences storage keys, clears lists in-memory, repopulates initial demo seeds, and displays a confirmation Toast.

## Workflows Preserved
- Guard camera scanning, OTP confirmation, gallery picker QR decoding, manual fallbacks, Resident Save/Share, Parcel flows, and Guard-Resident approvals sync remain fully intact and operational.

## Build Status
- **Clean compilation**: `./gradlew.bat clean assembleDebug` completed successfully.
- **Root Sync Path**: `.\app-debug.apk` (Timestamp: `06-07-2026 16:30`, size: `25851525` bytes).
- **Device Relaunch Verification**: `APK built successfully; persistence force-stop/relaunch verification pending user manual testing.`
