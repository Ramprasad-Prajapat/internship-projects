# Guard Context Plan - Phase 3

This document covers the shared context state manager for the Guard Portal.

## Data Store Structure
Managed in both Javascript context template (`mobile-app/src/context/GuardDataContext.js`) and Kotlin state store (`MockDataStore` in `MockData.kt`):
- `visitorRequests` / `visitorsList`: Live array of visitors.
- `parcelRequests` / `parcelsList`: Live array of parcels.
- `notificationsList`: Recent security alerts.

## Shared Methods
- `addVisitorRequest()` / `addVisitor()`: Appends new entries with status `Pending Approval`.
- `addParcelRequest()` / `addParcel()`: Appends new package log with status `Pending Approval`.
- `markVisitorCheckIn()` / `setVisitorStatus(..., Status.VISITOR_CHECKED_IN)`: Updates visitor to `Checked In` and sets current time.
- `markVisitorCheckOut()` / `setVisitorStatus(..., Status.VISITOR_CHECKED_OUT)`: Sets exit time and shifts visitor to historical records.
- `updateParcelStatus()` / `setParcelStatus()`: Modifies status dynamically (e.g. Delivered, Held at Gate, Rejected).
