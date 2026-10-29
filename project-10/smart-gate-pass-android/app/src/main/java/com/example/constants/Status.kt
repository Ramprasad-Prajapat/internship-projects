package com.example.constants

import androidx.compose.ui.graphics.Color
import com.example.ui.theme.*

object Status {
    // Visitor Statuses
    const val VISITOR_PENDING = "Pending Approval"
    const val VISITOR_APPROVED = "Approved"
    const val VISITOR_REJECTED = "Rejected"
    const val VISITOR_OTP_GENERATED = "OTP Generated"
    const val VISITOR_QR_GENERATED = "QR Generated"
    const val VISITOR_OTP_VERIFIED = "OTP Verified"
    const val VISITOR_QR_VERIFIED = "QR Verified"
    const val VISITOR_CHECKED_IN = "Checked In"
    const val VISITOR_CHECKED_OUT = "Checked Out"
    const val VISITOR_EXPIRED = "Expired"
    const val VISITOR_BLOCKED = "Blocked"

    // Parcel Statuses
    const val PARCEL_PENDING = "Pending Approval"
    const val PARCEL_APPROVED = "Approved"
    const val PARCEL_REJECTED = "Rejected"
    const val PARCEL_HELD_AT_GATE = "Held at Gate"
    const val PARCEL_WAITING_PICKUP = "Waiting for Resident Pickup"
    const val PARCEL_DELIVERY_INSIDE = "Delivery Inside"
    const val PARCEL_DELIVERED = "Delivered to Resident"
    const val PARCEL_RETURNED = "Returned"
    const val PARCEL_CANCELLED = "Cancelled"

    /**
     * Retrieves the text color associated with a given status.
     */
    fun getStatusTextColor(status: String): Color {
        return when (status) {
            VISITOR_PENDING, PARCEL_PENDING, PARCEL_WAITING_PICKUP -> WarningAmber
            VISITOR_APPROVED, VISITOR_OTP_VERIFIED, VISITOR_QR_VERIFIED,
            VISITOR_CHECKED_IN, PARCEL_APPROVED, PARCEL_DELIVERED -> SuccessGreen
            VISITOR_REJECTED, VISITOR_EXPIRED, PARCEL_REJECTED, PARCEL_CANCELLED -> DangerRed
            VISITOR_OTP_GENERATED, VISITOR_QR_GENERATED, PARCEL_HELD_AT_GATE, PARCEL_DELIVERY_INSIDE -> RoyalBlue
            VISITOR_CHECKED_OUT, PARCEL_RETURNED -> SecondaryText
            VISITOR_BLOCKED -> Color(0xFF991B1B) // Dark Red
            else -> PrimaryText
        }
    }

    /**
     * Retrieves the background container color associated with a given status.
     */
    fun getStatusContainerColor(status: String): Color {
        return when (status) {
            VISITOR_PENDING, PARCEL_PENDING, PARCEL_WAITING_PICKUP -> WarningAmberMuted
            VISITOR_APPROVED, VISITOR_OTP_VERIFIED, VISITOR_QR_VERIFIED,
            VISITOR_CHECKED_IN, PARCEL_APPROVED, PARCEL_DELIVERED -> SuccessGreenMuted
            VISITOR_REJECTED, VISITOR_EXPIRED, PARCEL_REJECTED, PARCEL_CANCELLED -> DangerRedMuted
            VISITOR_OTP_GENERATED, VISITOR_QR_GENERATED, PARCEL_HELD_AT_GATE, PARCEL_DELIVERY_INSIDE -> RoyalBlueMuted
            VISITOR_CHECKED_OUT, PARCEL_RETURNED -> PrimaryNavyMuted
            VISITOR_BLOCKED -> Color(0xFFFEE2E2) // Light red container for blocked
            else -> BackgroundColor
        }
    }
}
