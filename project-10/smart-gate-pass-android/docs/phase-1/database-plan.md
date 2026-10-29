# Smart Gate Pass Management System — Database Plan

## 1. Database Overview
The Smart Gate Pass Management System utilizes a relational MySQL database to record and trace security logs, flat occupancies, and operational statuses. It relies on strict foreign key constraints to preserve referential integrity across the system. 

To maintain clean relational records, the primary `users` table handles master account data, while specialized tables like `residents` and `guards` store role-specific credentials.

---

## 2. Table Blueprint Map

Below is the list of tables scheduled for the system, along with their key identifiers and structural relationships:

| # | Table Name | Purpose | Primary Key | Critical Foreign Keys |
|---|---|---|---|---|
| **1** | `users` | Unified core accounts table for identity & security credentials. | `id` | *None* |
| **2** | `residents` | Stores resident-specific profile information. | `id` | `user_id` -> `users(id)`, `flat_id` -> `flats(id)` |
| **3** | `guards` | Stores guard-specific badge details. | `id` | `user_id` -> `users(id)` |
| **4** | `flats` | Society structural map mapping blocks, floors, and numbers. | `id` | *None* |
| **5** | `visitors` | Logs guest information, vehicle details, and current statuses. | `id` | `flat_id` -> `flats(id)`, `guard_id` -> `users(id)` |
| **6** | `parcels` | Logs incoming parcel properties, statuses, and photos. | `id` | `flat_id` -> `flats(id)`, `guard_id` -> `users(id)` |
| **7** | `approvals` | Tracks historical resident decisions (Accept, Reject). | `id` | `resident_id` -> `users(id)` |
| **8** | `otp_verifications` | Manages expiration timers and status of generated OTPs. | `id` | `visitor_id` -> `visitors(id)` |
| **9** | `qr_passes` | Stores raw generated QR data tokens. | `id` | `visitor_id` -> `visitors(id)` |
| **10**| `notifications` | Audit trail of sent alert cards and badges. | `id` | `user_id` -> `users(id)` |
| **11**| `activity_logs` | Immutable security log tracking admin or guard actions. | `id` | `user_id` -> `users(id)` |

---

## 3. Detailed Table Specifications

