# Resident Service Plan - Phase 4

This document covers the API-ready mock service definitions for the Resident Portal.

## Resident Services List
The following helper interfaces have been declared in `Services.kt` and `MockDataStore` and are fully integrated with the Composable screens:

- **`getResidentVisitorRequests(flatNo: String)`** -> Fetches pending visitor entries assigned to flat.
- **`approveVisitorRequest(id: String)`** -> Approves visitor entry request.
- **`rejectVisitorRequest(id: String)`** -> Rejects visitor entry request.
- **`getResidentParcelRequests(flatNo: String)`** -> Fetches pending parcel records logged for flat.
- **`updateParcelDecision(id: String, option: Int)`** -> Maps the resident's selection to the correct parcel status.
- **`addExpectedVisitor(...)`** -> Pre-approves a guest and inserts their record into the shared list.
- **`getMyVisitors(flatNo: String)`** -> Retrieves full visitor logs.
- **`getMyParcels(flatNo: String)`** -> Retrieves full parcel logs.
- **`getResidentNotifications(flatNo: String)`** -> Filters alerts that contain the flat ID.
- **`getResidentPasses(flatNo: String)`** -> Looks up active pre-approved guest passes.
