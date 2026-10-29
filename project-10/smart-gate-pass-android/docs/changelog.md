# Changelog

All notable changes to the Smart Gate Pass Management System will be documented in this file.

---
## [Phase 9] - 2026-07-06

### Added
- Local data persistence using Android `SharedPreferences` serialized with built-in `org.json` types (`JSONObject` and `JSONArray`).
- Offline cache support for all visitor logs, parcel requests, notification history logs, and pre-approved expected visitor QR passes.
- Automatic persistence load on app launch (`loadData()`) and state updates saving on mutations.
- Seed duplicate prevention (only uses hardcoded mock data if no local pref cache is present).
- "Reset Demo Data" option inside LoginScreen to clear stored cache and restore initial mock configurations.

## [Phase 8C] - 2026-07-06

### Added
- Real Guard Camera QR scanner using CameraX PreviewView and ImageAnalysis bound to lifecycle.
- YUV frame analysis (`QRCodeAnalyzer`) running offline ZXing barcode decoders to extract QR tokens.
- Fixed YUV frame decoding reliability (allocated YUV byte arrays using `rowStride * height` bounds to prevent internal stride exception crashes).
- Added multi-angle rotation compensation (tries rotated image decoding dynamically when device is oriented).
- Added `TRY_HARDER` and `QR_CODE` decoding hints to improve scanning performance from other screens.
- Added live preview instructions overlays and Torch ON/OFF flashlight controls inside scanner viewfinder.
- Request CAMERA permission dynamically at runtime.
- Simulated scan fallback for emulator environment testing inside camera preview.
- Guard Camera scanner option visibility fix (renamed card/button to "Scan QR with Camera").
- Resident QR pass screen "Save QR Code" button saving generated QR bitmap offline via MediaStore API.
- Resident pass details SMS/WhatsApp share button triggering system Share Intent sheets.
- Stale root APK issue resolution (ran clean build and copied output to `.\app-debug.apk` in root directory for reliable installs).

## [Phase 8B] - 2026-07-06

### Added
- Real QR code generation on Resident pass screen.
- Camera scanning mock/simulation view after checking for CAMERA permission dynamically.
- Gallery upload option to select and decode QR code bitmaps using ZXing.
- Robust state checking to prevent duplicate check-ins, block rejected/expired/blocked visitors, and update visitor status in the shared state.
- Maintenance of existing manual QR and OTP verification logic.

## [Phase 8] - 2026-07-06

### Added
- Local persistence for mobile mock app data using SharedPreferences.
- Search/filter for parcel and visitor lists.
- QR image display on Resident pass screen using ZXing core.
- Camera scanner skipped safely to protect stable build.

### Changed
- Fixed Guard Parcel Records stale filtering to reflect Resident parcel status updates and enabled full search functionality.

### Verified by build
- Manual OTP verification code remains unchanged.
- Manual QR verification code remains unchanged.
- Existing Guard workflow compiles.
- Existing Resident workflow compiles.
- Android debug APK build succeeds.

### Not Added
- Backend
- Database
- API integration
- Online sync
- Camera scanner

## [Phase 6] - 2026-07-04

### Added
- OTP generation for expected visitor (6‑digit numeric).
- QR/pass token generation (`PASS-<timestamp>`).
- Resident OTP/QR Pass screen displays both values.
- Guard manual OTP verification (via manual entry dialog).
- Guard manual QR token verification (validation against MockDataStore, duplicate check‑in blocked, invalid status handling).
- Shared `MockDataStore` remains the single source of truth.

### Changed
- Updated documentation and status handling to block duplicate check‑ins and invalid statuses.

---

## [Phase 4] - 2026-07-04

### Added
- **My Visitors Screen (`MyVisitorsScreen`):** Native Compose screen to display full resident visitor history logs, filtered by chips (All, Pending, Approved, Checked In, Checked Out, Rejected).
- **My Parcels Screen (`MyParcelsScreen`):** Native Compose screen to display full resident package logs, filtered by chips (All, Pending, Held at Gate, Delivery Inside, Delivered, Rejected).
- **API-ready Service Helpers:** Implemented data wrappers in `MockDataStore` and `Services.kt` to retrieve filtered requests (`getResidentVisitorRequests`, `getResidentParcelRequests`, `getMyVisitors`, `getMyParcels`, `getResidentNotifications`, `getResidentPasses`).

### Changed
- **`ResidentScreens.kt`:** 
  - Restructured the dashboard to retrieve dynamic statistics and display 5 quick actions (including My Visitors, My Parcels).
  - Configured visitor/parcel requests list filters to limit by logged-in flat number ("B-403").
  - Modified requests screen to prevent duplicate actions by hiding buttons once a decision is made.
  - Added Visit Time and Validity Time inputs to `AddExpectedVisitorScreen` with validation (10-digit mobile check).
  - Modified `OtpQrPassScreen` to look up token details dynamically.
  - Filtered notifications history to display alerts containing the flat ID.
- **`MainActivity.kt`:** Registered `Routes.MY_VISITORS` and `Routes.MY_PARCELS` in the navigation graph.
- **`MockData.kt`:** Extended `VisitorRequest` data constructor. Implemented unique mock ID and pass generation using timestamp-based prefixing (`VIS-...`, `PAR-...`, `NOTIF-...`, `PASS-...`).

---

## [Phase 3] - 2026-07-03

