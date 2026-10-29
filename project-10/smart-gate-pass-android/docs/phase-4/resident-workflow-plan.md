# Resident Workflow Plan - Phase 4

This document outlines the planning and workflows implemented for the Flat Resident side of the Smart Gate Pass Management System.

## Module Objectives
- Allow residents to view dynamic statistics related to their flat's security (pending visitors, parcels, and today cleared count).
- Filter all visitor requests, parcel requests, notification histories, and passes by the logged-in resident's `flatNumber` ("B-403" for the test user).
- Enable real-time approval or rejection of visitor requests waiting at the gate.
- Provide clear delivery directive selections for incoming parcels (Allow inside, Hold at gate, Pickup at gate, Reject).
- Allow residents to pre-approve expected visitors with custom name, phone, visit date/time, and validity window.
- Persist state changes in a shared state store so they are immediately reflected on the Guard's screens.
