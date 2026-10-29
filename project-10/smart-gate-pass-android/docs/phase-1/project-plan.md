# Smart Gate Pass Management System — Project Plan

## 1. Project Overview
The Smart Gate Pass Management System is a modern, digitized gate management solution designed for residential buildings, gated communities, and housing societies. The system replaces paper-based visitor registers and manual logs with an integrated ecosystem featuring a React Native mobile application for guard and resident users, a React-based web panel for community administrators, and a robust Spring Boot backend powered by a MySQL database.

By digitizing entry and exit logs, verifying arrivals with QR codes and OTPs, and offering real-time notifications, this system enhances safety, visibility, and operational efficiency at the community's access points.

---

## 2. Project Goal
The primary goal is to build a reliable and user-friendly digital gate pass system:
* **Guards** can easily manage visitor entries, parcel arrivals, checkouts, and credential verification using a tailored mobile app interface.
* **Residents** can instantly receive, review, and approve or reject visitor and parcel requests, pre-approve guests, and track their personal histories from their mobile app.
* **Admins** can oversee the system, manage user registries (residents, guards, flats, and buildings), view activity history, and generate reports from a central web panel.

---

## 3. Main Roles
The system supports three distinct user roles:
1. **Admin** (Web-based management)
2. **Guard** (Mobile-based entry/verification)
3. **Resident** (Mobile-based approvals/personal logs)

---

## 4. Role Details

### 4.1 Admin
Community administrators operate from the **Admin Web Panel** and have the authority to:
* **Manage Guards:** Create, update, suspend, or delete guard accounts.
* **Manage Residents:** Register and approve resident profiles, associate them with specific flats, and manage account statuses.
* **Manage Flats and Buildings:** Build the physical hierarchy of the society (e.g., Block A -> Flat 101).
* **View Records & History:** Inspect all visitor logs, parcel records, and approval tracks.
* **View Reports:** Monitor traffic analytics, gate activities, and download security logs.

### 4.2 Guard
Security guards use the **Guard Mobile App** at the gate to:
* **Add Visitor Details:** Enter names, phone numbers, vehicle numbers, purposes, and target flats.
* **Add Parcel Details:** Log carrier name (e.g., Amazon, DHL), flat number, tracking photo/number, and storage status.
* **Send Approval Requests:** Dispatch instant notifications to target residents for walk-ins or deliveries.
* **Scan QR Codes / Verify OTPs:** Quickly process pre-approved guests by scanning their QR passes or entering their 6-digit OTPs.
* **Mark Entry & Exit:** Tap to check in verified visitors and record exit timestamps upon checkout.
* **Update Parcel Status:** Transition parcels from "Held at Gate" to "Delivered".
* **View Dashboard Lists:** Monitor pending approvals, current inside visitors, and gate parcels at a glance.

### 4.3 Resident
Residents use the **Resident Mobile App** to manage security and access for their flats:
* **View Requests:** Receive real-time approval requests for incoming visitors or parcels.
* **Approve or Reject:** Grant or deny gate access instantly with a single tap.
* **Pre-Approve Guests:** Generate visitor passes for expected guests, generating a shareable 6-digit OTP or QR code.
* **View Active Passes:** Retrieve, view, and share active QR/OTP passes for expected visitors.
* **History Records:** Browse flat-specific visitor, parcel, and notification logs.

---

## 5. MVP Features (Minimum Viable Product)
The MVP will focus on core, essential features to validate the system workflow:
1. **Admin Login:** Simple email/password credential validation for administrators.
2. **Guard Login:** Secure mobile authentication for on-duty security guards.
3. **Resident Login:** Secure mobile authentication for flat residents.
4. **Guard Visitor Entry Form:** Interactive input for visitor credentials and flat selection.
5. **Guard Parcel Entry Form:** Log incoming delivery service details and flat associations.
6. **Resident Visitor Approval UI:** Real-time push-like card to approve or reject a walk-in.
7. **Resident Parcel Approval UI:** Options to approve delivery inside, hold at gate, or reject.
8. **OTP Generation Engine:** Automatic 6-digit code generator for expected visitors.
9. **QR Code Generation Engine:** Visual QR pass compiler incorporating encrypted visit data.
10. **Guard OTP Verification:** Screen to input and validate visitor OTPs against active database passes.
11. **Guard QR Verification:** Camera scanner simulator to read and validate visitor QR codes.
12. **Visitor Check-In:** Active database update marking a visitor as `Checked In` with entry timestamp.
13. **Visitor Checkout:** Fast-search mechanism to mark an inside visitor as `Checked Out` with exit timestamp.
14. **Parcel Status Updates:** Transition control from pending to held, delivered, or returned.
15. **Visitor History:** Searchable and filterable logs of previous visits.
16. **Parcel History:** Detailed record of received and hand-over parcels.
17. **Basic Admin Dashboard:** Visual cards displaying today's total entries, inside visitors, and pending parcels.
18. **Database Save System:** Robust local-first and server-side data persistence ensuring no data loss.

