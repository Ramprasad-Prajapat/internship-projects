

> **IMPLEMENTATION STATUS (updated 2026-06-22):** This document is the original project
> plan/spec. The project is currently built **frontend-only (mock mode)** with React +
> Vite, mock/localStorage auth, and 5 working demo accounts. Public pages, all 5 role
> dashboards, the feature pages, and the **store-driven Employee Profile control center**
> are all implemented as frontend mocks. **Every role is now a full control center on the
> shared mock store** (via reusable derive/write service layers):
>
> * **Employee** — Mark Attendance now does **repeatable face Sign-In / Sign-Out** (each scan
>   toggles state; scan-after-sign-out = new session) with a live "Working time" clock, a
>   today session log (private `attendanceSessions` collection), and a richer status panel;
>   plus My Attendance / Monthly Summary / Leave / Corrections / Face Registration & Test.
> * **Manager** — Team Monitoring + Approval Dashboard (team attendance, late / not-checked-in,
>   monthly snapshot, activity timeline, alerts, and leave / correction / overtime approvals
>   that persist to `localStorage` — via `services/managerService.js`), a manager-only **live
>   team panel on `/home`**, and a dedicated **Manager Profile** (`/manager/profile`).
> * **HR** — People Operations + Attendance Control Center (`services/hrService.js`): dept
>   operations, pending-action queue with inline leave approve/reject, HR Home panel, HR Profile.
> * **Branch Admin** — Branch Operations + Attendance Control Center (`services/branchAdminService.js`):
>   branch KPIs, department/shift summaries, branch location/radius card, Home panel, profile.
> * **Super Admin** — Global Control + Branch Monitoring + Role Management Center
>   (`services/superAdminService.js`): 10 global KPIs, System Alerts Center, Branch Performance,
>   Role & Access, Data Quality Checker, Home panel, profile — **plus a Website Feature Control
>   Center** (`/super-admin/feature-control`): a 42-entry feature-flag catalog (enable/disable,
>   show/hide, per-role access) enforced by a `FeatureGate` on every route + the sidebar,
>   persisted to `localStorage` (`services/featureControlService.js`).
>
> The public landing page has also been polished (auto-scrolling branch/roadmap marquees,
> balanced feature/problem/role grids, larger face-scan workflow cards), and a **fix pass**
> resolved the High/Medium issues found in QA testing (logged in `CHANGELOG.md`).
>
> Temporary data comes from **mock data + `localStorage`/`sessionStorage` + frontend state**.
> **Backend/database are not connected, Firebase runtime is not connected, and no API calls
> are added — those remain future work** and can be added later by replacing the
> service/mock-data layer. See `README.md` (current status & roadmap), `CHANGELOG.md`
> (history), `CLAUDE.md` (working rules + Git safety), and
> `docs/PROJECT_CODEBASE_INDEX.md` (codebase map) for the current build state.

## Current Project Status

_Last verified: 2026-06-23 — local run/test. Docs-only update; no code, UI, or logic changed._

- **Runs successfully locally.** Verified launch path: `scripts/auto-run.ps1` (reuse-aware — reuses a running dev server or starts one; no duplicates).
- **Dev server:** Vite on `http://localhost:5173/`.
- **Employee login works** — `employee@demo.com` / `demo123` → redirects to `/home`; the mock session is created in `localStorage` (`ft_session_user`).
- **Employee Dashboard** renders correctly in the redesigned dark UI (no blank screen / broken layout).
- **Face Check-In** renders correctly in the redesigned UI; the **Simulate Scan** mock flow works.
- **Mock attendance mutates** in `localStorage` — the `attendanceSessions` count changed from **2 → 3** during testing.
- **Face scan UI showed:** Face Match **Matched**, score **~90%**, Location **Checked (mock)**, signed-in toast/status visible.
- **Manually verified** dashboard + face-check-in screenshots — no blank/broken pages in tested routes.
- **Run/test hygiene:** a temporary test server is stopped cleanly and **port 5173 is freed** afterwards; the user's manually-run dev server is **reused and left untouched** (see `CLAUDE.md` §0).
- **Run/test tasks change no app/source files** (browser drivers run from a temp folder).
- **Version control:** the UI redesign, `scripts/auto-run.ps1`, and Super Admin branch controls are committed locally (`c79e42a`); this status-doc update is currently **uncommitted**. Local-only repo — nothing pushed.

### Verification summary

| Area | Status |
| --- | --- |
| App launch (`scripts/auto-run.ps1`) | Passed |
| Employee login (`employee@demo.com`) | Passed |
| Employee dashboard UI (redesigned) | Passed |
| Face Check-In UI (redesigned) | Passed |
| Mock attendance mutation (2 → 3) | Passed |
| localStorage / session persistence | Passed |
| Dev server cleanup (test server) | Passed |
| Port 5173 cleanup | Passed |
| Build | Last known green: 1632 modules, JS 587.52 kB / gzip 145.37 kB (2026-06-23); not re-run in this docs-only update |

# =========================================
# SECTION: Face_Track.md
# =========================================

# FaceTrack AI — Smart Employee Attendance Management System

## Complete Project Report

### AI-Based Face Recognition and Location-Based Employee Attendance Platform

---

## Project Title

**FaceTrack AI — Smart Employee Attendance Management System**

## Project Category

* AI-Based Attendance Management System
* Face Recognition Attendance System
* Location-Based Employee Attendance System
* HR Workforce Management Platform
* Multi-Branch Employee Monitoring System

## Project Type

**Industry-Level Advanced Internship Project**

---

<div style="page-break-after: always;"></div>

# Table of Contents

1. Executive Summary
2. Project Overview
3. Industry Background
4. Real Industry Problems
5. Proposed Solution
6. Project Objectives
7. Target Users
8. User Roles and Responsibilities
9. Functional Requirements
10. Non-Functional Requirements
11. System Workflow
12. Face Recognition Workflow
13. Location Tracking Workflow
14. Attendance Logic
15. Liveness Detection Plan
16. System Modules
17. Database Design
18. UI Pages Planning
19. Dashboard Features
20. Reports
21. Notifications
22. Privacy and Security
23. Advantages
24. Limitations
25. Future Scope
26. Development Roadmap
27. Testing Plan
28. Deployment Plan
29. Project Innovation
30. Conclusion
31. Final Feature List
32. Database Collection Summary
33. UI Page Summary
34. AI Coding Tool Prompt
35. Short Project Pitch
36. Demo Presentation Points

---

<div style="page-break-after: always;"></div>

# 1. Executive Summary

**FaceTrack AI — Smart Employee Attendance Management System** is an AI-based HR attendance platform designed to automate employee attendance using **Face Recognition and Location Tracking**.

Traditional attendance systems such as manual registers, Excel sheets, RFID cards, and fingerprint devices have several limitations. Employees can mark proxy attendance, HR teams spend too much time preparing reports, payroll calculations may become inaccurate, and multi-branch companies face difficulty in monitoring attendance centrally.

FaceTrack AI solves these problems by allowing employees to mark attendance through a laptop or webcam camera. The system verifies the employee’s face, checks the employee’s location, suggests check-in or check-out, calculates late arrival, total working hours, overtime, and updates the HR/Admin dashboard in real time.

The system includes multiple roles such as **Super Admin, Branch Admin, HR, Manager, and Employee**. It also includes advanced features such as live attendance dashboard, suspicious scan logs, low confidence manual approval, attendance correction requests, reports export, employee consent, and privacy-aware biometric data handling.

This project is suitable for offices, IT companies, factories, warehouses, hospitals, colleges, institutions, and multi-branch organizations.

---

# 2. Project Overview

## 2.1 Basic Project Information

| Field            | Details                                                    |
| ---------------- | ---------------------------------------------------------- |
| Project Name     | FaceTrack AI — Smart Employee Attendance Management System |
| Project Type     | Industry-Level Advanced Internship Project                 |
| Project Category | AI + HR Technology + Attendance Management                 |
| Main Technology  | Face Recognition + Location Tracking                       |
| Frontend         | React.js                                                   |
| Database         | Firebase Firestore                                         |
| Authentication   | Firebase Authentication                                    |
| Hosting          | Firebase Hosting / Vercel                                  |
| Target Industry  | Multi-Branch Corporate Companies                           |
| Target Users     | Super Admin, Branch Admin, HR, Manager, Employee           |
| Main Purpose     | Automate employee attendance and reduce proxy attendance   |
| Future Upgrade   | Python FastAPI AI microservice + liveness detection        |

## 2.2 Project Description

FaceTrack AI is a smart employee attendance system where employees can mark attendance using face recognition through a webcam. The system matches the scanned face with registered employee face data and verifies the employee’s location before marking attendance.

The system can handle check-in, check-out, late marking, overtime, absent status, correction requests, and attendance reports. It also provides a professional dashboard for HR and Admin users to monitor employee attendance in real time.

---

# 3. Industry Background

Employee attendance is an important part of every organization. Companies use attendance records for salary calculation, employee discipline, productivity analysis, workforce planning, and compliance.

Common attendance methods used today include:

* Manual attendance register
* Excel sheet attendance
* RFID card attendance
* Fingerprint biometric attendance
* QR code attendance
* Mobile app attendance
* HRMS-based attendance systems

