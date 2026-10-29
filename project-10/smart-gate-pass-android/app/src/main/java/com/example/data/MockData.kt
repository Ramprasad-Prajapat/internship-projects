package com.example.data

import androidx.compose.runtime.mutableStateListOf
import com.example.constants.Status
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.*

// Data Models
data class VisitorRequest(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val phone: String,
    val purpose: String,
    val flatNo: String,
    val residentName: String,
    val guardName: String = "Officer Lee",
    val requestTime: String = "Just Now",
    var status: String = Status.VISITOR_PENDING,
    val vehicleNo: String? = null,
    val visitorCount: Int = 1,
    val entryTime: String? = null,
    val exitTime: String? = null,
    val otp: String = (100000..999999).random().toString(),
    val qrCode: String = "PASS-${(1000..9999).random()}",
    val isPreApproved: Boolean = false,
    val visitDate: String = "Today",
    val visitTime: String = "12:00 PM",
    val validityTime: String = "24 Hours"
)

data class ParcelRequest(
    val id: String = UUID.randomUUID().toString(),
    val companyName: String, // e.g. "Amazon"
    val courierName: String, // e.g. "Rohan Das"
    val phone: String,
    val flatNo: String,
    val residentName: String,
    val parcelType: String = "Box",
    val orderId: String? = null,
    var status: String = Status.PARCEL_PENDING,
    val receivedTime: String = "Just Now",
    val deliveredTime: String? = null,
    var choiceOption: Int? = null // 1: Allow inside, 2: Keep at gate, 3: Will collect, 4: Reject
)

data class NotificationItem(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val body: String,
    val type: String, // "VISITOR" or "PARCEL" or "SYSTEM"
    var isRead: Boolean = false,
    val timestamp: String = "10 mins ago"
)

data class ActivityItem(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val subtitle: String,
    val time: String,
    val status: String,
    val isVisitor: Boolean,
    val avatarInitial: String = name.firstOrNull()?.toString() ?: "V"
)

// Global Stateful Store
object MockDataStore {
    // Helper to compare flats ignoring case and whitespace
    private fun sameFlat(a: String, b: String): Boolean = a.trim().equals(b.trim(), ignoreCase = true)
    // Initial datasets loaded dynamically
    val visitorsList = mutableStateListOf<VisitorRequest>(
        VisitorRequest(
            id = "1",
            name = "Marcus Thompson",
            phone = "+1 (555) 012-3456",
            purpose = "Maintenance Delivery",
            flatNo = "B-403",
            residentName = "Ananya Sharma",
            guardName = "Officer Lee",
            requestTime = "10:45 AM",
            status = Status.VISITOR_PENDING
        ),
        VisitorRequest(
            id = "2",
            name = "Sarah Jenkins",
            phone = "+1 (555) 987-6543",
            purpose = "Parcel Delivery",
            flatNo = "A-102",
            residentName = "John Smith",
            guardName = "Officer Chen",
            requestTime = "10:32 AM",
            status = Status.VISITOR_PENDING
        ),
        VisitorRequest(
            id = "3",
            name = "John Doe",
            phone = "+91 98765 43210",
            purpose = "Guest",
            flatNo = "B-403",
            residentName = "Ananya Sharma",
            guardName = "Officer Lee",
            requestTime = "09:15 AM",
            status = Status.VISITOR_CHECKED_IN,
            entryTime = "09:20 AM"
        ),
        VisitorRequest(
            id = "4",
            name = "Sarah Williams",
            phone = "+91 91234 56789",
            purpose = "Guest",
            flatNo = "C-101",
            residentName = "Ananya Sharma",
            guardName = "Officer Lee",
            requestTime = "Yesterday",
            status = Status.VISITOR_CHECKED_OUT,
            entryTime = "Yesterday 04:00 PM",
            exitTime = "Yesterday 06:15 PM"
        ),
        VisitorRequest(
            id = "5",
            name = "Uncle David",
            phone = "+91 99887 76655",
            purpose = "Family",
            flatNo = "B-403",
            residentName = "Ananya Sharma",
            guardName = "Officer Lee",
            requestTime = "Tomorrow",
            status = Status.VISITOR_OTP_GENERATED,
            otp = "123456",
            qrCode = "VISITOR-QR-001",
            isPreApproved = true
        ),
        VisitorRequest(
            id = "6",
            name = "Ramesh Kumar",
            phone = "+91 98989 89898",
            purpose = "Plumber",
            flatNo = "A-102",
            residentName = "John Smith",
            guardName = "Officer Lee",
            requestTime = "Today",
            status = Status.VISITOR_OTP_GENERATED,
            otp = "482913",
            qrCode = "PASS-8888",
            isPreApproved = true
        ),
        VisitorRequest(
            id = "7",
            name = "Expired Guest",
            phone = "+91 91919 19191",
            purpose = "Delivery",
            flatNo = "C-101",
            residentName = "Ananya Sharma",
            guardName = "Officer Lee",
            requestTime = "Yesterday",
            status = Status.VISITOR_EXPIRED,
            otp = "000000",
            qrCode = "PASS-9999",
            isPreApproved = true
        )
    )

