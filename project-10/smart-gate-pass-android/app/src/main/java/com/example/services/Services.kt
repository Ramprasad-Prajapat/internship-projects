package com.example.services

import com.example.constants.Status
import com.example.data.MockDataStore
import com.example.data.ParcelRequest
import com.example.data.VisitorRequest
import com.example.storage.AuthUser
import com.example.storage.TokenStorage
import java.time.LocalTime
import java.time.format.DateTimeFormatter
object AuthService {
    val loggedInUserRole: String? get() = TokenStorage.getUser()?.role
    val loggedInUserFlat: String get() = TokenStorage.getUser()?.flatNumber ?: "B-403"
    val loggedInUserName: String get() = TokenStorage.getUser()?.name ?: "Ananya Sharma"

    fun login(phone: String, password: String, onResult: (Boolean, String?) -> Unit) {
        if (phone.trim().isEmpty() || password.trim().isEmpty()) {
            onResult(false, "Mobile number or email and password are required")
            return
        }

        // Simple mock validation
        when {
            (phone == "9999999999" || phone.contains("guard", ignoreCase = true) || phone == "1111") && 
            (password == "guard123" || password == "1111") -> {
                val user = AuthUser(
                    id = 1,
                    name = "Guard User",
                    mobile = "9999999999",
                    role = "GUARD",
                    token = "mock-guard-token"
                )
                TokenStorage.saveUser(user)
                TokenStorage.saveToken(user.token)
                onResult(true, "GUARD")
            }
            (phone == "8888888888" || phone.contains("resident", ignoreCase = true) || phone == "2222") && 
            (password == "resident123" || password == "2222") -> {
                val user = AuthUser(
                    id = 2,
                    name = "Resident User",
                    mobile = "8888888888",
                    role = "RESIDENT",
                    flatNumber = "B-403",
                    token = "mock-resident-token"
                )
                TokenStorage.saveUser(user)
                TokenStorage.saveToken(user.token)
                onResult(true, "RESIDENT")
            }
            phone == "7777777777" && password == "admin123" -> {
                val user = AuthUser(
                    id = 3,
                    name = "Admin User",
                    mobile = "7777777777",
                    role = "ADMIN",
                    token = "mock-admin-token"
                )
                TokenStorage.saveUser(user)
                TokenStorage.saveToken(user.token)
                onResult(true, "ADMIN")
            }
            else -> {
                onResult(false, "Invalid mobile number or password")
            }
        }
    }

    fun logout() {
        TokenStorage.clearAuthData()
    }

    fun getCurrentUser(): AuthUser? {
        return TokenStorage.getUser()
    }

    fun checkAuthStatus(): Boolean {
        return TokenStorage.getToken() != null && TokenStorage.getUser() != null
    }

    fun validateRole(role: String): Boolean {
        return TokenStorage.getUser()?.role == role
    }
}

object VisitorService {
    fun createVisitor(name: String, phone: String, flatNo: String, purpose: String, vehicleNo: String?, count: Int) {
        val req = VisitorRequest(
            id = "VIS-${System.currentTimeMillis()}",
            name = name,
            phone = phone,
            flatNo = flatNo,
            purpose = purpose,
            vehicleNo = vehicleNo,
            visitorCount = count,
            residentName = if (flatNo == "B-403") "Ananya Sharma" else "John Smith"
        )
        MockDataStore.addVisitor(req)
    }

    fun approveVisitor(id: String) {
        MockDataStore.setVisitorStatus(id, Status.VISITOR_APPROVED)
    }

    fun rejectVisitor(id: String) {
        MockDataStore.setVisitorStatus(id, Status.VISITOR_REJECTED)
    }

    // Phase 4 API-ready aliases
    fun approveVisitorRequest(id: String) = approveVisitor(id)
    fun rejectVisitorRequest(id: String) = rejectVisitor(id)

    fun checkInVisitor(id: String) {
        // Only allow check-in if visitor is approved and not already checked in
        val visitor = MockDataStore.visitorsList.firstOrNull { it.id == id }
        if (visitor != null && visitor.status == Status.VISITOR_APPROVED) {
            // Use current time for entry
            val currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"))
            MockDataStore.setVisitorStatus(id, Status.VISITOR_CHECKED_IN, currentTime)
        }
    }



    fun checkOutVisitor(id: String) {
        // Only allow checkout if visitor is currently checked in
        val visitor = MockDataStore.visitorsList.firstOrNull { it.id == id }
        if (visitor != null && visitor.status == Status.VISITOR_CHECKED_IN) {
            val currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"))
            MockDataStore.setVisitorStatus(id, Status.VISITOR_CHECKED_OUT, currentTime)
        }
    }



    fun preApproveVisitor(
        name: String,
        phone: String,
        expectedDate: String,
        purpose: String,
        expectedTime: String = "12:00 PM",
        validityTime: String = "24 Hours"
    ): VisitorRequest {
        val req = VisitorRequest(
            id = "VIS-${System.currentTimeMillis()}",
            name = name,
            phone = phone,
            purpose = purpose,
            flatNo = AuthService.loggedInUserFlat,
            residentName = AuthService.loggedInUserName,
            status = Status.VISITOR_APPROVED,
            isPreApproved = true,
            otp = (100000..999999).random().toString(),
            qrCode = "PASS-${System.currentTimeMillis()}",
            visitDate = expectedDate,
            visitTime = expectedTime,
            validityTime = validityTime
        )
        MockDataStore.addVisitor(req)
        return req
    }

    // Phase 4 API-ready alias
    fun addExpectedVisitor(
        name: String,
        phone: String,
        expectedDate: String,
        expectedTime: String,
        purpose: String,
        validityTime: String
    ) = preApproveVisitor(
        name = name,
        phone = phone,
        expectedDate = expectedDate,
        purpose = purpose,
        expectedTime = expectedTime,
        validityTime = validityTime
    )
}

object ParcelService {
    fun createParcel(company: String, courier: String, phone: String, flatNo: String, type: String, orderId: String?) {
        val req = ParcelRequest(
            id = "PAR-${System.currentTimeMillis()}",
            companyName = company,
            courierName = courier,
            phone = phone,
            flatNo = flatNo,
            residentName = if (flatNo == "B-403") "Ananya Sharma" else "John Smith",
            parcelType = type,
            orderId = orderId
        )
        MockDataStore.addParcel(req)
    }

    fun updateParcelStatus(id: String, option: Int) {
        val newStatus = when (option) {
            1 -> Status.PARCEL_DELIVERY_INSIDE
            2 -> Status.PARCEL_HELD_AT_GATE
            3 -> Status.PARCEL_WAITING_PICKUP
            4 -> Status.PARCEL_REJECTED
            else -> Status.PARCEL_PENDING
        }
        MockDataStore.setParcelStatus(id, newStatus, option)
    }

    // Phase 4 API-ready alias
    fun updateParcelDecision(id: String, option: Int) = updateParcelStatus(id, option)
}