### Added
- **JavaScript Context & State Template (`GuardDataContext.js`):** Added the standard state container context layout under `mobile-app/src/context/` to serve as a shared data manager template.
- **JavaScript Mock Data & Service files:** Created `mockData.js`, `visitorService.js`, `parcelService.js`, and `notificationService.js` under `mobile-app/` to align with static path requirements.
- **Checkout Visitor Screen (`CheckoutVisitorScreen`):** Native Compose screen to display guest entry logs and verify details before confirming outward checkout.
- **Parcel Records Screen (`ParcelRecordsScreen`):** Filter chip list page to track packages (All, Pending, Held at Gate, Delivered, Rejected) and trigger status updates.
- **Detailed OTP & QR Validation:** Connected `VerifyOtpScreen` and `ScanQrScreen` manually to specific test values (`123456`, `482913`, `000000`, `VISITOR-QR-001`, `PARCEL-QR-001`) to support offline testing.

### Changed
- **`GuardScreens.kt`:** Added Checkout Visitor and Parcel Records screens. Modified Pending Queue list to show pending, approved, and rejected visitors, allowing guards to check in approved visitors. Integrated Parcel Records quick action on the main dashboard.
- **`MainActivity.kt`:** Registered `checkout_visitor/{visitorId}` and `parcel_records` navigation composable routes.
- **`MockData.kt`:** Appended Uncle David, Ramesh Kumar, and Expired Guest mock entries with matching test OTPs and QR codes.

---

## [Phase 2] - 2026-07-02

### Added
- **Token/User Storage Helper (`TokenStorage.kt`):** Android SharedPreferences-backed secure persistence layer for tokens and user structures.
- **AuthService Methods:** Expanded `AuthService` with robust session interfaces (`login`, `logout`, `getCurrentUser`, `checkAuthStatus`, `validateRole`).
- **Splash Screen Auth Check:** Configured the application start destination to check session states dynamically.
- **Protected Navigation Routes:** Shielded Guard and Resident routes using inline composable interceptors inside `MainActivity.kt`.
- **Unauthorized Screen Interceptor:** Formalized `Routes.UNAUTHORIZED` to trap invalid role requests and clear rogue credentials safely.
- **Route & Role Constants:** Integrated type-safe constants for multi-role workflows in `Routes.kt` and `Roles.kt`.
- **Api Configuration Placeholder (`Api.kt`):** Declared baseline `BASE_URL` to establish API readiness for subsequent integration milestones.
- **System Documentation Plan:** Authored 5 detailed architectural plans covering Authentication, Role Routing, State Lifecycle, Protected Paths, and Summary indexes inside `docs/phase-2/`.

### Changed
- **`MainActivity.kt`:** Upgraded global NavHost to support role verification checks dynamically.
- **`CommonScreens.kt`:** Refined the Login page callback to handle validation alerts, prefilled shortcuts, and Unauthorized routing. Modified the Access Denied block to trigger total session teardowns.

---

## [Phase 1.5] - 2026-07-02

### Added
- **UI Design Lock Guide (`ui-reference.md`):** Locked branding, hex color palettes, layout constraints, accessibility guidelines, and dynamic status-to-badge mappings.
- **Design System Blueprint (`design-system.md`):** Detailed reusable UI components, margins, typography configurations, and adaptive column spacing rules.
- **Mobile Foundation Implementation Plan (`mobile-ui-implementation-plan.md`):** Mapped out files, libraries, architecture packages, and state management engine logic.
- **Dynamic Local State Management:** Created stateful list structures using Compose `mutableStateListOf` inside a unified `MockDataStore` so that resident approvals/rejections and guard visitor/parcel creation flow dynamically through the app in real time.
- **23+ Reusable Compose UI Components:** Created modular components including custom app headers, bottom tab bars, interactive text inputs, status badges, counter cards, and dialog instruction lists.
- **Role-Based Workspaces & Screens:** Built custom Dashboards, Log Forms, OTP and QR Code displays, scan overlays, and history registers for both Security Guards and Flat Residents.
- **Dynamic App Navigation Routing:** Connected all workspaces and screens inside a global type-safe-ish Jetpack Navigation graph hosted in `MainActivity.kt`.

### Changed
- **Dependency Injections:** Enabled Jetpack Navigation and Coil image loader libraries inside `app/build.gradle.kts`.
- **Branding Palette:** Updated the system `Color.kt` and `Theme.kt` definitions to adopt the professional Navy and Royal Blue design lock theme.

---

## [Phase 1] - 2026-07-02

### Added
- **Project Plan Blueprint (`project-plan.md`):** Outlining core system objectives, main roles, detailed workflows, exhaustive screen list registries, and clear MVP scope.
- **Architecture Blueprint (`architecture-plan.md`):** Complete design specifications detailing React Native mobile navigation structures, standard folder layouts, modular monolithic backend paths, and tech stack configurations.
- **Database Schema Blueprint (`database-plan.md`):** Formulated complete specifications for 11 relational tables including primary keys, foreign keys, constraints, and finite enums for visitor/parcel status transitions.
- **API Payloads Blueprint (`api-plan.md`):** Outlined critical endpoints, HTTP methods, security parameters, authorization mappings, and sample JSON payload keys.
- **Phase Summary Report (`phase-1-summary.md`):** Aggregating Phase 1 deliverables, MVP milestones, out-of-scope boundaries, and Phase 2 progression paths.
- **Platform Synchronizations:** Configured name and description metadata inside `/metadata.json` and sync-updated the app name in `/app/src/main/res/values/strings.xml`.

### Changed
- *None (This is the initial baseline planning phase).*

### Not Changed
- *No previous phase or implementation code exists to modify.*

### Dependencies on Previous Phases
- *None (This phase acts as the architectural baseline for all future work).*
