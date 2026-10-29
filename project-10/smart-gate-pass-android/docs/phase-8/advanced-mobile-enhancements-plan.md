# Phase 8 – Advanced Mobile Enhancements Plan

## Goals
- Introduce lightweight local persistence for the mock mobile app using Android **SharedPreferences**.
- Implement a robust **search & filter** UI for both parcel records and visitor request lists.
- Display a **generated QR code bitmap** on the Resident OTP/QR pass screen using the **ZXing core** library.
- Skip camera‑based QR scanning to keep the build stable and avoid additional permissions/dependencies.

## Scope
| Area | Description |
|------|-------------|
| **Local Persistence** | Added `LocalPersistence.kt` providing a thin wrapper around `SharedPreferences` for storing simple key‑value data (e.g., last selected filter, recent search query). No external storage libraries required. |
| **Search / Filter** | Updated `GuardScreens.kt` (Parcel Records) and `ResidentScreens.kt` (Visitor lists) with an `OutlinedTextField` for free‑text search and filter chips for status. Includes a clear/reset action. |
| **QR Image** | Added `QRCodeUtil.kt` which uses `com.google.zxing:core:3.5.4` to generate a `Bitmap` from the existing QR token string. Integrated into `OtpQrPassScreen`. |
| **Camera Scanner** | Deliberately omitted. No new permissions or dependencies (CameraX, ML Kit) are added. The manual QR entry fallback remains unchanged. |

## Deliverables
- Kotlin source files:
  - `app/src/main/java/com/example/data/LocalPersistence.kt`
  - `app/src/main/java/com/example/data/MockData.kt`
  - `app/src/main/java/com/example/services/VisitorService.kt`
  - `app/src/main/java/com/example/services/ParcelService.kt`
  - `app/src/main/java/com/example/screens/GuardScreens.kt`
  - `app/src/main/java/com/example/screens/ResidentScreens.kt`
  - `app/src/main/java/com/example/util/QRCodeUtil.kt`
- Gradle update `app/build.gradle.kts` (dependency `com.google.zxing:core:3.5.4` kept).
