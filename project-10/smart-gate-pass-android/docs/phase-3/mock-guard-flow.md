# Mock Guard Flow - Phase 3

This document explains the mock execution logic of the Guard portal workflows.

## Mock OTP Records
- **OTP `123456`:** Verifies visitor "Uncle David" and checks him in.
- **OTP `482913`:** Verifies visitor "Ramesh Kumar" and checks him in.
- **OTP `000000`:** Throws expired code error block.
- **Other OTPs:** Fallback to invalid credentials error.

## Mock QR Pass Codes
- **Manual Input `VISITOR-QR-001`:** Verifies Uncle David's digital pass, checking him in.
- **Manual Input `PARCEL-QR-001`:** Verifies FedEx express parcel pass, marking it as approved.
- **Other codes:** Return invalid QR error.

## Status Transits
- Visitor: `Pending Approval` -> `Approved` -> `Checked In` -> `Checked Out`.
- Parcel: `Pending Approval` -> `Held at Gate` -> `Delivered to Resident` / `Rejected`.
