# Smart Gate Pass Management System — Architecture Plan

## 1. Overall System Architecture
The Smart Gate Pass Management System is constructed using a decoupled, multi-tier architecture to ensure high security, low latency, and smooth system operations. The architecture is optimized to support real-time interactions between security guards at the gate and residents in their homes.

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        Admin Web Panel          │       │        React Native App         │
│         (React + Vite)          │       │       (Guard & Resident)        │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 │              HTTPS (JSON)               │
                 └───────────────────┬─────────────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │    Spring Boot REST API      │
                      │      (Backend Server)        │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │       MySQL Database         │
                      │     (Data Persistence)       │
                      └──────────────────────────────┘
```

---

## 2. Platform Architecture Breakdown

### 2.1 Mobile App Architecture (Main Focus)
The React Native mobile app serves both **Guard** and **Resident** roles. It is built as a single application binary that dynamically adjusts its interface, capabilities, and navigation flows based on the authenticated user's role.

* **Framework:** React Native (utilizing standard JavaScript/ES6+ or TypeScript).
* **Navigation:** `React Navigation` (v6 or newer) utilizing Stack, Tab, and Custom Switch Navigators.
* **State Management:** React Context API or Redux Toolkit for managing session state, credentials, and notification status.
* **Storage:** `AsyncStorage` for persisting JWT tokens, user role settings, and local cache.
* **API Service Layer:** `Axios` instance configured with request/response interceptors to automatically append Authorization Bearer headers and gracefully handle expired sessions (401 errors).
* **Real-time Handling:** In-app polling or Server-Sent Events (SSE) for checking pending approvals during the MVP.

### 2.2 Admin Web Panel Architecture
A lightweight, modern single-page application (SPA) focused on system dashboard efficiency, onboarding, and report compiling.
* **Framework:** React.js bootstrapped with Vite.
* **Styling:** Tailwind CSS for responsive grid layouts, color palettes, and utility classes.
* **Routing:** React Router v6.
* **State Management:** Zustand or React Context for keeping lightweight user credentials.

### 2.3 Backend Architecture
A microservice-ready modular monolith built using the enterprise-grade Spring framework.
* **Core Framework:** Spring Boot (v3.x).
* **Security:** Spring Security with stateless JSON Web Token (JWT) authentication.
* **Data Access:** Spring Data JPA with Hibernate.
* **DTO Pattern:** Structured Data Transfer Objects to separate JPA database entities from HTTP API request/response contracts.
* **Business Logic Layer:** Decoupled Service layers containing strict validation rules, OTP generation algorithms, and state transition validation.

### 2.4 Database Architecture
* **Database Engine:** MySQL (v8.0+).
* **Connection Pooling:** HikariCP (bundled with Spring Boot) for managing database connections.
* **Relationships:** Strict Referential Integrity enforced via Foreign Keys, ensuring that actions on flats or users cascade safely without dangling references.

---

## 3. Module Responsibility Plan

The system logic is divided into ten core functional modules. Below is the mapping of responsibilities across components:

| # | Module | Mobile App Responsibility | Backend Responsibility | Web Panel Responsibility |
|---|---|---|---|---|
| **1** | **Authentication** | Stores JWT token, handles login forms, clears cache on logout. | Validates credentials, issues JWT tokens, handles password resets. | Renders admin login page, saves session in sessionStorage. |
| **2** | **Admin Mgmt** | *None (Out of scope).* | CRUD endpoints for Guards, Residents, Flats, and Buildings. | Renders onboarding grids, search filters, and status switches. |
| **3** | **Guard Actions** | Entry forms, lists pending requests, scans QR, inputs OTP. | Validates entries, matches active shifts, pushes logs. | View logs of guard entries/exits in real-time. |
| **4** | **Resident Actions** | Approval buttons, logs, expected visitor creation forms. | Maps residents to flats, exposes private history endpoints. | Handles registration approvals for new residents. |
| **5** | **Visitor Mgmt** | Displays visitor profiles, status badges, and flat routes. | Manages state machine transitions for visitor records. | Exposes master visitor log filters and search bar. |
| **6** | **Parcel Mgmt** | Delivery details input, parcel status transition buttons. | Holds parcel queue, manages state transitions for packages. | Master log of all deliveries, society parcel audit. |
| **7** | **QR Code Module** | Compiles QR codes visually from encrypted token payloads. | Generates pass-tokens containing visit metadata. | *None.* |
| **8** | **OTP Module** | Renders numeric verification form with countdown timers. | Generates, hashes, stores, and validates 6-digit OTP codes. | *None.* |
| **9** | **Notification** | Renders in-app system alerts, badges, and push-like banners. | Handles notification triggers, saves historical alerts in DB. | System-wide broadcasts and urgent security alerts. |
| **10**| **History & Reports**| Scrollable infinite-scroll feeds of previous user events. | Aggregates logs, formats report streams (CSV/Excel queries). | Admin-exclusive download panels for system audits. |

---

## 4. Proposed Folder Structure (Monorepo Layout)

The project will use a monorepo structure to keep the backend, frontend, database scripts, and design documentation in a unified repository.

```
smart-gate-pass-system/
├── admin-web/
│   ├── public/
│   └── src/
│       ├── assets/             # Branding logos, background SVGs
│       ├── components/         # Shared UI (Buttons, Cards, Modals)
│       ├── context/            # AuthContext for session management
│       ├── pages/              # Dashboard, Guards, Residents, Flats, Records
│       ├── routes/             # AppRouter, PrivateRoute wrapper
│       ├── services/           # Axios-based API calls (adminService, authService)
│       └── utils/              # Formatter scripts, date parsers
│
├── mobile-app/
│   └── src/
│       ├── assets/             # In-app icons, splash art, custom fonts
│       ├── components/
│       │   ├── common/         # CustomText, CustomInput, LoadingSpinner
│       │   ├── cards/          # VisitorRequestCard, StatusBadge, HistoryCard
│       │   ├── forms/          # AddVisitorForm, AddParcelForm, VerifyOtpForm
│       │   └── buttons/        # PrimaryButton, IconButton, MultiStateButton
│       ├── navigation/
│       │   ├── AuthNavigator.js       # Splash, Login
│       │   ├── GuardNavigator.js      # Dashboard, Scan, OTP, History
│       │   ├── ResidentNavigator.js   # Dashboard, Approvals, Passes, History
│       │   └── RootNavigator.js       # Main switch logic based on user token
│       ├── screens/
│       │   ├── auth/           # LoginScreen, UnauthorizedScreen
│       │   ├── guard/          # GuardDashboard, AddVisitor, ScanQR, InsideVisitors
│       │   └── resident/       # ResidentDashboard, Approvals, ExpectedVisitor
│       ├── services/
│       │   ├── api.js                 # Central Axios interceptor setup
│       │   ├── authService.js         # Login, logout, session refresh
│       │   ├── visitorService.js      # Request creation, approvals, scans, OTPs
│       │   ├── parcelService.js       # Deliveries, updates, held queue
│       │   └── notificationService.js # In-app notification checks
│       ├── storage/
│       │   └── tokenStorage.js        # Secure storage wrappers for AsyncStorage
│       ├── constants/
│       │   ├── roles.js               # USER_ROLES object (ADMIN, GUARD, RESIDENT)
│       │   ├── status.js              # Visitor/Parcel statuses (PENDING, APPROVED...)
│       │   └── routes.js              # Screen name identifiers for navigation
│       ├── utils/
│       │   └── helpers.js             # General utilities (phone validation, date parser)
│       └── App.js                     # Root entry point configuring Context and Navigation
│
├── backend/
│   ├── src/main/java/com/example/gatepass/
│   │   ├── controller/         # AuthController, GuardController, ResidentController
│   │   ├── service/            # AuthService, VisitorService, NotificationService
│   │   ├── repository/         # UserRepository, FlatRepository, LogRepository
│   │   ├── entity/             # User.java, Flat.java, VisitorRecord.java
│   │   ├── dto/                # LoginRequest, VisitorDto, ApiResponse
│   │   ├── security/           # JwtFilter, SecurityConfig, UserDetailsImpl
│   │   └── config/             # ModelMapperConfig, WebMvcConfig
│   └── src/main/resources/
│       ├── application.yml     # Database credentials, security settings
│       └── db/migration/       # Liquibase or Flyway schema versioning files
│
├── database/
│   ├── schema.sql              # Clean table creation definitions
│   └── seed.sql                # Initial test dataset (Admin, Guards, Flats)
│
├── docs/
│   ├── phase-1/
│   │   ├── project-plan.md
│   │   ├── architecture-plan.md
│   │   ├── database-plan.md
│   │   ├── api-plan.md
│   │   └── phase-1-summary.md
│   ├── changelog.md
│   └── master-project-index.md
└── README.md
```
