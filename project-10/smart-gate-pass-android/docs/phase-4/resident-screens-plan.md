# Resident Screens Plan - Phase 4

This document catalogues the 8 completed Resident mobile screens for Phase 4.

## Screen Directory
1. **Resident Dashboard Screen:** 
   - Dynamically displays pending visitor/parcel counts and today's approved counts for the resident's flat.
   - Provides quick action navigation buttons.
   - Shows the 3 most recent visitor logs for the flat.
2. **Visitor Requests Screen:** 
   - Shows incoming requests.
   - If status is `Pending Approval`, displays Approve and Reject buttons.
   - If status is resolved (Approved/Rejected), displays only the status badge to prevent double clicks.
3. **Parcel Requests Screen:** 
   - Shows active parcel logs.
   - Offers an options dialog (Allow inside, Hold at gate, Pickup at gate, Reject).
   - Shows action buttons only for `Pending Approval` items.
4. **Add Expected Visitor Screen:** 
   - Input forms for Guest Name, Phone (10 digits validation), Expected Date, Visit Time, and Validity Time.
   - Saves to the shared store with status `Approved`.
5. **My Visitors History Screen:** 
   - Comprehensive visitor history page with horizontal scrollable status chips filter (All, Pending, Approved, Checked In, Checked Out, Rejected).
6. **My Parcels History Screen:** 
   - Comprehensive package logs with filter chips (All, Pending, Held at Gate, Delivery Inside, Delivered, Rejected).
7. **OTP / QR Pass Screen:** 
   - Renders pre-approved visitor or parcel pass details (Name/Company, validity period, OTP, QR code placeholder).
8. **Notification History Screen:** 
   - Shows alerts containing the resident's flat number. Offers a "Mark all read" shortcut.
