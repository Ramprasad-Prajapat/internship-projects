# Phase 2: Protected Routes Plan

This document details the code-level navigation interceptors and guard blocks protecting individual screens from unauthorized roles.

---

## 1. List of Protected Guard Routes
Only users with a session containing `role = "GUARD"` can access the following destinations:

| Route Key | Screen Name | Action / Target |
|---|---|---|
| `GUARD_DASHBOARD` | Guard Dashboard | Command center view |
| `ADD_VISITOR` | Add Visitor | Logs new check-ins |
| `ADD_PARCEL` | Add Parcel | Registers received items |
| `GUARD_PENDING_REQUESTS` | Pending Approvals | Wait list for resident replies |
| `SCAN_QR` | Scan QR Pass | Decrypts expected invites |
| `VERIFY_OTP` | Verify OTP | Matches guest codes |
| `INSIDE_VISITORS` | Inside List | Active visitors in the society |

---

## 2. List of Protected Resident Routes
Only users with a session containing `role = "RESIDENT"` can access the following destinations:

| Route Key | Screen Name | Action / Target |
|---|---|---|
| `RESIDENT_DASHBOARD` | Resident Dashboard | Dashboard and activity feeds |
| `VISITOR_REQUESTS` | Visitor Approvals | Action sheet to allow/deny entries |
| `PARCEL_REQUESTS` | Parcel Directives | Drop instructions for couriers |
| `ADD_EXPECTED_VISITOR` | Schedule Guest | Creates expected invite codes |
| `otp_qr_pass/{otp}/{qrCode}` | Pass Slips | Visual passcode display |
| `NOTIFICATION_HISTORY` | Alerts Feed | Chronological security alerts |

---

## 3. Guard Logic Description
The protection system uses inline Jetpack Navigation composable interceptors.
Inside `MainActivity.kt`:

```kotlin
composable(Routes.TARGET_ROUTE) {
    if (AuthService.getCurrentUser()?.role == "REQUIRED_ROLE") {
        TargetComposableScreen()
    } else {
        androidx.compose.runtime.LaunchedEffect(Unit) {
            navController.navigate(Routes.UNAUTHORIZED) {
                // Wipe the hijacked route from memory
                popUpTo(Routes.TARGET_ROUTE) { inclusive = true }
            }
        }
    }
}
```

---

## 4. Unauthorized Handling Flow
If an authenticated user attempts to access a protected route of a different role (e.g., a Guard attempts to open the `VISITOR_REQUESTS` screen of a Resident):
1. The composable block evaluates `AuthService.getCurrentUser()?.role`.
2. The check fails.
3. Instead of rendering the screen contents, a Compose `LaunchedEffect(Unit)` is triggered.
4. The system navigates to `Routes.UNAUTHORIZED` immediately.
5. The unauthorized screen renders, blocking the view, and provides a **Return to Login** button to reset the session.