### 3.1 `users`
* **Purpose:** Core login and profile details. Maintains account state (Active, Inactive).
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `email` (VARCHAR(150), UNIQUE, NULLABLE) - Optional for guards, required for admins/residents.
  * `phone` (VARCHAR(20), UNIQUE, NOT NULL) - Used as primary mobile login identifier.
  * `password` (VARCHAR(255), NOT NULL) - BCrypt encrypted.
  * `full_name` (VARCHAR(100), NOT NULL)
  * `role` (ENUM('ADMIN', 'GUARD', 'RESIDENT'), NOT NULL)
  * `is_active` (BOOLEAN, DEFAULT TRUE)
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  * `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### 3.2 `flats`
* **Purpose:** Structure map of physical units within the gated society.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `block_name` (VARCHAR(50), NOT NULL) - e.g., "A Block", "Royal Wing"
  * `floor_number` (INT, NOT NULL) - e.g., 1, 12
  * `flat_number` (VARCHAR(20), NOT NULL) - e.g., "101", "1204-B"
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.3 `residents`
* **Purpose:** Resident profiles. Connects a user account to their physical residence flat.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `user_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE CASCADE)
  * `flat_id` (BIGINT, FOREIGN KEY -> `flats.id`, ON DELETE SET NULL)
  * `resident_type` (ENUM('OWNER', 'TENANT'), DEFAULT 'OWNER')
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.4 `guards`
* **Purpose:** Guard directory tracking shift parameters.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `user_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE CASCADE)
  * `employee_id` (VARCHAR(50), UNIQUE, NOT NULL) - e.g., "G-4091"
  * `shift` (ENUM('DAY', 'NIGHT'), DEFAULT 'DAY')
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.5 `visitors`
* **Purpose:** Visitor log, registering entry metadata, checkpoints, and current status.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `flat_id` (BIGINT, FOREIGN KEY -> `flats.id`, ON DELETE RESTRICT)
  * `guard_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE RESTRICT) - Guard who logged entry.
  * `visitor_name` (VARCHAR(100), NOT NULL)
  * `phone_number` (VARCHAR(20), NOT NULL)
  * `vehicle_number` (VARCHAR(30), NULLABLE)
  * `visitor_count` (INT, DEFAULT 1)
  * `purpose` (VARCHAR(255), NOT NULL) - e.g., "Guest", "Maintenance"
  * `status` (VARCHAR(50), NOT NULL) - Refer to section 4.1 for valid states.
  * `entry_time` (TIMESTAMP, NULLABLE) - Set when status becomes 'Checked In'.
  * `exit_time` (TIMESTAMP, NULLABLE) - Set when status becomes 'Checked Out'.
  * `is_pre_approved` (BOOLEAN, DEFAULT FALSE)
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  * `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### 3.6 `parcels`
* **Purpose:** Parcel records, verifying packaging tags and handover checkpoints.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `flat_id` (BIGINT, FOREIGN KEY -> `flats.id`, ON DELETE RESTRICT)
  * `guard_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE RESTRICT)
  * `delivery_service` (VARCHAR(100), NOT NULL) - e.g., "Amazon", "FedEx"
  * `tracking_number` (VARCHAR(100), NULLABLE)
  * `package_photo_url` (VARCHAR(255), NULLABLE)
  * `status` (VARCHAR(50), NOT NULL) - Refer to section 4.2 for valid states.
  * `received_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  * `delivered_at` (TIMESTAMP, NULLABLE) - Timestamp of final resident handover.

### 3.7 `approvals`
* **Purpose:** Tracks individual resident decisions for auditable confirmation.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `reference_type` (ENUM('VISITOR', 'PARCEL'), NOT NULL)
  * `reference_id` (BIGINT, NOT NULL) - Maps to `visitors.id` or `parcels.id`.
  * `resident_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE CASCADE) - Resident who decided.
  * `decision` (ENUM('APPROVED', 'REJECTED'), NOT NULL)
  * `remarks` (VARCHAR(255), NULLABLE)
  * `decided_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.8 `otp_verifications`
* **Purpose:** Manages the generation, lifecycle, and validation of 6-digit verification PINs.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `visitor_id` (BIGINT, FOREIGN KEY -> `visitors.id`, ON DELETE CASCADE)
  * `otp_code` (VARCHAR(6), NOT NULL) - 6-digit numeric pass.
  * `expires_at` (TIMESTAMP, NOT NULL)
  * `is_used` (BOOLEAN, DEFAULT FALSE)
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.9 `qr_passes`
* **Purpose:** Stores encrypted or structured secure tokens for QR-based visitor check-ins.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `visitor_id` (BIGINT, FOREIGN KEY -> `visitors.id`, ON DELETE CASCADE)
  * `qr_token` (VARCHAR(255), UNIQUE, NOT NULL) - UUID/SHA hash.
  * `expires_at` (TIMESTAMP, NOT NULL)
  * `is_scanned` (BOOLEAN, DEFAULT FALSE)
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.10 `notifications`
* **Purpose:** Stores flat and user notifications to show inside the app notification history.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `user_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE CASCADE)
  * `title` (VARCHAR(150), NOT NULL)
  * `body` (TEXT, NOT NULL)
  * `type` (VARCHAR(50), NOT NULL) - e.g., "VISITOR_APPROVAL", "PARCEL_ARRIVED"
  * `is_read` (BOOLEAN, DEFAULT FALSE)
  * `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3.11 `activity_logs`
* **Purpose:** Immutable system audit trail for security logs and diagnostics.
* **Fields:**
  * `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
  * `user_id` (BIGINT, FOREIGN KEY -> `users.id`, ON DELETE SET NULL)
  * `action` (VARCHAR(150), NOT NULL) - e.g., "GUARD_LOGIN", "VISITOR_BLOCKED"
  * `ip_address` (VARCHAR(45), NULLABLE)
  * `details` (TEXT, NULLABLE)
  * `logged_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

---

## 4. Finite Status Enums

### 4.1 Visitor Status Values
* `Pending Approval` - Sent to resident, awaiting response.
* `Approved` - Resident approved, waiting at gate for verification.
* `Rejected` - Resident denied entry.
* `OTP Generated` - Pass created, waiting for visitor to present OTP.
* `QR Generated` - Pass created, waiting for QR code to be scanned.
* `OTP Verified` - Pin successfully matched, entry allowed.
* `QR Verified` - Code scanned successfully, entry allowed.
* `Checked In` - Visitor has entered society grounds.
* `Checked Out` - Visitor has left society grounds.
* `Expired` - Expected arrival window has lapsed without entry.
* `Blocked` - Visitor flagged as restricted by community management.

### 4.2 Parcel Status Values
* `Pending Approval` - Package arrived at gate, resident alerted.
* `Approved` - Resident approved delivery.
* `Rejected` - Resident rejected parcel.
* `Held at Gate` - Resident requested parcel to be kept at security desk.
* `Waiting for Resident Pickup` - Held at gate, pending resident collection.
* `Delivery Inside` - Guard authorized courier to deliver directly to flat.
* `Delivered to Resident` - Parcel successfully handed over.
* `Returned` - Courier returned package on resident's request.
* `Cancelled` - Cancelled delivery.
