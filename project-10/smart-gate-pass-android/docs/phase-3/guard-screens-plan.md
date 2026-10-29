# Guard Screens Plan - Phase 3

This document lists and details the completed Guard mobile screens for Phase 3.

## Screens Overview
1. **Guard Dashboard:** Quick summary cards of visitors/parcels today and actions to Add Visitor, Add Parcel, Scan QR, Verify OTP, or view Parcel Records.
2. **Add Visitor:** Local state form validation checking name/phone, calling `VisitorService.createVisitor()` to insert pending records.
3. **Add Parcel:** Delivery person form details, calling `ParcelService.createParcel()` to log new packages.
4. **Gate Pending Queue:** Tabbed view displaying active requests awaiting approval, as well as allowing direct check-in of pre-approved entries.
5. **Scan QR Screen:** Manual verification dialog checking codes `VISITOR-QR-001` (Uncle David check-in) and `PARCEL-QR-001` (Amazon/FedEx parcel approval).
6. **Verify OTP Screen:** Code keypad interface validating mock values `123456` and `482913` (success) and rejecting expired `000000` or invalid entries.
7. **Gate Activity Feed (Inside List):** Renders all current inside guests, directing checked-out visitors to history log.
8. **Confirm Outward Exit (Checkout Screen):** Summary card showing detailed visitor logs prior to finalizing checkout and computing exit time.
9. **Parcel Records Screen:** Listing hub of all parcels with interactive filter chips (All, Pending, Held at Gate, Delivered, Rejected) and status updates.
