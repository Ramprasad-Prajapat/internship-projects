# Mock Resident Flow - Phase 4

This document outlines the mock validation and state flows for the Resident portal.

## State Integrations
1. **Visitor Approvals:** 
   - Clicking "Approve" changes the visitor's status to `Approved`.
   - Clicking "Reject" changes the status to `Rejected`.
   - Updates are saved directly in `MockDataStore.visitorsList`, instantly modifying counts and list render components on both Guard and Resident sides.
2. **Parcel Choices:** 
   - Allow inside -> `Status.PARCEL_DELIVERY_INSIDE` ("Delivery Inside")
   - Keep stored at gate -> `Status.PARCEL_HELD_AT_GATE` ("Held at Gate")
   - Collect at gate -> `Status.PARCEL_WAITING_PICKUP` ("Waiting for Resident Pickup")
   - Reject delivery -> `Status.PARCEL_REJECTED` ("Rejected")
3. **Pre-Approvals:**
   - Pre-approving a visitor adds an entry to `MockDataStore` with `isPreApproved = true` and status `Approved`.
   - Autogenerates a 6-digit OTP and QR code pass (e.g. `PASS-...` using current timestamps).
   - Expected visitors are immediately searchable by the Guard using the manually entered OTP or QR code to trigger check-ins.
