# Phase 1.5: Design System Specifications

This document catalogs the component-level layout specifications and reusable interfaces implemented to build the dynamic mobile foundation.

---

## 1. Reusable Component Inventory

The application is built on a library of highly interactive, responsive component blocks:

1. **`AppHeader`:** Sticky top app bar. Displays app title, secondary sub-context, user initials avatar, and interactive notification bell with numerical unread badge counters.
2. **`BottomTabBar`:** Global bottom tab bar with Royal Blue navigation states, specific to Guard and Resident screens.
3. **`DashboardCard`:** Displays vital statistics. Includes custom status badges and dynamic color schemes.
4. **`QuickActionButton`:** Responsive 2-column or 3-column action cards. Includes colorful icons and bold labels.
5. **`StatusBadge`:** Pill container with dynamic text and backgrounds driven by current visitor/parcel states.
6. **`TextInputField`:** Secure, structured input. Features distinct leading icons, clear placeholders, and toggleable password masks.
7. **`DropdownField`:** Accessible choice menus. Auto-calculates available selections (e.g., Flat B-403, A-102) and pre-populates dependent fields dynamically.
8. **`PrimaryButton`:** Large Royal Blue primary action trigger.
9. **`SecondaryButton`:** Outlined neutral secondary trigger.
10. **`DangerButton`:** Light red button with sharp crimson borders for critical actions like "Reject".
11. **`SuccessButton`:** Light green button with vibrant green borders for approved actions like "Approve".
12. **`OTPInput`:** Structured 6-box input panel with automatic alignment indicators.
13. **`QRScannerPlaceholder`:** Semi-transparent fullscreen layer overlay with interactive focus target borders and manual override inputs.
14. **`ActivityCard`:** Multi-line log item. Contains initials-avatar, title, subtitle, timestamps, status badge, and trailing navigation arrows.
15. **`NotificationCard`:** Light-tinted card with a left-aligned read/unread bubble and action listener hooks.
16. **`EmptyState`:** Clean informational placeholder with icons, descriptive instructions, and CTAs.
17. **`LoadingState`:** Centered spinning loading indicator.
18. **`ErrorState`:** Diagnostic alert container with inline retry actions.
19. **`ConfirmationModal`:** Floating verification overlay with double-button choices.

---

## 2. Layout Structure

* **Grid Base:** Leverages an 8dp spacing grid (`8dp`, `16dp`, `24dp`, `32dp`) for consistent component margins and horizontal padding.
* **Rounded Corners:** 12dp on form inputs/buttons, 16dp on dashboard statistics cards, and 24dp on card panels.
* **Safe Area Integration:** The layout utilizes Jetpack Compose Scaffold window insets to automatically pad navigation and status bars.