However, many of these systems still have limitations. Manual systems are slow and error-prone. RFID cards can be shared between employees. Fingerprint devices may create hygiene issues and device maintenance problems. Basic mobile attendance may not verify the actual identity of the employee properly.

Modern organizations need a smarter, faster, and more secure attendance system that can verify both **employee identity** and **employee location**.

FaceTrack AI is designed to solve this problem using AI-based face recognition and location verification.

---

# 4. Real Industry Problems

## 4.1 Proxy Attendance

Proxy attendance means one employee marks attendance for another employee. This creates false attendance records and affects company productivity.

## 4.2 Buddy Punching

Buddy punching happens when an employee uses another employee’s card, ID, or login to mark attendance. This is common in card-based or manual systems.

## 4.3 Manual Workload for HR

Manual attendance tracking increases HR workload. HR teams have to check attendance, calculate late marks, prepare monthly reports, and handle correction requests manually.

## 4.4 Payroll Mismatch

If attendance records are wrong, payroll calculation also becomes wrong. This can create salary disputes between employees and the company.

## 4.5 Late Coming Tracking Issue

Many companies struggle to accurately track late arrivals, grace periods, half-days, and repeated late coming.

## 4.6 Overtime Calculation Problem

Overtime calculation is difficult when check-in and check-out records are not accurate.

## 4.7 Field Employee Verification Problem

For field employees, it is difficult to verify whether they are actually present at the assigned location or not.

## 4.8 RFID/Card Misuse

RFID cards can be shared with other employees, which makes attendance less secure.

## 4.9 Fingerprint Device Issues

Fingerprint devices may have hygiene issues, hardware maintenance issues, and scanning problems due to dirty fingers, injury, or sensor failure.

## 4.10 Multi-Branch Attendance Problem

Large companies with multiple branches need centralized attendance monitoring. Without a digital dashboard, it becomes difficult to track all branches from one system.

## 4.11 No Real-Time Dashboard

Many traditional systems do not provide real-time attendance data. HR may only know the final attendance status at the end of the day.

## 4.12 Poor Reporting System

Manual reports take time and may contain errors. Companies need date-wise, employee-wise, department-wise, and branch-wise reports.

## 4.13 Suspicious Attendance Activity

Traditional systems cannot easily detect suspicious activities such as multiple face attempts, repeated failed scans, or low confidence attendance.

## 4.14 Privacy Concerns

Face recognition uses sensitive personal data. If privacy, consent, and data protection are not handled properly, employees may not trust the system.

---

# 5. Proposed Solution

FaceTrack AI provides a smart and secure solution for modern employee attendance management.

The system uses:

* Face recognition to verify employee identity
* Location tracking to verify attendance location
* Role-based access for different users
* Employee face registration and HR/Admin approval
* Check-in and check-out management
* Automatic late marking
* Overtime calculation
* Automatic absent marking
* Live attendance dashboard
* Suspicious scan logs
* Attendance correction request
* PDF and Excel/CSV report export
* Employee consent page
* Privacy and audit log system

## 5.1 Solution Flow

```text
Employee Login
      ↓
Open Face Attendance Page
      ↓
Camera Permission
      ↓
Face Scan
      ↓
Face Match + Confidence Score
      ↓
Location Permission
      ↓
Location Verification
      ↓
System Suggests Check-in or Check-out
      ↓
Employee Confirms
      ↓
Attendance Saved
      ↓
Dashboard Updated
      ↓
Notification Sent
```

---

# 6. Project Objectives

The main objectives of FaceTrack AI are:

1. To automate employee attendance using face recognition
2. To reduce proxy attendance and buddy punching
3. To verify employee identity through face scanning
4. To verify employee location during attendance marking
5. To reduce HR manual work
6. To improve payroll accuracy
7. To calculate late arrival automatically
8. To calculate overtime automatically
9. To support multiple branches and departments
10. To support multiple shifts
11. To provide live attendance dashboard
12. To generate PDF, Excel, and CSV reports
13. To provide attendance correction workflow
14. To store suspicious scan logs
15. To provide employee consent and privacy control
16. To support future liveness detection and anti-spoofing

---

# 7. Target Users

## 7.1 Super Admin

Super Admin controls the complete system. This user can manage all branches, view all reports, manage global settings, and monitor organization-wide attendance.

## 7.2 Branch Admin

Branch Admin manages a particular branch. This user can manage branch employees, departments, shifts, and branch-level attendance data.

## 7.3 HR

HR manages employee records, face registration approvals, attendance correction requests, manual attendance edits, and reports.

## 7.4 Manager

Manager can view team attendance, late records, absent employees, leave/correction requests, and team summary.

## 7.5 Employee

Employee can register face, mark attendance, view attendance history, send correction requests, apply leave, and view monthly attendance summary.

---

# 8. User Roles and Responsibilities

| Role         | Main Responsibilities                                                      | Dashboard Access   |
| ------------ | -------------------------------------------------------------------------- | ------------------ |
| Super Admin  | Manage all branches, users, reports, settings, audit logs                  | Global dashboard   |
| Branch Admin | Manage branch employees, departments, shifts, branch reports               | Branch dashboard   |
| HR           | Approve face registration, manage attendance, correction requests, reports | HR dashboard       |
| Manager      | View team attendance, late records, correction/leave requests              | Team dashboard     |
| Employee     | Mark attendance, view history, send requests                               | Employee dashboard |

---

# 9. Functional Requirements

The system should include the following functional requirements:

1. User login system
2. Role-based authentication
3. Super Admin dashboard
4. Branch Admin dashboard
5. HR dashboard
6. Manager dashboard
7. Employee dashboard
8. Employee management
9. Branch management
10. Department management
11. Shift management
12. Face registration
13. Face registration approval by HR/Admin
14. Face recognition attendance
15. Location verification
16. Check-in and check-out confirmation
17. Duplicate check-in prevention
18. Late calculation
19. Overtime calculation
20. Auto absent marking
21. Check-out reminder
22. Attendance correction request
23. Manual attendance edit with reason
24. Suspicious scan log
25. Low confidence manual approval
26. Live dashboard counters
27. Attendance reports
28. PDF export
29. Excel/CSV export
30. Monthly employee summary
31. Email notifications
32. Employee consent page
33. Privacy policy page
34. Audit logs
35. System settings

---

# 10. Non-Functional Requirements

## 10.1 Security

The system should protect employee data using secure authentication, role-based access, and proper database rules.

## 10.2 Privacy

Face data should be used only for attendance purposes. Employee consent should be collected before face registration.

## 10.3 Accuracy

The system should calculate attendance status correctly, including present, absent, late, overtime, and correction status.

## 10.4 Performance

Face scanning and attendance marking should be fast and smooth.

## 10.5 Scalability

The system should support multiple branches, departments, and employees.

## 10.6 Reliability

Attendance data should be stored safely and should not be lost.

## 10.7 Usability

The interface should be simple, modern, and easy to use for employees and HR teams.

## 10.8 Maintainability

The project should have a clean structure so that future features can be added easily.

## 10.9 Responsive Design

The website should work on desktop, laptop, tablet, and mobile screens.

## 10.10 Easy Deployment

The project should be easy to deploy using Firebase Hosting or Vercel.

---

# 11. System Workflow

## 11.1 Complete System Workflow

```text
User Opens Website
      ↓
User Login
      ↓
Role Verification
      ↓
Dashboard Opens According to Role
      ↓
Employee Opens Attendance Page
      ↓
Camera Permission Allowed
      ↓
Face Scan Starts
      ↓
Face Matched with Registered Data
      ↓
Confidence Score Generated
      ↓
Location Permission Allowed
      ↓
Location Verified with Branch Radius
      ↓
System Suggests Check-in / Check-out
      ↓
Employee Confirms
      ↓
Attendance Saved in Database
      ↓
HR Dashboard Updated
      ↓
Notification Generated
      ↓
Report Data Updated
```

## 11.2 Explanation

First, the user logs in to the system. The system checks the user role and opens the correct dashboard. When an employee opens the attendance page, the camera starts and scans the employee face.

After face matching, the system checks the employee location. If both face and location are valid, the system suggests whether the employee should check in or check out. After employee confirmation, attendance is saved and the dashboard is updated.

---

# 12. Face Recognition Workflow

## 12.1 Face Registration

Before using face attendance, the employee must register their face.

```text
Employee Opens Face Registration Page
      ↓
Camera Captures Face
      ↓
System Detects Face
      ↓
Face Descriptor/Vector Generated
      ↓
Face Data Saved
      ↓
HR/Admin Approval Required
      ↓
Face Registration Completed
```

## 12.2 Face Attendance

```text
Employee Opens Attendance Page
      ↓
Camera Captures Current Face
      ↓
System Detects Face
      ↓
Current Face Compared with Registered Face Data
      ↓
Confidence Score Calculated
      ↓
If Confidence is Good → Continue
      ↓
If Confidence is Low → Re-scan or HR Approval
```

## 12.3 Low Confidence Handling

If face confidence is low:

* Employee can re-scan face
* System can show warning
* Attendance can be sent for HR approval
* Suspicious log can be created

## 12.4 Multiple Face Detection

If multiple faces are detected:

* Attendance should not be marked directly
* Warning should be shown
* Suspicious scan log should be saved
* HR can review the case

---

# 13. Location Tracking Workflow

Location tracking is compulsory in the system.

## 13.1 Location Flow

```text
Employee Opens Attendance Page
      ↓
Browser Requests Location Permission
      ↓
Latitude and Longitude Captured
      ↓
System Checks Branch Location
      ↓
Allowed Radius Applied
      ↓
Inside Radius → Attendance Allowed
      ↓
Outside Radius → Attendance Rejected + Request Option
```

## 13.2 Branch-Wise Location

Each branch will have:

* Branch name
* Address
* Latitude
* Longitude
* Allowed attendance radius
* Branch admin

## 13.3 Outside Location Case

If employee is outside the allowed area:

* Attendance will be blocked
* Employee can send a request
* HR/Admin can review and approve manually if needed

## 13.4 Location Permission Denied

If location permission is denied:

* Attendance will be blocked
* Employee will see a message
* Employee can send a correction/request to HR

---

# 14. Attendance Logic

## 14.1 Check-In Logic

```text
IF face is matched
AND location is verified
AND employee has not checked in today
THEN system suggests Check-In
```

## 14.2 Check-Out Logic

```text
IF face is matched
AND location is verified
AND employee has already checked in today
AND employee has not checked out
THEN system suggests Check-Out
```

## 14.3 Late Logic

```text
Shift Start Time = 9:00 AM
Grace Period = Admin Configurable

IF Check-In Time > Shift Start Time + Grace Period
THEN Status = Late
```

## 14.4 Grace Period Logic

Grace period should be configurable by Admin or Branch Admin.

Example:

| Shift Start | Grace Period | Late After |
| ----------- | ------------ | ---------- |
| 9:00 AM     | 15 minutes   | 9:15 AM    |
| 10:00 AM    | 10 minutes   | 10:10 AM   |

## 14.5 Overtime Logic

```text
IF Check-Out Time > Shift End Time
AND Extra Time > 1 hour
THEN Overtime Approval Required
```

## 14.6 Auto Absent Logic

```text
IF Employee does not check in before shift end
THEN System marks employee as Absent
```

## 14.7 Duplicate Attendance Prevention

```text
IF Employee already checked in today
THEN second check-in is not allowed
```

---

# 15. Liveness Detection Plan

## 15.1 Phase 1: MVP Version

In the first version, the system will include:

* Simple face recognition
* Face match
* Confidence score
* Location verification
* Suspicious scan logs
* Low confidence re-scan or HR approval

## 15.2 Phase 2: Advanced Version

In the advanced version, the system can include:

* Blink detection
* Head movement detection
* Random command like “blink”, “look left”, “smile”
* Photo spoof detection
* Video replay detection
* Anti-spoofing AI model
* Deepfake detection

## 15.3 Purpose of Liveness Detection

Liveness detection helps prevent fake attendance using:

* Printed photos
* Mobile screen images
* Recorded videos
* Fake face attempts

---

# 16. System Modules

## 16.1 Authentication Module

Handles login, registration, forgot password, role verification, and secure access.

## 16.2 Role Management Module

Controls access for Super Admin, Branch Admin, HR, Manager, and Employee.

## 16.3 Employee Management Module

Allows HR/Admin to add, update, view, and deactivate employees.

## 16.4 Branch Management Module

Allows Super Admin to create and manage company branches.

## 16.5 Department Management Module

Allows Admin/HR to create and manage departments.

## 16.6 Shift Management Module

Allows Admin/HR to create shifts, set timing, grace period, and overtime rules.

## 16.7 Face Registration Module

Allows employee face registration and HR/Admin approval.

## 16.8 Face Recognition Attendance Module

Allows employees to mark attendance using face scan.

## 16.9 Location Verification Module

Checks whether employee is inside the allowed branch radius.

## 16.10 Attendance Logic Module

Handles check-in, check-out, late, overtime, absent, and duplicate attendance.

## 16.11 Attendance Correction Module

Allows employee to send correction request if attendance fails or is wrong.

## 16.12 Manual Attendance Edit Module

Allows HR to edit attendance manually with compulsory reason.

## 16.13 Suspicious Scan Module

Stores logs for failed face match, multiple faces, low confidence, and location mismatch.

## 16.14 Notification Module

Sends screen alerts, emails, and future WhatsApp/SMS notifications.

## 16.15 Reports Module

Generates daily, monthly, employee-wise, department-wise, and branch-wise reports.

## 16.16 Dashboard Analytics Module

Displays live counters, charts, and recent logs.

## 16.17 Privacy and Consent Module

Collects employee consent before face registration and explains data usage.

## 16.18 Audit Log Module

Tracks important admin/HR actions.

---

# 17. Database Design

The project will use **Firebase Firestore** as the database.

## 17.1 users

```text
userId
name
email
phone
role
branchId
departmentId
status
createdAt
updatedAt
```

## 17.2 employees

```text
employeeId
userId
employeeCode
name
email
phone
designation
branchId
departmentId
shiftId
faceRegistered
joiningDate
employmentStatus
createdAt
```

## 17.3 branches

```text
branchId
branchName
address
latitude
longitude
allowedRadius
branchAdminId
status
createdAt
```

## 17.4 departments

```text
departmentId
departmentName
branchId
managerId
status
createdAt
```

## 17.5 shifts

```text
shiftId
shiftName
branchId
startTime
endTime
gracePeriod
workingHours
overtimeRule
status
```

## 17.6 faceData

```text
faceId
employeeId
faceDescriptor
faceImageUrl optional
registrationStatus
confidenceScore
approvedBy
createdAt
updatedAt
```

## 17.7 attendance

```text
attendanceId
employeeId
branchId
departmentId
date
checkInTime
checkOutTime
totalHours
lateMinutes
overtimeMinutes
attendanceStatus
checkInLocation
checkOutLocation
confidenceScore
markedBy
approvalStatus
createdAt
```

## 17.8 attendanceLogs

```text
logId
employeeId
date
scanTime
scanType
confidenceScore
locationStatus
faceStatus
result
reason
deviceInfo
createdAt
```

## 17.9 suspiciousScans

```text
suspiciousId
employeeId optional
scanTime
reason
confidenceScore
multipleFacesDetected
location
status
reviewedBy
createdAt
```

## 17.10 correctionRequests

```text
requestId
employeeId
attendanceId
date
requestType
reason
status
hrRemark
createdAt
updatedAt
```

## 17.11 leaveRequests

```text
leaveId
employeeId
leaveType
startDate
endDate
reason
status
approvedBy
createdAt
```

## 17.12 notifications

```text
notificationId
userId
title
message
type
readStatus
createdAt
```

## 17.13 auditLogs

```text
auditId
userId
role
action
targetModule
description
createdAt
```

## 17.14 settings

```text
settingId
branchId
attendanceRadius
gracePeriod
overtimeRule
notificationSettings
updatedBy
updatedAt
```

---

# 18. UI Pages Planning

## 18.1 Public Pages

1. Landing Page
2. Login Page
3. Register Page
4. Privacy Policy Page
5. Employee Consent Page

## 18.2 Employee Pages

1. Employee Dashboard
2. Face Attendance Test Page
3. Face Attendance Page
4. Attendance History
5. Correction Request Page
6. Leave Request Page
7. Monthly Summary Page
8. Profile Page

## 18.3 HR/Admin Pages

1. Admin Dashboard
2. Employee Management
3. Face Registration Approval
4. Attendance Records
5. Live Attendance Monitor
6. Late Employees
7. Absent Employees
8. Overtime Report
9. Correction Requests
10. Department Management
11. Shift Management
12. Reports Export
13. Notification Center
14. Suspicious Scan Logs
15. Settings

## 18.4 Super Admin Pages

1. Global Dashboard
2. Branch Management
3. Role Management
4. All Employees
5. All Attendance
6. Branch-Wise Analytics
7. Security Logs
8. Audit Logs
9. System Settings

---

# 19. Dashboard Features

## 19.1 Dashboard Cards

* Total Employees
* Present Today
* Absent Today
* Late Employees
* On-Time Employees
* Overtime Employees
* Pending Correction Requests
* Suspicious Scans
* Pending Face Registration Approvals

## 19.2 Dashboard Charts

* Present vs Absent Chart
* Late vs On-Time Chart
* Department-Wise Attendance Chart
* Monthly Attendance Trend Chart
* Branch-Wise Attendance Chart
* Overtime Trend Chart

## 19.3 Dashboard Panels

* Recent Attendance Logs
* Pending Approvals
* Suspicious Scan Alerts
* Check-Out Reminder List
* Monthly Summary
* Low Confidence Attendance Queue

---

# 20. Reports

## 20.1 Report Types

1. Daily Attendance Report
2. Monthly Attendance Report
3. Employee-Wise Report
4. Department-Wise Report
5. Branch-Wise Report
6. Late Arrival Report
7. Overtime Report
8. Absent Report
9. Correction Request Report
10. Suspicious Scan Report
11. Attendance Logs Report
12. Monthly Employee Summary
13. Future Payroll Summary Report

## 20.2 Report Export Options

* PDF
* Excel
* CSV

## 20.3 Report Filters