    val parcelsList = mutableStateListOf<ParcelRequest>(
        ParcelRequest(
            id = "1",
            companyName = "Amazon Delivery",
            courierName = "Rohan Das",
            phone = "+91 88888 77777",
            flatNo = "B-403",
            residentName = "Ananya Sharma",
            status = Status.PARCEL_PENDING,
            receivedTime = "10:15 AM"
        ),
        ParcelRequest(
            id = "2",
            companyName = "FedEx Express",
            courierName = "Vikram Singh",
            phone = "+91 77777 66666",
            flatNo = "A-102",
            residentName = "John Smith",
            status = Status.PARCEL_HELD_AT_GATE,
            receivedTime = "09:30 AM"
        ),
        ParcelRequest(
            id = "3",
            companyName = "DHL Courier",
            courierName = "Sanjay Dutt",
            phone = "+91 66666 55555",
            flatNo = "C-101",
            residentName = "Ananya Sharma",
            status = Status.PARCEL_DELIVERED,
            receivedTime = "08:12 AM",
            deliveredTime = "08:30 AM"
        )
    )

    val notificationsList = mutableStateListOf<NotificationItem>(
        NotificationItem(
            id = "1",
            title = "New Visitor Request",
            body = "Marcus Thompson is waiting at Gate 4 for B-403.",
            type = "VISITOR",
            isRead = false,
            timestamp = "Just Now"
        ),
        NotificationItem(
            id = "2",
            title = "Parcel Waiting at Gate",
            body = "Amazon Delivery has arrived for flat B-403.",
            type = "PARCEL",
            isRead = false,
            timestamp = "15 mins ago"
        ),
        NotificationItem(
            id = "3",
            title = "Visitor Entry Confirmed",
            body = "John Doe has entered through Main Gate.",
            type = "VISITOR",
            isRead = true,
            timestamp = "1 hour ago"
        )
    )

    // Dynamic stats trackers
    fun getGuardStats(): Map<String, Int> {
        val todayCount = visitorsList.size
        val pendingCount = visitorsList.count { it.status == Status.VISITOR_PENDING }
        val insideCount = visitorsList.count { it.status == Status.VISITOR_CHECKED_IN }
        val pendingParcels = parcelsList.count { it.status == Status.PARCEL_PENDING || it.status == Status.PARCEL_HELD_AT_GATE }
        return mapOf(
            "todayVisitors" to todayCount,
            "pendingApprovals" to pendingCount,
            "insideVisitors" to insideCount,
            "pendingParcels" to pendingParcels
        )
    }

    fun getResidentStats(flatNo: String = "B-403"): Map<String, Int> {
        val trimmed = flatNo.trim()
        val pendingVisitors = visitorsList.count { sameFlat(it.flatNo, trimmed) && !it.isPreApproved && it.status == Status.VISITOR_PENDING }
        val pendingParcels = parcelsList.count { sameFlat(it.flatNo, trimmed) && (it.status == Status.PARCEL_PENDING || it.status == Status.PARCEL_HELD_AT_GATE) }
        val todayApproved = visitorsList.count { sameFlat(it.flatNo, trimmed) && (it.status == Status.VISITOR_APPROVED || it.status == Status.VISITOR_CHECKED_IN) }
        return mapOf(
            "pendingVisitors" to pendingVisitors,
            "pendingParcels" to pendingParcels,
            "todayApproved" to todayApproved
        )
    }

    // Interactive Action APIs (Updates global state, automatically driving Composable re-evaluation!)
    fun addVisitor(request: VisitorRequest) {
        visitorsList.add(0, request)
        val title = if (request.isPreApproved) "Gate Pass Created" else "New Visitor Request"
        val body = if (request.isPreApproved) 
            "Pre-approved gate pass generated for ${request.name} (Flat ${request.flatNo})."
        else 
            "${request.name} is waiting at Gate for ${request.flatNo}."

        notificationsList.add(0, NotificationItem(
            id = "NOTIF-${System.currentTimeMillis()}",
            title = title,
            body = body,
            type = "VISITOR"
        ))
        com.example.storage.LocalDataStorage.saveData()
    }

