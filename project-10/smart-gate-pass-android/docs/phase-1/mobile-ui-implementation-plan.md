# Phase 1.5: Mobile UI Implementation Report

This document reports the structural files, dynamic state engines, and modular Kotlin components compiled to establish the locked Smart Gate Pass Mobile Foundation.

---

## 1. Architectural File Mapping

The mobile UI has been built entirely within a professional, highly structured Kotlin/Compose directory layout:

| File path | Purpose / Responsibilities |
| :--- | :--- |
| `/app/build.gradle.kts` | Orchestrates plugins and declares Jetpack Compose, Room, Coil, and Jetpack Navigation dependencies. |
| `/app/src/main/res/values/strings.xml` | Declares localized resource strings and synchronizes application naming. |
| `/app/src/main/java/com/example/ui/theme/Color.kt` | Encapsulates the visual design theme colors, including badge status colors. |
| `/app/src/main/java/com/example/ui/theme/Theme.kt` | Preserves the visual theme and binds the custom light/dark color palettes. |
| `/app/src/main/java/com/example/constants/Status.kt` | Houses visitor/parcel status constants and dynamic color-resolution maps. |
| `/app/src/main/java/com/example/constants/Routes.kt` | Defines type-safe navigation destination string routes. |
| `/app/src/main/java/com/example/data/MockData.kt` | Defines visitor/parcel data classes and a stateful singleton `MockDataStore` using `mutableStateListOf`. |
| `/app/src/main/java/com/example/services/Services.kt` | Implements API-ready layers (`AuthService`, `VisitorService`, `ParcelService`) wrapper over the core stateful store. |
| `/app/src/main/java/com/example/components/Components.kt` | Contains 16+ highly functional, reusable Material 3 layouts, forms, buttons, and badges. |
| `/app/src/main/java/com/example/screens/CommonScreens.kt` | Implements the animated Splash Screen, Login Screen, and Unauthorized landing views. |
| `/app/src/main/java/com/example/screens/GuardScreens.kt` | Builds Security Guard dashboards, logs registration forms, verification inputs, and activity feeds. |
| `/app/src/main/java/com/example/screens/ResidentScreens.kt` | Compiles Resident approvals boards, expected guest passes, instruction menus, and notification histories. |
| `/app/src/main/java/com/example/MainActivity.kt` | Bootstraps the application and links the global navigation graph. |

---

## 2. Dynamic State Management Core

To adhere to the **Dynamic UI Rule**, the application does not rely on static screens:

1. **Reactive Store:** When users trigger events (e.g. resident clicks "Approve" or "Reject", guard registers "Add Visitor", resident changes delivery instructions), they invoke services that mutate the central `MockDataStore` datasets.
2. **Dynamic Recompositions:** Because `MockDataStore` manages these lists using Compose `mutableStateListOf`, any modification immediately propagates. Stats counters on the dashboard, visitor logs, pending counts, and histories immediately recalculate and update in real time.
3. **Prefilled Flow:** Selecting Flat B-403 in the visitor dropdown immediately reads from the current mock database to pre-fill "Ananya Sharma" in the resident indicator field.
4. **Mock Authenticator:** Tapping "As Guard" or "As Resident" pre-fills coordinates and immediately redirects the user to the correct role-specific dashboard.
