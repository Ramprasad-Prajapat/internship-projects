package com.example.constants

object Routes {
    // Auth Routes
    const val SPLASH = "splash"
    const val LOGIN = "login"
    const val ROLE_REDIRECT = "role_redirect"
    const val UNAUTHORIZED = "unauthorized"

    // Guard Routes
    const val GUARD_DASHBOARD = "guard_dashboard"
    const val ADD_VISITOR = "add_visitor"
    const val ADD_PARCEL = "add_parcel"
    const val GUARD_PENDING_REQUESTS = "guard_pending"
    const val PENDING_REQUESTS = "pending_requests" // Alias/Alternate if referenced
    const val SCAN_QR = "scan_qr"
    const val VERIFY_OTP = "verify_otp"
    const val INSIDE_VISITORS = "inside_visitors"
    const val CHECKOUT_VISITOR = "checkout_visitor"
    const val PARCEL_RECORDS = "parcel_records"

    // Resident Routes
    const val RESIDENT_DASHBOARD = "resident_dashboard"
    const val VISITOR_REQUESTS = "visitor_requests"
    const val PARCEL_REQUESTS = "parcel_requests"
    const val ADD_EXPECTED_VISITOR = "add_expected_visitor"
    const val MY_VISITORS = "my_visitors"
    const val MY_PARCELS = "my_parcels"
    const val OTP_QR_PASS = "otp_qr_pass" // Core route prefix
    const val NOTIFICATION_HISTORY = "notification_history"
}