* Date-Wise
* Employee-Wise
* Department-Wise
* Branch-Wise
* Status-Wise
* Shift-Wise

---

# 21. Notifications

## 21.1 Employee Notifications

* Attendance marked successfully
* Check-out reminder
* Late marked alert
* Correction request status
* Monthly attendance summary email

## 21.2 HR Notifications

* Face registration request
* Correction request
* Suspicious scan
* Late employee alert
* Overtime approval request
* Low confidence attendance request

## 21.3 Future Notifications

* WhatsApp alert
* SMS alert
* Mobile push notification

---

# 22. Privacy and Security

FaceTrack AI uses face recognition, so privacy and security are very important.

## 22.1 Privacy Principles

* Employee consent should be required before face registration
* Face data should be used only for attendance purpose
* System should collect only required data
* Face descriptor/vector storage is better than storing raw face images
* Employee should know how their data will be used
* Data retention policy should be defined
* Employee correction/request option should be available

## 22.2 Security Features

* Secure login
* Role-based access control
* Firebase security rules
* HTTPS deployment
* Audit logs
* Admin activity tracking
* Manual edit reason required
* Suspicious scan logging
* Restricted access to face data

## 22.3 Employee Consent Page Should Mention

* Face data will be used only for attendance
* Location data will be used only during attendance marking
* Data will be protected
* Employee can send correction request
* Data deletion/retention policy
* Alternative/manual request option in case of scan failure

---

# 23. Advantages

FaceTrack AI provides the following advantages:

1. Prevents proxy attendance
2. Reduces HR manual workload
3. Improves attendance accuracy
4. Improves payroll accuracy
5. Supports multi-branch organizations
6. Tracks employee location during attendance
7. Provides real-time dashboard
8. Supports PDF/Excel/CSV reports
9. Calculates late arrival automatically
10. Calculates overtime automatically
11. Provides correction request workflow
12. Provides suspicious scan logs
13. Improves transparency between employee and HR
14. Adds privacy and consent system
15. Supports future liveness detection

---

# 24. Limitations

The project may have some limitations:

1. Face recognition may fail in low light
2. Poor camera quality can affect accuracy
3. Internet is required for cloud database
4. Location permission is required
5. Browser-based face recognition may have limitations
6. Liveness detection is needed for advanced security
7. Privacy must be handled carefully
8. Employee must have fallback correction option
9. Location accuracy may vary depending on device and network
10. Initial face registration quality affects future recognition

---

# 25. Future Scope

Future improvements can include:

1. Advanced liveness detection
2. Blink detection
3. Head movement detection
4. Random command verification
5. Photo/video spoof detection
6. Mobile app
7. Field employee attendance
8. Geo-fencing
9. Payroll integration
10. CCTV/IP camera integration
11. Offline attendance mode
12. WhatsApp/SMS notification
13. AI attendance analytics
14. Deepfake detection
15. Face re-enrollment system
16. Advanced HRMS integration
17. Leave management integration
18. Shift rotation automation
19. Employee performance analytics
20. Multi-company SaaS version

---

# 26. Development Roadmap

The project can be developed in approximately 30 days. The timeline can be adjusted according to requirements.

## Week 1: Planning and Setup

| Day   | Task                          |
| ----- | ----------------------------- |
| Day 1 | Requirement finalization      |
| Day 2 | UI wireframe planning         |
| Day 3 | Firebase project setup        |
| Day 4 | Firestore database planning   |
| Day 5 | Firebase Authentication setup |
| Day 6 | Role-based routing planning   |
| Day 7 | Basic layout and theme setup  |

## Week 2: Core Development

| Day    | Task                       |
| ------ | -------------------------- |
| Day 8  | Login/Register system      |
| Day 9  | Role-based dashboards      |
| Day 10 | Employee management        |
| Day 11 | Branch management          |
| Day 12 | Department management      |
| Day 13 | Shift management           |
| Day 14 | Face recognition test page |

## Week 3: Attendance System

| Day    | Task                                 |
| ------ | ------------------------------------ |
| Day 15 | Face registration page               |
| Day 16 | Face registration approval           |
| Day 17 | Face recognition attendance          |
| Day 18 | Location tracking                    |
| Day 19 | Check-in/check-out logic             |
| Day 20 | Late and overtime calculation        |
| Day 21 | Auto absent and suspicious scan logs |

## Week 4: Reports and Finalization

| Day    | Task                                  |
| ------ | ------------------------------------- |
| Day 22 | Attendance records page               |
| Day 23 | Reports page                          |
| Day 24 | PDF/Excel export                      |
| Day 25 | Correction requests                   |
| Day 26 | Notifications                         |
| Day 27 | Dashboard charts                      |
| Day 28 | Privacy/consent page                  |
| Day 29 | Testing and bug fixing                |
| Day 30 | Deployment, documentation, demo video |

---

# 27. Testing Plan

## 27.1 Authentication Testing

* Test login
* Test logout
* Test wrong password
* Test role-based access
* Test protected routes

## 27.2 Employee Testing

* Add employee
* Edit employee
* Deactivate employee
* Assign department
* Assign shift

## 27.3 Face Recognition Testing

* Face registration testing
* Face scan testing
* Low confidence testing
* Multiple face detection testing
* Face not matched testing

## 27.4 Location Testing

* Location permission allowed
* Location permission denied
* Inside allowed radius
* Outside allowed radius
* Wrong branch location

## 27.5 Attendance Testing

* Check-in testing
* Check-out testing
* Duplicate attendance testing
* Late calculation testing
* Overtime testing
* Auto absent testing

## 27.6 Request Testing

* Correction request creation
* HR approval
* HR rejection
* Manual edit with reason

## 27.7 Report Testing

* Daily report
* Monthly report
* Employee-wise report
* Department-wise report
* PDF export
* Excel/CSV export

## 27.8 Security Testing

* Unauthorized access
* Role restriction
* Firestore rules
* Audit log creation
* Consent required before face registration

## 27.9 Deployment Testing

* Build test
* Hosting test
* Login after deployment
* Database connection after deployment
* Camera permission after deployment
* Location permission after deployment

---

# 28. Deployment Plan

## 28.1 Deployment Platform

The React app can be deployed using:

* Firebase Hosting
* Vercel

## 28.2 Firebase Services

The project will use:

* Firebase Authentication for login
* Firestore for database
* Firebase Storage for optional face images
* Firebase Hosting for deployment

## 28.3 Deployment Steps

1. Create Firebase project
2. Enable Firebase Authentication
3. Create Firestore database
4. Configure Firebase SDK in React project
5. Add environment variables
6. Build React app
7. Deploy on Firebase Hosting or Vercel
8. Test deployed link
9. Test camera and location permissions
10. Prepare final demo video

## 28.4 Future Deployment

In the future, a Python FastAPI AI microservice can be deployed separately on Render or another backend hosting platform.

---

# 29. Project Innovation

FaceTrack AI is innovative because it combines multiple important ideas into one system:

1. Face recognition attendance
2. Location-based verification
3. Real-time HR dashboard
4. Role-based access
5. Multi-branch attendance
6. Suspicious scan logs
7. Low confidence manual approval
8. Automatic late calculation
9. Automatic overtime calculation
10. Employee correction workflow
11. Privacy and consent system
12. Future liveness detection
13. PDF/Excel reporting
14. Professional AI dashboard

This makes the project more advanced than a normal attendance system.

---

# 30. Conclusion

FaceTrack AI — Smart Employee Attendance Management System is a modern solution for employee attendance management. It solves real industry problems such as proxy attendance, manual HR workload, attendance mismatch, payroll errors, and lack of real-time monitoring.

By using face recognition and location tracking, the system verifies both employee identity and attendance location. It provides real-time dashboards, role-based access, reports, correction requests, suspicious scan logs, and privacy-aware biometric attendance handling.

The project is practical, scalable, and suitable for internship submission as well as portfolio development. In the future, it can be upgraded with liveness detection, mobile app, payroll integration, field employee tracking, CCTV/IP camera support, and advanced AI analytics.

---

<div style="page-break-after: always;"></div>

# 31. Final Feature List

## Core Features

* Face recognition attendance
* Location tracking
* Check-in/check-out
* Late calculation
* Overtime calculation
* Auto absent marking
* Duplicate attendance prevention
* Role-based login
* Employee management
* Branch management
* Department management
* Shift management
* Attendance correction request
* Manual edit with reason
* Reports export
* Notifications
* Privacy consent
* Suspicious scan logs

## Advanced/Future Features

* Liveness detection
* Random command verification
* Mobile app
* Payroll integration
* Field employee attendance
* Geo-fencing
* CCTV/IP camera integration
* WhatsApp/SMS alerts
* AI attendance analytics

---

# 32. Database Collection Summary

| Collection         | Purpose                                  |
| ------------------ | ---------------------------------------- |
| users              | Store login users and roles              |
| employees          | Store employee profile data              |
| branches           | Store branch details and location        |
| departments        | Store department information             |
| shifts             | Store shift timing and rules             |
| faceData           | Store face descriptor/vector information |
| attendance         | Store daily attendance records           |
| attendanceLogs     | Store scan and attendance logs           |
| suspiciousScans    | Store suspicious activity logs           |
| correctionRequests | Store attendance correction requests     |
| leaveRequests      | Store leave requests                     |
| notifications      | Store user notifications                 |
| auditLogs          | Store admin/HR action logs               |
| settings           | Store branch/system settings             |

