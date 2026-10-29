# Phase 2: Authentication Plan

This document details the authentication specifications, credentials, and screen behaviors implemented for Phase 2 of the **Smart Gate Pass Management System**.

---

## 1. Phase 2 Goal
The primary goal of Phase 2 is to design and implement a secure, state-driven **Authentication + Role-Based Navigation** layer. This layer decides whether a user is logged in, parses their credential profile, and routes them to the correct dashboard while preventing cross-role route exploitation.

---

## 2. Authentication Scope
For the mobile MVP workspace, we support role authentication for:
1. **GUARD**
2. **RESIDENT**

*Note: The ADMIN role exists in constants for future modular web portal expansion, but is out-of-scope for the native mobile application MVP.*

---

## 3. Mock Login Credentials
The following credentials are encrypted and validated against the local API-ready `AuthService` state machine:

### A. Security Guard Profile
* **Mobile Number:** `9999999999`
* **Password:** `guard123`
* **Role:** `GUARD`
* **Assigned Workspace:** Guard Dashboard
* **Default Name:** "Guard User"
* **Mock JWT Token:** `mock-guard-token`

### B. Resident Profile
* **Mobile Number:** `8888888888`
* **Password:** `resident123`
* **Role:** `RESIDENT`
* **Assigned Workspace:** Resident Dashboard (Unit B-403)
* **Default Name:** "Resident User"
* **Mock JWT Token:** `mock-resident-token`

---

## 4. Login Screen Behavior
The Login Screen preserves the exact layout lock from Phase 1.5, with functional extensions:
* **Fields:** Standard `Mobile or Email` text input and hidden `Password` field.
* **Error States:**
  * If fields are empty when submitting, display: `Mobile number or email and password are required`
  * If credentials mismatch, display: `Invalid mobile number or password`
* **Dynamic Quick Logins:** Two subtle shortcut buttons are positioned at the bottom of the card block, allowing testers to tap and prefill the exact credentials (`9999999999`/`guard123` and `8888888888`/`resident123`) seamlessly.

---

## 5. Token Storage Plan
Stored credentials and active sessions are persisted using Android `SharedPreferences` via the custom `TokenStorage` singleton.
* Keeps state between device restarts so the user does not have to log in on every boot.
* Features a synchronized in-memory fallback layer in case of premature storage calls before container context binds.

---

## 6. Logout Behavior
* Clicking **Logout** on either Guard or Resident workspaces triggers `AuthService.logout()`.
* Automatically wipes tokens, saved user objects, and unit indices.
* Resets state variables and forces redirection back to the clean `Login Screen` instantly.

---

## 7. Out-of-Scope Auth Features
The following features are designated for subsequent milestones:
* Real JWT verification from a production server (Phase 5).
* Biometric storage keys and fingerprint signatures.
* Password reset/recovery forms.
* Push notification routing registers.
