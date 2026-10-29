# Phase 2: Role-Based Navigation Plan

This document details the navigation paths, access conditions, and redirection maps built to control workspace separation.

---

## 1. Guard Navigation Rules
Security guards require high-priority tools for check-in and parcel receipt on site. They are permitted access **only** to Guard specific routes:
* **Allowed Routes:**
  * `GUARD_DASHBOARD` — Main guard command center
  * `ADD_VISITOR` — Check-in logs
  * `ADD_PARCEL` — Log courier packages
  * `GUARD_PENDING_REQUESTS` — Track approvals
  * `SCAN_QR` — Scan expected passes
  * `VERIFY_OTP` — Code check-ins
  * `INSIDE_VISITORS` — Active inside lists
* **Restricted Routes:** All resident and admin views are blocked.

---

## 2. Resident Navigation Rules
Residents require oversight of visitors and parcels arriving for their specific units. They are permitted access **only** to Resident specific routes:
* **Allowed Routes:**
  * `RESIDENT_DASHBOARD` — Hub for home actions
  * `VISITOR_REQUESTS` — Approve guests
  * `PARCEL_REQUESTS` — Set instructions
  * `ADD_EXPECTED_VISITOR` — Guest scheduling
  * `otp_qr_pass/{otp}/{qrCode}` — Access slip displays
  * `NOTIFICATION_HISTORY` — Unread security logs
* **Restricted Routes:** All guard security entry views are blocked.

---

## 3. Invalid Role Handling
If a user is successfully authenticated but holds a role other than `GUARD` or `RESIDENT` (e.g., a mock `ADMIN` account), they are flagged as an unauthorized device.
* The navigation host intercepts the route request.
* Immediately redirects the session to the **Access Denied / Unauthorized Screen**.

---

## 4. Unauthorized Screen Purpose
The `Unauthorized Screen` serves as a defensive wall inside the application:
* Displays high-contrast warning elements notifying the user of access restrictions.
* Warns: `"Your account role is not allowed to use this mobile app."`
* Offers a single action button: **Return to Login** which:
  1. Calls `AuthService.logout()` to completely clear credential remains.
  2. Forcibly resets the navigation stack, bringing the user back to a clean login screen.

---

## 5. Redirect Rules After Login
* **If Role == `GUARD`:** Navigate to `GUARD_DASHBOARD` and clear login backstack.
* **If Role == `RESIDENT`:** Navigate to `RESIDENT_DASHBOARD` and clear login backstack.
* **Else:** Navigate to `UNAUTHORIZED` and clear login backstack.
