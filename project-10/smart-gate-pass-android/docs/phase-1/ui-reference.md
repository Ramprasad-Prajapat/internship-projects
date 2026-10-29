# Phase 1.5: UI Design Lock & Reference Manual

This document details the locked visual design tokens and screens for the **Smart Gate Pass Management System** mobile application. Future development phases must strictly preserve these guidelines without altering layout structures, spacing, or visual styling.

---

## 1. Core Visual Theme (The "Professional Security" Theme)

The application employs a crisp, professional, high-contrast palette optimized for high legibility under varying lighting conditions (such as guards operating outdoors at gates).

| Color Token | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Primary Navy** | `#0F172A` | Primary headers, dark titles, and text contrast |
| **Royal Blue** | `#2563EB` | Primary branding accents, scan buttons, and active tabs |
| **Success Green** | `#10B981` | Approved status badge background, positive CTA |
| **Warning Amber** | `#F59E0B` | Pending status badge background, warnings, alerts |
| **Danger Red** | `#EF4444` | Reject status badge, error states, delete actions |
| **Background Gray** | `#F8FAFC` | Screen backgrounds, container scaffolding |
| **Card Background** | `#FFFFFF` | Form cards, activity rows, statistic layouts |
| **Secondary Text** | `#6B7280` | Subtitles, labels, secondary information blocks |
| **Muted Text** | `#9CA3AF` | Form placeholders, subtle timestamps |
| **Border Gray** | `#E5E7EB` | Fields outline, container dividers |

---

## 2. Dynamic Status-Based Badge Color Matrix

Status badges must dynamically color-code according to their respective lifecycle stages:

| Status State | Text Color | Background Pill tint | Category |
| :--- | :--- | :--- | :--- |
| **Pending Approval** | Warning Amber (`#F59E0B`) | Amber Muted (`#FEF3C7`) | Both |
| **Approved** | Success Green (`#10B981`) | Green Muted (`#D1FAE5`) | Both |
| **Rejected** | Danger Red (`#EF4444`) | Red Muted (`#FEE2E2`) | Both |
| **OTP Generated** | Royal Blue (`#2563EB`) | Blue Muted (`#DBEAFE`) | Visitor |
| **QR Generated** | Royal Blue (`#2563EB`) | Blue Muted (`#DBEAFE`) | Visitor |
| **OTP Verified** | Success Green (`#10B981`) | Green Muted (`#D1FAE5`) | Visitor |
| **QR Verified** | Success Green (`#10B981`) | Green Muted (`#D1FAE5`) | Visitor |
| **Checked In** | Success Green (`#10B981`) | Green Muted (`#D1FAE5`) | Visitor |
| **Checked Out** | Secondary Text (`#6B7280`) | Navy Muted (`#E2E8F0`) | Visitor |
| **Expired** | Danger Red (`#EF4444`) | Red Muted (`#FEE2E2`) | Visitor |
| **Blocked** | Dark Red (`#991B1B`) | Red Muted (`#FEE2E2`) | Visitor |
| **Held at Gate** | Royal Blue (`#2563EB`) | Blue Muted (`#DBEAFE`) | Parcel |
| **Waiting for Pickup**| Warning Amber (`#F59E0B`) | Amber Muted (`#FEF3C7`) | Parcel |
| **Delivery Inside** | Royal Blue (`#2563EB`) | Blue Muted (`#DBEAFE`) | Parcel |
| **Delivered to Flat** | Success Green (`#10B981`) | Green Muted (`#D1FAE5`) | Parcel |
| **Returned** | Secondary Text (`#6B7280`) | Navy Muted (`#E2E8F0`) | Parcel |
| **Cancelled** | Danger Red (`#EF4444`) | Red Muted (`#FEE2E2`) | Parcel |

---

## 3. UI Layout & Typography Rules

1. **Touch Targets:** All interactive triggers, options, and tabs maintain a minimum interactive surface of `48.dp` x `48.dp` in compliance with Android accessibility guidelines.
2. **Scaffold & Insets:** Dynamic edge-to-edge screens using window insets to prevent UI rendering behind notches, status bars, and home screen gestures.
3. **Typography:** Consistent sizing hierarchy with Bold titles (24sp), SemiBold headers (16sp), Medium secondary text (13sp), and Bold status labels (10sp).
4. **Form Inputs:** Filled backgrounds, 12dp rounded corner contours, distinct leading icons (Person, Lock, Phone), and bright active borders.