---

# 33. UI Page Summary

| User Type   | Pages                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Public      | Landing, Login, Register, Privacy Policy, Consent                                          |
| Employee    | Dashboard, Face Attendance, History, Correction Request, Leave, Profile                    |
| HR/Admin    | Dashboard, Employees, Face Approval, Attendance, Reports, Corrections, Shifts, Departments |
| Super Admin | Global Dashboard, Branches, Roles, All Employees, All Attendance, Audit Logs, Settings     |

---

# 34. AI Coding Tool Prompt

Use this prompt in Antigravity, Cursor, Claude, or any AI coding tool:

```text
Build a React.js project named FaceTrack AI — Smart Employee Attendance Management System.

Create a professional dark glassmorphism + neon blue/cyan dashboard UI.

Use Firebase Authentication for login and Firebase Firestore for database.

Create role-based access for:
1. Super Admin
2. Branch Admin
3. HR
4. Manager
5. Employee

Create the following modules:
- Authentication
- Employee management
- Branch management
- Department management
- Shift management
- Face registration
- Face recognition attendance
- Location verification
- Attendance records
- Correction requests
- Reports
- Notifications
- Suspicious scan logs
- Privacy consent
- Audit logs

Create UI pages:
- Landing Page
- Login Page
- Register Page
- Employee Dashboard
- Face Attendance Test Page
- Face Attendance Page
- Attendance History
- Correction Request Page
- HR/Admin Dashboard
- Employee Management
- Face Registration Approval
- Attendance Records
- Reports Export
- Suspicious Scan Logs
- Settings
- Super Admin Global Dashboard

Attendance logic:
- Employee scans face using webcam
- System compares face with registered face data
- System checks location permission
- System verifies branch radius
- System suggests check-in or check-out
- Employee confirms
- Attendance is saved in Firestore
- Late, overtime, absent status should be calculated
- Duplicate check-in should be prevented
- Low confidence case should allow re-scan or HR approval
- Multiple face detection should create suspicious scan log

Use Firebase collections:
users, employees, branches, departments, shifts, faceData, attendance, attendanceLogs, suspiciousScans, correctionRequests, leaveRequests, notifications, auditLogs, settings.

Reports:
- Daily report
- Monthly report
- Employee-wise report
- Department-wise report
- Branch-wise report
- Late report
- Overtime report
- Suspicious scan report

Export:
- PDF
- Excel/CSV

Make the project clean, responsive, modern, and deployment-ready.
```

---

# 35. Short Project Pitch

**FaceTrack AI is an AI-powered employee attendance system that uses face recognition and location tracking to prevent proxy attendance, automate check-in/check-out, calculate late and overtime, and provide real-time HR analytics with privacy-aware biometric attendance management.**

---

# 36. Demo Presentation Points

Use these points in your presentation:

1. This project solves real employee attendance problems.
2. It prevents proxy attendance using face recognition.
3. It verifies employee location before marking attendance.
4. It supports multiple roles like Super Admin, HR, Manager, and Employee.
5. It provides real-time attendance dashboard.
6. It calculates late arrival and overtime automatically.
7. It supports attendance correction requests.
8. It stores suspicious scan logs.
9. It exports reports in PDF and Excel/CSV.
10. It includes privacy and employee consent features.
11. It can be upgraded with liveness detection in the future.
12. It is suitable for companies, offices, institutions, and multi-branch organizations.

---

# Final One-Line Description

**FaceTrack AI is a smart HR attendance platform that uses face recognition and location verification to automate employee attendance, reduce proxy entries, and provide real-time workforce analytics.**


# =========================================
# SECTION: PROJECT_CONTEXT.md
# =========================================

# PROJECT_CONTEXT.md

# FaceTrack AI — Smart Employee Attendance Management System

## 1. Project Overview

FaceTrack AI is an AI-based employee attendance management system that uses **Face Recognition + Location Tracking** to mark employee attendance.

Employees will mark attendance using a laptop/webcam camera. The system will verify the employee's face, verify the employee's location, suggest check-in or check-out, calculate late arrival, working hours, overtime, and update the HR/Admin dashboard in real time.

This project should be developed as an **industry-level advanced internship project**, not a simple college demo.

---

## 2. Project Category

- AI-Based Attendance Management System
- Face Recognition Attendance System
- Location-Based Employee Attendance System
- HR Workforce Management Platform
- Multi-Branch Employee Monitoring System

---

## 3. Main Goal

The goal of this project is to create a professional HR attendance platform that solves real industry problems such as:

- Proxy attendance
- Buddy punching
- Manual attendance workload
- Payroll mismatch
- Late tracking problem
- Overtime calculation problem
- Field employee tracking issue
- Multi-branch attendance management
- No real-time dashboard
- Poor attendance reports
- Suspicious attendance activity
- Privacy and consent issues in biometric systems

---

## 4. Target Company Type

Design this project for a **large multi-branch corporate company**.

The system should support:

- Multiple branches
- Multiple departments
- Multiple shifts
- Role-based access
- HR/Admin dashboard
- Employee dashboard
- Reports and analytics
- Attendance correction workflow
- Suspicious scan monitoring
- Privacy-aware biometric attendance

---

## 5. User Roles

The project must include these roles:

1. Super Admin
2. Branch Admin
3. HR
4. Manager
5. Employee

---

## 6. Role Responsibilities

### 6.1 Super Admin

Super Admin controls the full system.

Responsibilities:

- Manage all branches
- Manage all roles
- View all employees
- View all attendance records
- View global analytics
- Manage system settings
- View audit logs
- View security logs

---

### 6.2 Branch Admin

Branch Admin controls one branch.

Responsibilities:

- Manage branch employees
- Manage branch departments
- Manage branch shifts
- View branch attendance
- View branch reports
- Manage branch settings
- Manage branch attendance radius

---

### 6.3 HR

HR manages employee attendance and approvals.

Responsibilities:

- Add employees
- Edit employees
- Deactivate employees
- Approve face registration
- Manage attendance records
- Approve/reject correction requests
- Edit attendance manually with reason
- Export reports
- View suspicious scan logs
- View late and absent employees

---

### 6.4 Manager

Manager can view team-related data.

Responsibilities:

- View team attendance
- View team late records
- View team absent records
- View team correction requests
- View team leave requests
- View team monthly summary

---

### 6.5 Employee

Employee can use the system for attendance.

Responsibilities:

- Login
- Accept consent policy
- Register face
- Mark attendance
- View attendance history
- Send correction request
- Apply leave
- View monthly summary
- View profile

---

## 7. Final Selected Features

### 7.1 Attendance Features

- Face recognition attendance
- Location verification
- Check-in/check-out
- System suggests check-in/check-out
- Employee confirms attendance
- Duplicate check-in prevention
- Late calculation
- Overtime calculation
- Auto absent marking after shift end
- Check-out reminder
- Manual attendance edit with reason
- Attendance correction request

---

### 7.2 Face Recognition Features

- Face registration
- HR/Admin approval for face registration
- Face match with confidence score
- Low confidence re-scan option
- Low confidence HR approval option
- Multiple faces detected warning
- Suspicious scan log
- Face not matched message with re-scan/request option

---

### 7.3 Location Features

- Location tracking compulsory
- Branch-wise office location setup
- Admin configurable attendance radius
- If outside allowed location, reject attendance + allow request option
- If location permission denied, block attendance + allow request option

---

### 7.4 Dashboard Features

- Total employees
- Present today
- Absent today
- Late employees
- On-time employees
- Overtime employees
- Pending correction requests
- Suspicious scan alerts
- Pending face registration approvals
- Recent attendance logs
- Monthly attendance charts
- Department-wise attendance charts
- Branch-wise attendance charts

---

### 7.5 Reports

The system should include:

- Daily attendance report
- Monthly attendance report
- Employee-wise report
- Department-wise report
- Branch-wise report
- Late report
- Overtime report
- Absent report
- Suspicious scan report
- Correction request report
- Attendance logs report
- Export PDF
- Export Excel/CSV

---

### 7.6 Notifications

The system should include:

- Screen toast notification
- Email notification
- Future WhatsApp/SMS feature

Notification events:

- Attendance marked
- Late marked
- Check-out reminder
- Face registration request
- Correction request
- Suspicious scan
- Overtime approval request
- Monthly employee summary

---

### 7.7 Privacy Features

The system should include:

- Employee consent page
- Privacy policy page
- Face data use explanation
- Location data use explanation
- Data retention policy
- Audit logs
- Role-based access control
- Manual alternative/correction request if face scan fails

---

## 8. Recommended Tech Stack

### Frontend

React.js

### Styling

Tailwind CSS or modern CSS

### UI Theme

Dark glassmorphism + neon blue/cyan futuristic AI dashboard theme

### Authentication

Firebase Authentication

### Database

Firebase Firestore

### Storage

Firebase Storage

### Hosting

Firebase Hosting or Vercel

### Face Recognition

Browser-based JavaScript face recognition for MVP

### Reports