    fun addParcel(request: ParcelRequest) {
        parcelsList.add(0, request)
        notificationsList.add(0, NotificationItem(
            id = "NOTIF-${System.currentTimeMillis()}",
            title = "New Parcel Arrived",
            body = "${request.companyName} package logged for ${request.flatNo}.",
            type = "PARCEL"
        ))
        com.example.storage.LocalDataStorage.saveData()
    }

    fun setVisitorStatus(id: String, newStatus: String, entryOrExitTime: String? = "11:00 AM") {
        val index = visitorsList.indexOfFirst { it.id == id }
        if (index != -1) {
            val item = visitorsList[index]
            visitorsList[index] = item.copy(
                status = newStatus,
                entryTime = if (newStatus == Status.VISITOR_CHECKED_IN) entryOrExitTime else item.entryTime,
                exitTime = if (newStatus == Status.VISITOR_CHECKED_OUT) entryOrExitTime else item.exitTime
            )

            // Log corresponding notification update
            notificationsList.add(0, NotificationItem(
                id = "NOTIF-${System.currentTimeMillis()}",
                title = "Visitor Status Updated",
                body = "Visitor ${item.name} for ${item.flatNo} is now: $newStatus.",
                type = "VISITOR"
            ))
            com.example.storage.LocalDataStorage.saveData()
        }
    }

    fun setParcelStatus(id: String, newStatus: String, optionSelected: Int? = null) {
        val index = parcelsList.indexOfFirst { it.id == id }
        if (index != -1) {
            val item = parcelsList[index]
            parcelsList[index] = item.copy(
                status = newStatus,
                choiceOption = optionSelected ?: item.choiceOption,
                deliveredTime = if (newStatus == Status.PARCEL_DELIVERED) "11:15 AM" else item.deliveredTime
            )

            notificationsList.add(0, NotificationItem(
                id = "NOTIF-${System.currentTimeMillis()}",
                title = "Parcel Status Updated",
                body = "Parcel ${item.companyName} is now: $newStatus.",
                type = "PARCEL"
            ))
            com.example.storage.LocalDataStorage.saveData()
        }
    }

    fun markNotificationsAsRead() {
        for (i in notificationsList.indices) {
            notificationsList[i] = notificationsList[i].copy(isRead = true)
        }
        com.example.storage.LocalDataStorage.saveData()
    }