---

## 6. Basic Workflow
```
[Visitor/Parcel arrives at Gate]
              │
              ▼
[Guard logs entry details in Mobile App]
              │
              ▼
[System alerts Resident with App Notification]
              │
              ▼
   ┌──────────┴──────────┐
   ▼                     ▼
[Resident Approves]   [Resident Rejects] ──► [Entry Blocked & Logged]
   │
   ▼
[OTP / QR Code Generated]
   │
   ▼
[Guard Scans QR / Verifies OTP]
   │
   ▼
[Visitor/Parcel Checked In / Delivered]
   │
   ▼
[Visitor Checked Out / Status Saved in DB]
```

---

## 7. Complete Page / Screen List

### 7.1 Admin Web Panel Pages
1. **Admin Login:** Credentials input and security validation.
2. **Admin Dashboard:** High-level metrics, active guard shifts, and system health status.
3. **Manage Guards:** Guard onboarding, schedule shifts, and system access revoking.
4. **Manage Residents:** Resident approvals, unit links, and contact management.
5. **Manage Flats:** Residential directory mapping blocks, floors, and flat numbers.
6. **Visitor Records:** Master log of every visitor, including status, times, and approving flat.
7. **Parcel Records:** Master inventory of society parcel storage and delivery details.
8. **Reports:** Date-range filters for auditing and downloading historical Excel/CSV reports.

### 7.2 Guard Mobile App Screens
1. **Splash Screen:** App branding and initial token check.
2. **Guard Login:** Secure PIN or Password entry with guard shift selector.
3. **Role-Based Redirect Screen:** Central gateway distributing users based on authenticated tokens.
4. **Unauthorized Screen:** Error landing page for blocked or unregistered device connections.
5. **Guard Dashboard:** Quick action buttons (Add Visitor, Add Parcel, Verify Credential) and current gate tallies.
6. **Add Visitor Form:** Multi-field input (Name, Phone, Vehicle, Flat, Count, Purpose).
7. **Add Parcel Form:** Carrier selection, package images, flat assignment, and delivery directives.
8. **Pending Requests List:** Scrollable view of sent approvals awaiting resident responses.
9. **Verify OTP Screen:** Numeric keypad interface to check visitor-provided codes.
10. **Scan QR Screen:** Integrated camera view for parsing pre-approved digital passes.
11. **Inside Visitors List:** Active registry of guests currently in the community with checkout shortcuts.
12. **Parcel Records Feed:** Status-categorized feed of deliveries currently held at the gate or delivered.

### 7.3 Resident Mobile App Screens
1. **Splash Screen:** Branding and token verification.
2. **Resident Login:** Secure phone and password validation.
3. **Resident Dashboard:** Resident statistics, active guest passes, and current flat occupancy flags.
4. **Visitor Requests Feed:** Push-style prompts containing visitor details and Accept/Reject buttons.
5. **Parcel Requests Feed:** Direct instructions panel to direct delivery drivers (Bring Inside, Hold at Gate, Return).
6. **Add Expected Visitor (Pre-Approve):** Input form to pre-authorize guests (Guest Name, Visit Date, Expected Time).
7. **My Visitors List:** Scrollable list of past and upcoming scheduled guests.
8. **My Parcels List:** Active inventory of packages held at the main gate, completed deliveries, and returns.
9. **OTP / QR Pass Display:** Visual display card containing active QR code and clear 6-digit numeric OTP for sharing.
10. **Notification History:** Audited log of all system and gate security alerts.

---

## 8. Phase 1 Scope Boundary
Phase 1 focuses exclusively on **architectural planning, folder organization, schema design, and API mapping**. No functional application code is generated during Phase 1. This planning document guarantees a smooth development transition into Phase 2 (Authentication) and subsequent implementation phases.