- jsPDF for PDF export
- SheetJS for Excel/CSV export

### Charts

Chart.js or Recharts

---

## 9. Recommended Development Order

Build the project step by step in this order:

1. Firebase setup
2. Authentication setup
3. Role-based routing
4. Base dashboard layout
5. Public pages
6. Employee dashboard
7. HR/Admin dashboard
8. Super Admin dashboard
9. Employee management
10. Branch management
11. Department management
12. Shift management
13. Face recognition test page
14. Face registration page
15. Face attendance page
16. Location tracking
17. Attendance logic
18. Correction request
19. Suspicious scan logs
20. Reports
21. Notifications
22. Privacy and consent page
23. Final testing
24. Deployment

---

## 10. Important Build Instruction

Do not build the full project at once.

First build:

- Base React structure
- Firebase configuration
- Authentication
- Role-based routing
- Dashboard layout
- Placeholder dashboards

After the base is working, build modules one by one.

---

## 11. Project One-Line Description

FaceTrack AI is a smart HR attendance platform that uses face recognition and location verification to automate employee attendance, reduce proxy entries, and provide real-time workforce analytics.

---

## 12. Project Pitch

FaceTrack AI is an AI-powered employee attendance system that uses face recognition and location tracking to prevent proxy attendance, automate check-in/check-out, calculate late and overtime, and provide real-time HR analytics with privacy-aware biometric attendance management.

# =========================================
# SECTION: BUILD_PROMPT.md
# =========================================

# BUILD_PROMPT.md

# Build Prompt for Antigravity

Read these files first (the original split files were consolidated into this document):

1. `docs/PROJECT_DOCUMENTATION.md` (this file — full spec)
2. `docs/PROJECT_CODEBASE_INDEX.md` (codebase map)
3. `README.md` (overview, demo accounts, current status & roadmap)
4. `CLAUDE.md` (AI working rules + Git safety)
5. `CHANGELOG.md` (history)

Use these files as the complete project context.

---

# Project Name

FaceTrack AI — Smart Employee Attendance Management System

---

# Main Build Goal

Build a professional React.js + Firebase project for an AI-based employee attendance system using:

- Face Recognition
- Location Tracking
- Firebase Authentication
- Firebase Firestore
- Role-based dashboards
- Attendance reports
- Dark futuristic dashboard UI

---

# Important Build Rule

Do not build all advanced features at once.

First create a clean, working base project with:

1. React routing
2. Firebase configuration
3. Login page
4. Register page
5. Role-based protected routes
6. Dashboard layout
7. Sidebar navigation
8. Basic pages for each role
9. Responsive UI theme

After base structure is complete, build each module step by step.

---

# Tech Stack

Use this stack:

- React.js
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Hosting or Vercel
- Tailwind CSS or modern CSS
- Chart.js or Recharts
- jsPDF
- SheetJS
- Browser webcam API
- Browser geolocation API

---

# Recommended NPM Packages

Install these packages if needed:

```bash
npm install firebase
npm install react-router-dom
npm install lucide-react
npm install recharts
npm install jspdf
npm install jspdf-autotable
npm install xlsx
npm install react-webcam
npm install date-fns
npm install react-toastify
```

Optional for face recognition MVP:

```bash
npm install face-api.js
```

---

# Required Folder Structure

Create this folder structure:

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── dashboard/
│   ├── forms/
│   ├── cards/
│   ├── tables/
│   └── charts/
│
├── pages/
│   ├── public/
│   ├── auth/
│   ├── employee/
│   ├── hr/
│   ├── manager/
│   ├── branchAdmin/
│   └── superAdmin/
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleBasedRoute.jsx
│
├── services/
│   ├── firebase.js
│   ├── authService.js
│   ├── employeeService.js
│   ├── branchService.js
│   ├── departmentService.js
│   ├── shiftService.js
│   ├── attendanceService.js
│   ├── faceService.js
│   ├── locationService.js
│   ├── reportService.js
│   └── notificationService.js
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useRole.js
│   └── useLocation.js
│
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   ├── attendanceUtils.js
│   ├── dateUtils.js
│   └── exportUtils.js
│
├── styles/
│   ├── global.css
│   └── theme.css
│
├── App.jsx
└── main.jsx
```

---

# Phase 1 — Base Project Setup

Build Phase 1 first.

Create:

- React routing
- Firebase config
- Auth context
- Login page
- Register page
- Protected routes
- Role-based route protection
- Dashboard layout
- Sidebar
- Navbar
- Placeholder dashboards

Do not build face recognition in Phase 1.

Do not build reports in Phase 1.

Do not build attendance logic in Phase 1.

---

# Phase 1 Pages

## Public Pages

Create:

- Landing Page
- Login Page
- Register Page
- Privacy Policy Page
- Consent Page

Routes:

```text
/
 /login
 /register
 /privacy-policy
 /consent
```

---

## Role Dashboard Pages

Create placeholder dashboard pages:

```text
/employee/dashboard
/hr/dashboard
/manager/dashboard
/branch-admin/dashboard
/super-admin/dashboard
```

Each dashboard should have:

- Page title
- Welcome message
- Demo analytics cards
- Recent activity section
- Placeholder charts

---

# Authentication Requirements

Use Firebase Authentication.

Create:

- Login with email/password
- Register with email/password
- Logout
- Protected routes
- Role-based route protection
- Redirect users based on role

Roles:

```text
superAdmin
branchAdmin
hr
manager
employee
```

After login, redirect like this:

```text
superAdmin → /super-admin/dashboard
branchAdmin → /branch-admin/dashboard
hr → /hr/dashboard
manager → /manager/dashboard
employee → /employee/dashboard
```

---

# Dashboard Layout Requirements

Create a professional dashboard layout with:

- Sidebar
- Top navbar
- Profile dropdown
- Notification icon
- Page title
- Main content area
- Responsive mobile sidebar

Theme:

```text
Background: dark navy / black
Cards: glassmorphism
Primary color: neon blue
Secondary color: cyan
Accent: purple/green
Style: futuristic AI dashboard
```

---

# Phase 2 — Admin Modules

After Phase 1 is complete, build:

1. Employee Management
2. Branch Management
3. Department Management
4. Shift Management
5. Role Management

Employee Management should include:

- Add employee
- Edit employee
- Delete/deactivate employee
- Assign branch
- Assign department
- Assign shift
- View employee list
- Search employee
- Filter employee by branch/department/status

---

# Phase 3 — Face Recognition Module

Create a separate test page first:

```text
/employee/face-test
```

This page should include:

- Webcam access
- Camera preview
- Face detected status
- Confidence score placeholder
- Start scan button
- Stop scan button
- Test result card
- Error handling for camera permission

After test page works, create:

```text
/employee/face-registration
/employee/face-attendance
/hr/face-approvals
```

Face registration flow:

```text
Employee opens face registration
→ camera starts
→ face captured
→ face data saved
→ status pending
→ HR/Admin approves
```

Face attendance flow:

```text
Employee opens attendance page
→ camera starts
→ face scan
→ face match
→ confidence score generated
→ location verification
→ system suggests check-in/check-out
→ employee confirms
→ attendance saved
```

---

# Phase 4 — Location Tracking Module

Create browser location tracking.

Requirements:

- Ask location permission
- Capture latitude and longitude
- Compare with branch latitude/longitude
- Use admin configurable radius
- If inside radius, allow attendance
- If outside radius, reject attendance and show request option
- If location permission denied, block attendance and show request option

---

# Phase 5 — Attendance Logic

Create attendance logic.

## Check-In

If employee has not checked in today, system suggests check-in.

## Check-Out

If employee already checked in and not checked out, system suggests check-out.

## Duplicate Prevention

Do not allow multiple check-ins on the same day.

## Late Calculation

If check-in time is after shift start time + grace period, mark late.

## Overtime Calculation

If check-out time is greater than shift end time, calculate overtime.

If overtime is more than 1 hour, send it for HR approval.

## Auto Absent

If employee does not check in before shift end, mark absent.

---

# Phase 6 — Reports

Create reports pages:

- Daily attendance report
- Monthly attendance report
- Employee-wise report
- Department-wise report
- Branch-wise report
- Late report
- Overtime report
- Suspicious scan report

Add filters:

- Date-wise
- Employee-wise
- Department-wise
- Branch-wise
- Status-wise
- Shift-wise

Add export:

- PDF
- Excel/CSV

---

# Phase 7 — Notifications

Create notification system for:

## Employee

- Attendance marked
- Late marked
- Check-out reminder
- Correction request status
- Monthly summary

## HR

- Face registration request
- Correction request
- Suspicious scan
- Late employee alert
- Overtime approval request

---

# Phase 8 — Privacy and Security

Create:

- Consent page
- Privacy policy page
- Audit logs
- Manual edit reason required
- Suspicious scan logs
- Role-based access

Employee must accept consent before face registration.

---

# Final Instruction for Antigravity

Build the project step by step.

Before implementing advanced features, complete the base project first.

After completing each phase, summarize:

1. What was built
2. What files were created
3. What files were changed
4. What errors were fixed
5. What should be built next

# =========================================
# SECTION: UI_REQUIREMENTS.md
# =========================================

# UI_REQUIREMENTS.md

# FaceTrack AI — UI Requirements

This file contains all UI pages, layout, theme, dashboard design, and navigation requirements.

---

# 1. UI Theme

Use a professional **Dark Futuristic AI Dashboard Theme**.

Theme style:

```text
Dark glassmorphism
Neon blue/cyan highlights
Modern HR dashboard
Clean typography
Professional layout
Responsive design
AI/tech feeling
```

---

# 2. Color Palette

Recommended colors:

```text
Background: #050816
Card Background: rgba(255, 255, 255, 0.08)
Primary: #00D4FF
Secondary: #38BDF8
Accent: #8B5CF6
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
Text Primary: #F8FAFC
Text Secondary: #CBD5E1
Border: rgba(255, 255, 255, 0.12)
```

---

# 3. Design Style

The UI should include:

- Glassmorphism cards
- Soft border radius
- Smooth hover effects
- Neon glow on important buttons
- Dashboard cards
- Charts
- Tables
- Search filters
- Status badges
- Responsive sidebar
- Top navbar
- Clean forms

---

# 4. Main Layout

Every dashboard page should have:

- Sidebar navigation
- Top navbar
- User profile dropdown
- Notification icon
- Page title
- Main content area
- Responsive mobile menu

---

# 5. Public Pages

## 5.1 Landing Page

Route:

```text
/
```

Sections:

- Hero section
- Project name
- Short description
- Face recognition attendance highlight
- Location tracking highlight
- Dashboard preview cards
- Features section
- Roles section
- Privacy section
- Login/Register buttons

Hero text:

```text
FaceTrack AI
Smart Employee Attendance Management System