    fun resetToDefaults() {
        visitorsList.clear()
        visitorsList.addAll(listOf(
            VisitorRequest(
                id = "1",
                name = "Marcus Thompson",
                phone = "+1 (555) 012-3456",
                purpose = "Maintenance Delivery",
                flatNo = "B-403",
                residentName = "Ananya Sharma",
                guardName = "Officer Lee",
                requestTime = "10:45 AM",
                status = Status.VISITOR_PENDING
            ),
            VisitorRequest(
                id = "2",
                name = "Sarah Jenkins",
                phone = "+1 (555) 987-6543",
                purpose = "Parcel Delivery",
                flatNo = "A-102",
                residentName = "John Smith",
                guardName = "Officer Chen",
                requestTime = "10:32 AM",
                status = Status.VISITOR_PENDING
            ),
            VisitorRequest(
                id = "3",
                name = "John Doe",
                phone = "+91 98765 43210",
                purpose = "Guest",
                flatNo = "B-403",
                residentName = "Ananya Sharma",
                guardName = "Officer Lee",
                requestTime = "09:15 AM",
                status = Status.VISITOR_CHECKED_IN,
                entryTime = "09:20 AM"
            ),
            VisitorRequest(
                id = "4",
                name = "Sarah Williams",
                phone = "+91 91234 56789",
                purpose = "Guest",
                flatNo = "C-101",
                residentName = "Ananya Sharma",
                guardName = "Officer Lee",
                requestTime = "Yesterday",
                status = Status.VISITOR_CHECKED_OUT,
                entryTime = "Yesterday 04:00 PM",
                exitTime = "Yesterday 06:15 PM"
            ),
            VisitorRequest(
                id = "5",
                name = "Uncle David",
                phone = "+91 99887 76655",
                purpose = "Family",
                flatNo = "B-403",
                residentName = "Ananya Sharma",
                guardName = "Officer Lee",
                requestTime = "Tomorrow",
                status = Status.VISITOR_OTP_GENERATED,
                otp = "123456",
                qrCode = "VISITOR-QR-001",
                isPreApproved = true
            ),
            VisitorRequest(
                id = "6",
                name = "Ramesh Kumar",
                phone = "+91 98989 89898",
                purpose = "Plumber",
                flatNo = "A-102",
                residentName = "John Smith",
                guardName = "Officer Lee",
                requestTime = "Today",
                status = Status.VISITOR_OTP_GENERATED,
                otp = "482913",
                qrCode = "PASS-8888",
                isPreApproved = true
            ),
            VisitorRequest(
                id = "7",
                name = "Expired Guest",
                phone = "+91 91919 19191",
                purpose = "Delivery",
                flatNo = "C-101",
                residentName = "Ananya Sharma",
                guardName = "Officer Lee",
                requestTime = "Yesterday",
                status = Status.VISITOR_EXPIRED,
                otp = "000000",
                qrCode = "PASS-9999",
                isPreApproved = true
            )
        ))

        parcelsList.clear()
        parcelsList.addAll(listOf(
            ParcelRequest(
                id = "1",
                companyName = "Amazon Delivery",
                courierName = "Rohan Das",
                phone = "+91 88888 77777",
                flatNo = "B-403",
                residentName = "Ananya Sharma",
                status = Status.PARCEL_PENDING,
                receivedTime = "10:15 AM"
            ),
            ParcelRequest(
                id = "2",
                companyName = "FedEx Express",
                courierName = "Vikram Singh",
                phone = "+91 77777 66666",
                flatNo = "A-102",
                residentName = "John Smith",
                status = Status.PARCEL_HELD_AT_GATE,
                receivedTime = "09:30 AM"
            ),
            ParcelRequest(
                id = "3",
                companyName = "DHL Courier",
                courierName = "Sanjay Dutt",
                phone = "+91 66666 55555",
                flatNo = "C-101",
                residentName = "Ananya Sharma",
                status = Status.PARCEL_DELIVERED,
                receivedTime = "08:12 AM",
                deliveredTime = "08:30 AM"
            )
        ))

        notificationsList.clear()
        notificationsList.addAll(listOf(
            NotificationItem(
                id = "1",
                title = "New Visitor Request",
                body = "Marcus Thompson is waiting at Gate 4 for B-403.",
                type = "VISITOR",
                isRead = false,
                timestamp = "Just Now"
            ),
            NotificationItem(
                id = "2",
                title = "Parcel Waiting at Gate",
                body = "Amazon Delivery has arrived for flat B-403.",
                type = "PARCEL",
                isRead = false,
                timestamp = "15 mins ago"
            ),
            NotificationItem(
                id = "3",
                title = "Visitor Entry Confirmed",
                body = "John Doe has entered through Main Gate.",
                type = "VISITOR",
                isRead = true,
                timestamp = "1 hour ago"
            )
        ))
    }

    // Resident data retrieval helpers
    fun getResidentVisitorRequests(flatNo: String): List<VisitorRequest> {
        val trimmed = flatNo.trim()
        return visitorsList.filter { sameFlat(it.flatNo, trimmed) && it.status == Status.VISITOR_PENDING }
    }

    fun getResidentParcelRequests(flatNo: String): List<ParcelRequest> {
        val trimmed = flatNo.trim()
        return parcelsList.filter { sameFlat(it.flatNo, trimmed) && it.status == Status.PARCEL_PENDING }
    }

    fun getMyVisitors(flatNo: String): List<VisitorRequest> {
        val trimmed = flatNo.trim()
        return visitorsList.filter { sameFlat(it.flatNo, trimmed) }
    }

    fun getMyParcels(flatNo: String): List<ParcelRequest> {
        val trimmed = flatNo.trim()
        return parcelsList.filter { sameFlat(it.flatNo, trimmed) }
    }

    fun getResidentNotifications(flatNo: String): List<NotificationItem> {
        val trimmed = flatNo.trim()
        return notificationsList.filter { it.body.contains(trimmed, ignoreCase = true) }
    }

    fun getResidentPasses(flatNo: String): List<VisitorRequest> {
        val trimmed = flatNo.trim()
        return visitorsList.filter { 
            sameFlat(it.flatNo, trimmed) && 
            it.isPreApproved && 
            (it.status == Status.VISITOR_APPROVED || it.status == Status.VISITOR_OTP_GENERATED) 
        }
    }
}
