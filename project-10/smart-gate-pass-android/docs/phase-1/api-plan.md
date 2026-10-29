# Smart Gate Pass Management System — API Plan

## 1. API Architecture Design
The backend communicates with client apps (Admin Web and React Native Mobile) via a stateless RESTful JSON API. 
All protected API endpoints require a bearer authentication header: `Authorization: Bearer <JWT_TOKEN>`.

---

## 2. Master API Routes

### 2.1 Authentication Module
Secure session initialization and user registration validation.

#### `POST /api/auth/login`
* **Purpose:** Authenticates credentials and returns a secure JWT token.
* **Allowed Role:** Public (Unauthenticated)
* **Request Contract:**
  * `phone` (String, required)
  * `password` (String, required)
* **Response Contract:**
  * `token` (String) - JWT session key.
  * `user` (Object) - Containing `id`, `fullName`, `phone`, and `role`.

---

### 2.2 Admin Management Module
Admin-exclusive endpoints for community registries.

#### `GET /api/admin/dashboard`
* **Purpose:** Retrieves statistical counts for dashboard widgets.
* **Allowed Role:** `ADMIN`
* **Response Contract:**
  * `activeGuards` (Int)
  * `todayEntries` (Int)
  * `insideVisitors` (Int)
  * `heldParcels` (Int)

#### `POST /api/admin/guards`
* **Purpose:** Register and onboard a new security guard.
* **Allowed Role:** `ADMIN`
* **Request Contract:**
  * `fullName` (String), `phone` (String), `password` (String), `employeeId` (String), `shift` (String)

#### `POST /api/admin/residents`
* **Purpose:** Onboard and configure a new resident account, link to a flat.
* **Allowed Role:** `ADMIN`
* **Request Contract:**
  * `fullName` (String), `phone` (String), `password` (String), `flatId` (Long), `residentType` (String)

---

### 2.3 Visitor Management Module
Endpoints supporting visitor registration, logs, and pre-approvals.

#### `POST /api/visitors`
* **Purpose:** Creates a new visitor log entry (triggered by guard on walk-in arrival).
* **Allowed Role:** `GUARD`
* **Request Contract:**
  * `visitorName` (String), `phoneNumber` (String), `vehicleNumber` (String, optional), `visitorCount` (Int), `purpose` (String), `flatId` (Long)
* **Response Contract:** Created visitor log record with ID and initial status (`Pending Approval`).

#### `GET /api/visitors`
* **Purpose:** Fetches visitor logs.
  * *For Guard:* Shows all visitor entries registered today.
  * *For Resident:* Shows visitor logs linked strictly to their flat.
  * *For Admin:* Returns all community historical logs (filterable by dates, status).
* **Allowed Role:** `ADMIN`, `GUARD`, `RESIDENT`
* **Response Contract:** Array of visitor records.

---

### 2.4 Parcel Management Module
Package logging and state management endpoints.

#### `POST /api/parcels`
* **Purpose:** Logs an arriving package at the gate.
* **Allowed Role:** `GUARD`
* **Request Contract:**
  * `deliveryService` (String), `trackingNumber` (String, optional), `flatId` (Long), `packagePhotoUrl` (String, optional)
* **Response Contract:** Created parcel record with ID and initial status (`Pending Approval`).

#### `GET /api/parcels`
* **Purpose:** Fetches parcel records.
  * *For Guard:* List of packages currently held at the gate.
  * *For Resident:* List of packages addressed to their flat.
  * *For Admin:* Master log of all deliveries.
* **Allowed Role:** `ADMIN`, `GUARD`, `RESIDENT`
* **Response Contract:** Array of parcel records.

---

### 2.5 Approval Module
Endpoints where residents confirm gate requests.

#### `POST /api/approvals/{id}/approve`
* **Purpose:** Approves a pending entry or delivery.
* **Allowed Role:** `RESIDENT` (System ensures resident's ID maps to the flat of target record `{id}`)
* **Request Contract:**
  * `remarks` (String, optional)
  * `referenceType` (String: 'VISITOR' / 'PARCEL')
* **Response Contract:** Updated record showing new status (`Approved` / `Held at Gate` / `Delivery Inside`).

#### `POST /api/approvals/{id}/reject`
* **Purpose:** Rejects a pending entry or delivery.
* **Allowed Role:** `RESIDENT`
* **Request Contract:**
  * `remarks` (String, optional)
  * `referenceType` (String: 'VISITOR' / 'PARCEL')
* **Response Contract:** Updated record showing new status (`Rejected`).

---

### 2.6 OTP and QR Verification Module
Validation gates for pre-approved or expected arrivals.

#### `POST /api/otp/verify`
* **Purpose:** Matches user-entered OTP against active pre-approvals.
* **Allowed Role:** `GUARD`
* **Request Contract:**
  * `otpCode` (String, 6 digits)
* **Response Contract:**
  * `valid` (Boolean)
  * `visitorDetails` (Object) - Name, purpose, flat number, and update to status `Checked In`.

#### `POST /api/qr/verify`
* **Purpose:** Validates visual QR token scans.
* **Allowed Role:** `GUARD`
* **Request Contract:**
  * `qrToken` (String)
* **Response Contract:**
  * `valid` (Boolean)
  * `visitorDetails` (Object) - Name, purpose, flat number, and update to status `Checked In`.

#### `POST /api/visitors/pre-approve`
* **Purpose:** Generates a pre-approved digital pass for expected guests.
* **Allowed Role:** `RESIDENT`
* **Request Contract:**
  * `visitorName` (String), `expectedDate` (String/Date)
* **Response Contract:**
  * `otpCode` (String, 6 digits)
  * `qrToken` (String)
  * `expiresAt` (String)
