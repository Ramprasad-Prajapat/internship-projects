# Phase 8 – Summary

## Kotlin files changed

- `app/src/main/java/com/example/screens/GuardScreens.kt`

> **Parcel workflow and Guard Parcel Records search fix:** Updated `GuardScreens.kt` to derive parcel list directly from `MockDataStore.parcelsList` using `derivedStateOf`, ensuring live updates after Resident decisions and enabling comprehensive search by flat number, delivery company, courier name, parcel type, order ID, and status.

## Documentation files updated


- `docs/phase-8/advanced-mobile-enhancements-plan.md`
- `docs/phase-8/phase-8-summary.md` (this file)
- `docs/changelog.md`
- `docs/master-project-index.md`
- `README.md`

## Gradle files changed

- `app/build.gradle.kts`

## Dependency status

- **Added & kept**: `implementation("com.google.zxing:core:3.5.4")`
- **Skipped**: CameraX, ML Kit, any backend/database/API libraries
- No new backend, Retrofit, or Firebase dependencies were added during Phase 8 (existing ones, if any, remain unchanged)

## Permission changes

- No camera permission was added because the QR scanner was deliberately skipped.

## Local persistence method used

- Simple wrapper around Android **SharedPreferences** (`LocalPersistence.kt`) for lightweight key‑value storage (e.g., last selected filter, recent search query).

## Validation results

- **Persistence force‑stop/relaunch test:** pending manual device/emulator verification.
- **Search / filter UI:** Parcel Records and Visitor/Pending list search fields and status chips are functional and filter displayed items.
- **QR image generation:** QR bitmap generated from the existing pass token and displayed on the Resident OTP/QR pass screen.
- **Camera scanner:** skipped – no scanner UI or camera permission.
- **Manual QR / OTP fallback:** remains unchanged and works as before.
- **Guard workflow verification:** existing guard screens compile and run; manual OTP/QR verification unchanged.
- **Resident workflow verification:** resident dashboard and pass screen compile; QR image displayed alongside text token.
- **Android build:** `./gradlew.bat assembleDebug` succeeds without errors.
- **Verified APK path:** `app/build/outputs/apk/debug/app-debug.apk`
- **Backend folder:** No `backend/` folder was recreated.

## Known limitations

- No persistent backend or online sync.
- No real database; data resets on app restart.
- Camera‑based QR scanning not implemented.
- Persistence force‑stop/relaunch behavior not yet verified on a physical device.
- No screenshots captured in this documentation step.

## Phase 8 completion summary

Phase 8 delivered the targeted mobile enhancements: lightweight local persistence, searchable and filterable lists, and QR code image rendering using ZXing core, while deliberately omitting camera scanning and backend integration to keep the build stable. All changes compile, the debug APK is generated, and documentation has been updated accordingly.

### Post‑fix Note

- Resident navigation bug discovered during manual testing.
- Fixed in `app/src/main/java/com/example/MainActivity.kt` by using a safer navigation pattern with non‑inclusive `popUpTo`, `launchSingleTop`, and `restoreState`.
- Resident Home/Dashboard navigation manually verified: **Passed**.
- Other Resident page navigation manually verified: **Passed**.
- Guard workflow unaffected.
- Manual QR/OTP verification unchanged.

**Persistence force‑stop/relaunch test:** pending

## Kotlin files changed

- `app/src/main/java/com/example/data/LocalPersistence.kt`
- `app/src/main/java/com/example/data/MockData.kt`
- `app/src/main/java/com/example/services/VisitorService.kt`
- `app/src/main/java/com/example/services/ParcelService.kt`
- `app/src/main/java/com/example/screens/GuardScreens.kt`
- `app/src/main/java/com/example/screens/ResidentScreens.kt`
- `app/src/main/java/com/example/util/QRCodeUtil.kt`

## Documentation files updated

- `docs/phase-8/advanced-mobile-enhancements-plan.md`
- `docs/phase-8/phase-8-summary.md` (this file)
- `docs/changelog.md`
- `docs/master-project-index.md`
- `README.md`

## Gradle files changed

- `app/build.gradle.kts`

## Dependency status

- **Added & kept**: `implementation("com.google.zxing:core:3.5.4")`
- **Skipped**: CameraX, ML Kit, any backend/database/API libraries
- No new backend, Retrofit, or Firebase dependencies were added during Phase 8 (existing ones, if any, remain unchanged)

## Permission changes

- No camera permission was added because the QR scanner was deliberately skipped.

## Local persistence method used

- Simple wrapper around Android **SharedPreferences** (`LocalPersistence.kt`) for lightweight key‑value storage (e.g., last selected filter, recent search query).

## Validation results

- **Persistence force‑stop/relaunch test**: pending manual device/emulator verification.
- **Search / filter UI**: Parcel Records and Visitor/Pending list search fields and status chips are functional and filter displayed items.
- **QR image generation**: QR bitmap generated from the existing pass token and displayed on the Resident OTP/QR pass screen.
- **Camera scanner**: skipped – no scanner UI or camera permission.
- **Manual QR / OTP fallback**: remains unchanged and works as before.
- **Guard workflow verification**: existing guard screens compile and run; manual OTP/QR verification unchanged.
- **Resident workflow verification**: resident dashboard and pass screen compile; QR image displayed alongside text token.
- **Android build**: `./gradlew.bat assembleDebug` succeeds without errors.
- **Verified APK path**: `app/build/outputs/apk/debug/app-debug.apk`
- **Backend folder**: No `backend/` folder was recreated.

## Known limitations

- No persistent backend or online sync.
- No real database; data resets on app restart.
- Camera‑based QR scanning not implemented.
- Persistence force‑stop/relaunch behavior not yet verified on a physical device.
- No screenshots captured in this documentation step.

## Phase 8 completion summary

Phase 8 delivered the targeted mobile enhancements: lightweight local persistence, searchable and filterable lists, and QR code image rendering using ZXing core, while deliberately omitting camera scanning and backend integration to keep the build stable. All changes compile, the debug APK is generated, and documentation has been updated accordingly.
