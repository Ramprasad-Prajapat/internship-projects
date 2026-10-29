# Guard Service Plan - Phase 3

This document lists the API-ready mock helper classes and services.

## Services Specification
- **VisitorService:** Dispatches new visitor requests, manages approvals/rejections, and tracks check-in/check-out status.
- **ParcelService:** Controls logging of new delivery packages and coordinates choice updates.
- **NotificationService:** Coordinates system and entry alerts for guards and residents.

These helper services act as standard wrappers around `MockDataStore` / `GuardDataContext`. No real remote network requests are fired in this phase, allowing offline testing and rapid compilation.