Automate employee attendance with face recognition, location verification, real-time HR dashboard, and privacy-aware biometric attendance management.
```

---

## 5.2 Login Page

Route:

```text
/login
```

Fields:

- Email
- Password
- Role hint optional
- Login button
- Register link
- Forgot password link

After login, redirect by role:

```text
superAdmin → /super-admin/dashboard
branchAdmin → /branch-admin/dashboard
hr → /hr/dashboard
manager → /manager/dashboard
employee → /employee/dashboard
```

---

## 5.3 Register Page

Route:

```text
/register
```

Fields:

- Name
- Email
- Phone
- Password
- Confirm password
- Role
- Branch optional
- Department optional

Note:

For production, admin should create roles. For MVP, allow role selection for demo.

---

## 5.4 Privacy Policy Page

Route:

```text
/privacy-policy
```

Content:

- Face data usage
- Location data usage
- Data protection
- Data retention
- Employee rights
- Manual correction option

---

## 5.5 Consent Page

Route:

```text
/consent
```

Content:

- I agree that my face data will be used only for attendance.
- I agree that my location will be captured only during attendance marking.
- I understand that I can send correction request if scan fails.
- I understand that my data will be protected.

Button:

```text
Accept Consent
```

---

# 6. Employee Pages

## 6.1 Employee Dashboard

Route:

```text
/employee/dashboard
```

Cards:

- Today Status
- Check-In Time
- Check-Out Time
- Late Minutes
- Monthly Present Days
- Pending Requests

Sections:

- Quick attendance button
- Attendance summary chart
- Recent attendance records
- Notifications

---

## 6.2 Face Attendance Test Page

Route:

```text
/employee/face-test
```

Purpose:

This page is for testing webcam and face detection before real attendance module.

Components:

- Webcam preview
- Start scan button
- Stop scan button
- Face detected status
- Confidence score placeholder
- Camera permission error
- Test result card

---

## 6.3 Face Registration Page

Route:

```text
/employee/face-registration
```

Flow:

```text
Open camera
Capture face
Generate face data
Submit for approval
Status becomes pending
HR/Admin approves
```

UI:

- Camera box
- Capture button
- Submit button
- Registration status
- Instructions
- Consent check required

---

## 6.4 Face Attendance Page

Route:

```text
/employee/face-attendance
```

UI sections:

- Camera preview
- Face status
- Confidence score
- Location status
- Check-in/check-out suggestion
- Confirm attendance button
- Re-scan button
- Send request button

Required statuses:

```text
Face detected
Face matched
Low confidence
Face not matched
Location verified
Outside location
Attendance marked
```

---

## 6.5 Attendance History Page

Route:

```text
/employee/attendance-history
```

Features:

- Date filter
- Attendance table
- Status badges
- Check-in/check-out time
- Late minutes
- Overtime minutes

---

## 6.6 Correction Request Page

Route:

```text
/employee/correction-request
```

Fields:

- Date
- Request type
- Reason
- Requested check-in time optional
- Requested check-out time optional
- Submit button

Request types:

```text
Missed Check-In
Missed Check-Out
Wrong Time
Location Issue
Face Scan Failed
```

---

## 6.7 Leave Request Page

Route:

```text
/employee/leave-request
```

Fields:

- Leave type
- Start date
- End date
- Reason
- Submit button

---

## 6.8 Monthly Summary Page

Route:

```text
/employee/monthly-summary
```

Show:

- Present days
- Absent days
- Late count
- Overtime hours
- Leave days
- Monthly chart

---

## 6.9 Profile Page

Route:

```text
/employee/profile
```

Show:

- Name
- Email
- Phone
- Employee code
- Branch
- Department
- Shift
- Face registration status
- Consent status

---

# 7. HR Pages

## 7.1 HR Dashboard

Route:

```text
/hr/dashboard
```

Cards:

- Total employees
- Present today
- Absent today
- Late employees
- Overtime employees
- Pending correction requests
- Pending face approvals
- Suspicious scans

Charts:

- Present vs absent
- Late vs on-time
- Department-wise attendance
- Monthly trend

---

## 7.2 Employee Management Page

Route:

```text
/hr/employees
```

Features:

- Add employee
- Edit employee
- Deactivate employee
- Search employee
- Filter by department
- Filter by branch
- Assign shift
- View employee details

---

## 7.3 Face Registration Approval Page

Route:

```text
/hr/face-approvals
```

Features:

- Pending face registrations
- Employee details
- Face capture preview optional
- Approve button
- Reject button
- Re-register request

---

## 7.4 Attendance Records Page

Route:

```text
/hr/attendance-records
```

Features:

- Attendance table
- Date filter
- Employee filter
- Department filter
- Branch filter
- Status filter
- Manual edit with reason

---

## 7.5 Live Attendance Monitor

Route:

```text
/hr/live-attendance
```

Show:

- Live present count
- Live absent count
- Recent check-ins
- Recent check-outs
- Late employees
- Suspicious scans

---

## 7.6 Late Employees Page

Route:

```text
/hr/late-employees
```

Show:

- Employee name
- Department
- Shift
- Check-in time
- Late minutes
- Monthly late count

---

## 7.7 Absent Employees Page

Route:

```text
/hr/absent-employees
```

Show:

- Employee name
- Department
- Shift
- Date
- Contact details
- Notify button optional

---

## 7.8 Overtime Report Page

Route:

```text
/hr/overtime-report
```

Show:

- Employee
- Date
- Check-out time
- Overtime minutes
- Approval status
- Approve/reject button

---

## 7.9 Correction Requests Page

Route:

```text
/hr/correction-requests
```

Features:

- View request
- Approve request
- Reject request
- HR remark
- Update attendance after approval

---

## 7.10 Department Management Page

Route:

```text
/hr/departments
```

Features:

- Add department
- Edit department
- Assign manager
- Activate/deactivate department

---

## 7.11 Shift Management Page

Route:

```text
/hr/shifts
```

Features:

- Add shift
- Edit shift
- Start time
- End time
- Grace period
- Working hours
- Overtime rule

---

## 7.12 Reports Page

Route:

```text
/hr/reports
```

Reports:

- Daily attendance
- Monthly attendance
- Employee-wise
- Department-wise
- Branch-wise
- Late report
- Overtime report
- Suspicious scan report

Export buttons:

- PDF
- Excel
- CSV

---

## 7.13 Suspicious Scan Logs Page

Route:

```text
/hr/suspicious-scans
```

Show:

- Reason
- Employee ID optional
- Confidence score
- Time
- Location
- Status
- Review action

---

## 7.14 HR Settings Page

Route:

```text
/hr/settings
```

Settings:

- Grace period
- Attendance radius
- Overtime approval rule
- Notification settings

---

# 8. Manager Pages

Routes:

```text
/manager/dashboard
/manager/team-attendance
/manager/team-late
/manager/team-absent
/manager/team-corrections
/manager/team-summary
```

Manager can see only team data.

---

# 9. Branch Admin Pages

Routes:

```text
/branch-admin/dashboard
/branch-admin/employees
/branch-admin/departments
/branch-admin/shifts
/branch-admin/attendance
/branch-admin/reports
/branch-admin/settings
```

Branch Admin can see only branch data.

---

# 10. Super Admin Pages

Routes:

```text
/super-admin/dashboard
/super-admin/branches
/super-admin/roles
/super-admin/all-employees
/super-admin/all-attendance
/super-admin/branch-analytics
/super-admin/security-logs
/super-admin/audit-logs
/super-admin/system-settings
```

Super Admin can see all branches and global data.

---

# 11. Reusable Components

Create reusable components:

```text
Sidebar
Navbar
DashboardCard
ChartCard
DataTable
SearchFilter
StatusBadge
Modal
ConfirmDialog
FormInput
SelectInput
DateFilter
ExportButtons
NotificationDropdown
ProfileDropdown
CameraBox
LocationStatusCard
FaceStatusCard
```

---

# 12. Status Badge Colors

Use these status badges:

```text
Present → Green
Absent → Red
Late → Yellow/Orange
Overtime → Purple
Pending → Blue
Approved → Green
Rejected → Red
Suspicious → Red/Orange
```

---

# 13. Responsive Design

The UI must be responsive for:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile requirements:

- Sidebar should collapse
- Cards should stack vertically
- Tables should scroll horizontally
- Buttons should remain visible

# =========================================
# SECTION: DATABASE_UI_TASKS.md
# =========================================

# DATABASE_SCHEMA.md

# FaceTrack AI — Firebase Firestore Database Schema

This file contains the Firebase Firestore database structure for the FaceTrack AI project.

---

# 1. Firestore Collections

Use these Firestore collections:

```text
users
employees
branches
departments
shifts
faceData
attendance
attendanceLogs
suspiciousScans
correctionRequests
leaveRequests
notifications
auditLogs
settings
```

---

# 2. Collection: users

Purpose:

Store login users, role, branch, department, and account status.

Fields:

```text
userId: string
name: string
email: string
phone: string
role: string
branchId: string
departmentId: string
status: string
consentAccepted: boolean
createdAt: timestamp
updatedAt: timestamp
```

Allowed roles:

```text
superAdmin
branchAdmin
hr
manager
employee
```

Status values:

```text
active
inactive
blocked
pending
```

Example:

```json
{
  "userId": "U001",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "role": "employee",
  "branchId": "B001",
  "departmentId": "D001",
  "status": "active",
  "consentAccepted": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

# 3. Collection: employees

Purpose:

Store employee profile and employment data.

Fields:

```text
employeeId: string
userId: string
employeeCode: string
name: string
email: string
phone: string
designation: string
branchId: string
departmentId: string
managerId: string
shiftId: string
faceRegistered: boolean
joiningDate: string
employmentStatus: string
createdAt: timestamp
updatedAt: timestamp
```

Employment status values:

```text
active
inactive
resigned
terminated
```

---

# 4. Collection: branches

Purpose:

Store branch details and branch location for attendance radius verification.

Fields:

```text
branchId: string
branchName: string
address: string
city: string
state: string
latitude: number
longitude: number
allowedRadius: number
branchAdminId: string
status: string
createdAt: timestamp
updatedAt: timestamp
```

Example:

```json
{
  "branchId": "B001",
  "branchName": "Jaipur Head Office",
  "address": "Jaipur, Rajasthan",
  "city": "Jaipur",
  "state": "Rajasthan",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "allowedRadius": 100,
  "branchAdminId": "U002",
  "status": "active"
}
```

---

# 5. Collection: departments

Purpose:

Store department details.

Fields:

```text
departmentId: string
departmentName: string
branchId: string
managerId: string
status: string
createdAt: timestamp
updatedAt: timestamp
```

Example departments:

```text
HR
IT
Sales
Security
Accounts
Operations
Management
```

---

# 6. Collection: shifts

Purpose:

Store shift timing, grace period, and overtime rules.

Fields:

```text
shiftId: string
shiftName: string
branchId: string
startTime: string
endTime: string
gracePeriod: number
workingHours: number
overtimeRule: string
overtimeApprovalAfterMinutes: number
status: string
createdAt: timestamp
updatedAt: timestamp
```

Example:

```json
{
  "shiftId": "S001",
  "shiftName": "Morning Shift",
  "branchId": "B001",
  "startTime": "09:00",
  "endTime": "18:00",
  "gracePeriod": 15,
  "workingHours": 8,
  "overtimeRule": "approval_required_after_60_minutes",
  "overtimeApprovalAfterMinutes": 60,
  "status": "active"
}
```

---

# 7. Collection: faceData

Purpose:

Store employee face descriptor/vector or MVP face data.

Important:

For MVP, simple face data can be stored. For advanced version, secure face descriptor/vector storage is recommended instead of raw face images.

Fields:

```text
faceId: string
employeeId: string
userId: string
faceDescriptor: array
faceImageUrl: string optional
registrationStatus: string
confidenceScore: number
approvedBy: string
rejectedReason: string
createdAt: timestamp
updatedAt: timestamp
```

Registration status values:

```text
pending
approved
rejected
reRegisterRequired
```

---

# 8. Collection: attendance

Purpose:

Store daily attendance records.

Fields:

```text
attendanceId: string
employeeId: string
userId: string
branchId: string
departmentId: string
shiftId: string
date: string
checkInTime: timestamp
checkOutTime: timestamp
totalHours: number
lateMinutes: number
overtimeMinutes: number
attendanceStatus: string
checkInLocation: map
checkOutLocation: map
confidenceScore: number
markedBy: string
approvalStatus: string
hrApprovedBy: string
manualEditReason: string
createdAt: timestamp
updatedAt: timestamp
```

attendanceStatus values:

```text
present
absent
late
halfDay
overtime
pendingApproval
manual
```

approvalStatus values:

```text
approved
pending
rejected
notRequired
```

Location map:

```json
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "locationStatus": "insideRadius",
  "distanceFromBranch": 35
}
```

---

# 9. Collection: attendanceLogs

Purpose:

Store every face scan and attendance action log.

Fields:

```text
logId: string
employeeId: string
userId: string
date: string
scanTime: timestamp
scanType: string
confidenceScore: number
locationStatus: string
faceStatus: string
result: string
reason: string
deviceInfo: string
createdAt: timestamp
```

scanType values:

```text
faceRegistration
checkIn
checkOut
reScan
manualEdit
```

result values:

```text
success
failed
pendingApproval
blocked
```

---

# 10. Collection: suspiciousScans

Purpose:

Store suspicious attendance attempts.

Fields:

```text
suspiciousId: string
employeeId: string optional
userId: string optional
scanTime: timestamp
reason: string
confidenceScore: number
multipleFacesDetected: boolean
location: map
deviceInfo: string
status: string
reviewedBy: string
hrRemark: string
createdAt: timestamp
updatedAt: timestamp
```

Reasons:

```text
multipleFacesDetected
lowConfidence
faceNotMatched
locationMismatch
cameraPermissionDenied
locationPermissionDenied
repeatedFailedAttempts
```

Status values:

```text
pending
reviewed
approved
rejected
ignored
```

---

# 11. Collection: correctionRequests

Purpose:

Store attendance correction requests from employees.

Fields:

```text
requestId: string
employeeId: string
userId: string
attendanceId: string
date: string
requestType: string
reason: string
requestedCheckInTime: string
requestedCheckOutTime: string
status: string
hrRemark: string
reviewedBy: string
createdAt: timestamp
updatedAt: timestamp
```

requestType values:

```text
missedCheckIn
missedCheckOut
wrongTime
locationIssue
faceScanFailed
manualCorrection
```

Status values:

```text
pending
approved
rejected
```

---

# 12. Collection: leaveRequests

Purpose:

Store employee leave requests.

Fields:

```text
leaveId: string
employeeId: string
userId: string
leaveType: string
startDate: string
endDate: string
reason: string
status: string
approvedBy: string
hrRemark: string
createdAt: timestamp
updatedAt: timestamp
```

Leave status values:

```text
pending
approved
rejected
cancelled
```

---

# 13. Collection: notifications

Purpose:

Store user notifications.

Fields:

```text
notificationId: string
userId: string
title: string
message: string
type: string
readStatus: boolean
createdAt: timestamp
```

Notification types:

```text
attendanceMarked
lateMarked
checkOutReminder
correctionRequest
faceRegistrationRequest
suspiciousScan
overtimeApproval
monthlySummary
systemAlert
```

---

# 14. Collection: auditLogs

Purpose:

Store important admin/HR/system actions.

Fields:

```text
auditId: string
userId: string
role: string
action: string
targetModule: string
targetId: string
description: string
createdAt: timestamp
```

Example actions:

```text
employeeCreated
employeeUpdated
attendanceEdited
faceApproved
faceRejected
correctionApproved
correctionRejected
shiftUpdated
branchUpdated
```

---

# 15. Collection: settings

Purpose:

Store branch/system settings.

Fields:

```text
settingId: string
branchId: string
attendanceRadius: number
gracePeriod: number
overtimeRule: string
overtimeApprovalAfterMinutes: number
autoAbsentEnabled: boolean
checkOutReminderEnabled: boolean
notificationSettings: map
updatedBy: string
updatedAt: timestamp
```

---

# 16. Important Database Rules

- Every user must have a role.
- Employees must belong to a branch and department.
- Attendance must be date-wise.
- Duplicate check-in for the same employee and date should not be allowed.
- HR manual attendance edit must store reason.
- Face registration should require HR/Admin approval.
- Suspicious scan logs should be stored for low confidence, multiple faces, and location mismatch.
- Employee cannot directly edit attendance.
- Employee can only send correction request.
- Super Admin can see all branch data.
- Branch Admin can see only assigned branch data.
- Manager can see only team data.
- Employee can see only own data.