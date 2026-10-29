# Phase 2: Authentication State Flows

This document maps the state lifecycles and step-by-step navigation flows that govern user sessions.

---

## 1. Splash Auth Check Flow
When the application launches, the Splash Screen checks the secure local session storage:

```text
       [ App Boot Up ]
              │
              ▼
    [ Splash Screen Shows ]
              │
      (Loading Animation)
              │
              ▼
     [ Read TokenStorage ]
              │
      Is Session Valid?
      /               \
     Yes               No
     /                   \
    ▼                     ▼
[ Get Active Role ]    [ Route to LOGIN ]
  /        \
GUARD    RESIDENT
 /            \
▼              ▼
[GUARD_DASH] [RES_DASH]
```

---

## 2. Login Success Flow
1. User enters mobile number and password on the Login form.
2. Taps **Login** button.
3. Form disables inputs and fires `AuthService.login(identifier, password)`.
4. Mock auth matches profile, generates virtual token, and invokes `TokenStorage.saveUser()`.
5. Success callback fires.
6. App checks role and navigates to the target dashboard (`GUARD_DASHBOARD` or `RESIDENT_DASHBOARD`), completely popping the login route off the stack.

---

## 3. Login Failure Flow
1. User enters invalid credentials.
2. Form submits to `AuthService`.
3. Validation fails.
4. `AuthService` returns a descriptive error string: `"Invalid mobile number or password"`.
5. Login Screen catches the failure callback and updates local error-state variables.
6. Displays the red error pill beneath inputs. Inputs re-enable, allowing corrections.

---

## 4. Saved Token Flow
* Upon successful credentials matching, `TokenStorage` records:
  * `auth_token`
  * `user_id`, `user_name`, `user_mobile`, `user_role`, and unit index (flat).
* On subsequent cold starts, the Splash Screen immediately bypasses Login and boots into the correct dashboard in under 1 second.

---

## 5. Logout Flow
1. Tapping **Logout** in the Header or Profile menus of either dashboard invokes `AuthService.logout()`.
2. `TokenStorage.clearAuthData()` executes, invoking SharedPreferences `.remove()` and wiping in-memory session structures.
3. Host NavGraph detects state clearance, resets the backstack, and routes to `LOGIN` immediately.
4. Active tabs and backstacks are securely destroyed.
