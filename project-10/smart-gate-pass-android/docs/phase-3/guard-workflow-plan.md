# Guard Workflow Plan - Phase 3

This document outlines the planning and specifications for the Guard Workflow module of the Smart Gate Pass Management System.

## Module Objectives
- Allow guards to log incoming visitor requests.
- Allow guards to log incoming parcel packages.
- Implement checkout exit management for visitors currently inside.
- Support pre-approved visitor checks via mock verification protocols (OTP / QR code).
- Render historical and active data in a single source of truth context.

## Workflow Pipeline
1. **Visitor Entry logging:** Guard records name, phone, purpose, flat number, vehicle (optional) -> Status: `Pending Approval`.
2. **Parcel Delivery logging:** Guard records courier info, company, tracking ID, flat number -> Status: `Pending Approval`.
3. **Pending Approvals Queue:** Tabbed queue for guards to monitor resident approvals or check in already pre-approved visitors.
4. **Active Inside List:** Tracks current visitors with `Checked In` status, offering immediate outward checkout action.
5. **OTP/QR Code Verification:** Direct processing of gate passes using mock keys (`123456`, `482913` for OTP; `VISITOR-QR-001` or `PARCEL-QR-001` for QR passes).
