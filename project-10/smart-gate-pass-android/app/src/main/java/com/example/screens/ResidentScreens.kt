package com.example.screens

import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.widget.Toast
import java.io.OutputStream
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.components.*
import com.example.constants.Routes
import com.example.constants.Status
import com.example.data.MockDataStore
import com.example.data.ParcelRequest
import com.example.data.VisitorRequest
import com.example.services.ParcelService
import com.example.services.VisitorService
import androidx.compose.ui.graphics.asImageBitmap
import com.example.ui.theme.*

// 1. RESIDENT DASHBOARD
@Composable
fun ResidentDashboardScreen(
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    val userName = com.example.services.AuthService.loggedInUserName
    val stats = MockDataStore.getResidentStats(flatNo)
    val pendingVisitorsCount = stats["pendingVisitors"] ?: 0
    val pendingParcelsCount = stats["pendingParcels"] ?: 0
    val clearedCount = stats["todayApproved"] ?: 0

    // Recent activity on resident side (filtered by flatNo)
    val recentActivities = remember(flatNo) {
        derivedStateOf {
            MockDataStore.visitorsList.filter { it.flatNo.trim().equals(flatNo.trim(), ignoreCase = true) }.take(3)
        }
    }.value

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "SmartGate",
            subtitle = "Flat $flatNo - Tower ${flatNo.firstOrNull() ?: 'B'}",
            showBackButton = false,
            profileInitial = userName.firstOrNull()?.toString() ?: "R",
            onNotificationClick = { onNavigate(Routes.NOTIFICATION_HISTORY) }
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text(
                text = "Hello, $userName",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = PrimaryNavy,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Double top cards: Pending Visitors & Pending Parcels
            Row(modifier = Modifier.fillMaxWidth()) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, BorderColor),
                    modifier = Modifier
                        .weight(1f)
                        .padding(4.dp)
                        .clickable { onNavigate(Routes.VISITOR_REQUESTS) }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("PENDING VISITORS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = SecondaryText)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(pendingVisitorsCount.toString(), fontSize = 32.sp, fontWeight = FontWeight.Black, color = PrimaryNavy)
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .background(
                                    if (pendingVisitorsCount > 0) DangerRedMuted else SuccessGreenMuted,
                                    shape = RoundedCornerShape(20.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = if (pendingVisitorsCount > 0) "ACTION REQ" else "ALL CLEAR",
                                color = if (pendingVisitorsCount > 0) DangerRed else SuccessGreen,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, BorderColor),
                    modifier = Modifier
                        .weight(1f)
                        .padding(4.dp)
                        .clickable { onNavigate(Routes.PARCEL_REQUESTS) }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("PENDING PARCELS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = SecondaryText)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(pendingParcelsCount.toString(), fontSize = 32.sp, fontWeight = FontWeight.Black, color = PrimaryNavy)
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .background(
                                    if (pendingParcelsCount > 0) WarningAmberMuted else SuccessGreenMuted,
                                    shape = RoundedCornerShape(20.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = if (pendingParcelsCount > 0) "ACTION REQ" else "ALL CLEAR",
                                color = if (pendingParcelsCount > 0) WarningAmber else SuccessGreen,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Wide Banner - Today Approved Visitors
            Card(
                colors = CardDefaults.cardColors(containerColor = RoyalBlue),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp)
                    .clickable { onNavigate(Routes.MY_VISITORS) }
            ) {
                Row(
                    modifier = Modifier.padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("TODAY APPROVED", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("$clearedCount Visitors Cleared", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    }
                    Icon(
                        imageVector = Icons.Default.Verified,
                        contentDescription = "Verified Badge",
                        tint = Color.White,
                        modifier = Modifier.size(36.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Quick Actions section
            Text(
                text = "Quick Actions",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = PrimaryNavy,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            
            // First Row of Quick Actions
            Row(modifier = Modifier.fillMaxWidth()) {
                QuickActionButton(
                    title = "Visitor Requests",
                    icon = Icons.Default.AssignmentInd,
                    backgroundColor = Color.White,
                    textColor = PrimaryNavy,
                    onClick = { onNavigate(Routes.VISITOR_REQUESTS) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                QuickActionButton(
                    title = "Parcel Requests",
                    icon = Icons.Default.Inventory,
                    backgroundColor = Color.White,
                    textColor = PrimaryNavy,
                    onClick = { onNavigate(Routes.PARCEL_REQUESTS) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                QuickActionButton(
                    title = "Add Expected",
                    icon = Icons.Default.QrCode,
                    backgroundColor = Color.Black,
                    textColor = Color.White,
                    onClick = { onNavigate(Routes.ADD_EXPECTED_VISITOR) },
                    modifier = Modifier.weight(1f).testTag("quick_action_add_expected_visitor")
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Second Row of Quick Actions
            Row(modifier = Modifier.fillMaxWidth()) {
                QuickActionButton(
                    title = "My Visitors",
                    icon = Icons.Default.History,
                    backgroundColor = Color.White,
                    textColor = PrimaryNavy,
                    onClick = { onNavigate(Routes.MY_VISITORS) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                QuickActionButton(
                    title = "My Parcels",
                    icon = Icons.Default.LocalShipping,
                    backgroundColor = Color.White,
                    textColor = PrimaryNavy,
                    onClick = { onNavigate(Routes.MY_PARCELS) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.weight(1f)) // Empty block to align grid
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Recent Activity Section
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Activity",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryNavy
                )
                Text(
                    text = "View All",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = RoyalBlue,
                    modifier = Modifier.clickable { onNavigate(Routes.NOTIFICATION_HISTORY) }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))

            if (recentActivities.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No recent activity.", color = SecondaryText, fontSize = 13.sp)
                }
            } else {
                recentActivities.forEach { item ->
                    ActivityCard(
                        title = item.name,
                        subtitle = "Purpose: ${item.purpose} • Sent ${item.requestTime}",
                        time = item.entryTime ?: "09:00 AM",
                        status = item.status,
                        avatarInitial = item.name.firstOrNull()?.toString() ?: "V"
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            SecondaryButton(title = "Logout from Flat Portal", onClick = onLogout)
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

// 2. VISITOR REQUESTS (Approval feed)
@Composable
fun VisitorRequestsScreen(onBack: () -> Unit) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    val visitors = MockDataStore.visitorsList.filter {
        it.flatNo.trim().equals(flatNo.trim(), ignoreCase = true) && !it.isPreApproved &&
        (it.status == Status.VISITOR_PENDING || it.status == Status.VISITOR_APPROVED || it.status == Status.VISITOR_REJECTED)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Visitor Requests",
            subtitle = "Manage pending entries for your residence",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        if (visitors.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                EmptyState(
                    title = "No Visitor Requests",
                    description = "When visitors arrive at the main gate, approval requests will appear here.",
                    icon = Icons.Default.DoneAll
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                items(visitors) { item ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(20.dp),
                        border = BorderStroke(1.dp, BorderColor),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp)
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .background(PrimaryNavyMuted),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = item.name.firstOrNull()?.toString() ?: "V",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp,
                                        color = PrimaryNavy
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = item.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = PrimaryText)
                                        StatusBadge(status = item.status)
                                    }
                                    Text(text = item.phone, color = SecondaryText, fontSize = 13.sp)
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text("Purpose", fontSize = 11.sp, color = SecondaryText, fontWeight = FontWeight.Bold)
                                    Text(item.purpose, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = PrimaryText)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("Verified By", fontSize = 11.sp, color = SecondaryText, fontWeight = FontWeight.Bold)
                                    Text(item.guardName, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = PrimaryText)
                                }
                            }

                            if (item.status == Status.VISITOR_PENDING) {
                                Spacer(modifier = Modifier.height(20.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    DangerButton(
                                        title = "Reject",
                                        icon = Icons.Default.Close,
                                        onClick = { VisitorService.rejectVisitor(item.id) },
                                        modifier = Modifier.weight(1f).padding(end = 6.dp)
                                    )
                                    SuccessButton(
                                        title = "Approve",
                                        icon = Icons.Default.Check,
                                        onClick = { VisitorService.approveVisitor(item.id) },
                                        modifier = Modifier.weight(1f).padding(start = 6.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 3. PARCEL REQUESTS (Resident Side)
@Composable
fun ParcelRequestsScreen(onBack: () -> Unit) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    val activeParcels = MockDataStore.parcelsList.filter {
        it.flatNo.trim().equals(flatNo.trim(), ignoreCase = true) &&
        (it.status == Status.PARCEL_PENDING || it.status == Status.PARCEL_DELIVERY_INSIDE ||
         it.status == Status.PARCEL_HELD_AT_GATE || it.status == Status.PARCEL_WAITING_PICKUP ||
         it.status == Status.PARCEL_REJECTED)
    }
    var selectedParcelForOptions by remember { mutableStateOf<ParcelRequest?>(null) }
    val context = LocalContext.current

    if (selectedParcelForOptions != null) {
        Dialog(onDismissRequest = { selectedParcelForOptions = null }) {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth().padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Parcel Action Menu",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = PrimaryNavy,
                        modifier = Modifier.padding(bottom = 14.dp)
                    )

                    val options = listOf(
                        Pair(1, "Allow delivery boy inside flat"),
                        Pair(2, "Keep parcel stored at security gate"),
                        Pair(3, "I will collect my parcel at gate"),
                        Pair(4, "Reject this delivery request")
                    )

                    options.forEach { (id, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    selectedParcelForOptions?.let { parcel ->
                                        ParcelService.updateParcelStatus(parcel.id, id)
                                        Toast.makeText(context, "Preference saved: $label", Toast.LENGTH_SHORT).show()
                                        selectedParcelForOptions = null
                                    }
                                }
                                .padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = when (id) {
                                    1 -> Icons.Default.MeetingRoom
                                    2 -> Icons.Default.Inventory2
                                    3 -> Icons.Default.DirectionsWalk
                                    else -> Icons.Default.Cancel
                                },
                                contentDescription = null,
                                tint = if (id == 4) DangerRed else RoyalBlue,
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(text = label, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = PrimaryText)
                        }
                        HorizontalDivider(color = BorderColor)
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    SecondaryButton(title = "Close Menu", onClick = { selectedParcelForOptions = null })
                }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "My Deliveries",
            subtitle = "Active Parcels & Courier Logs",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        if (activeParcels.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                EmptyState(title = "No deliveries active", description = "New parcel logs will appear here.", icon = Icons.Default.Inbox)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                items(activeParcels) { item ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, BorderColor),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = item.companyName, fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                                StatusBadge(status = item.status)
                            }
                            Text(text = "Courier: ${item.courierName} (${item.phone})", color = SecondaryText, fontSize = 13.sp)
                            Text(text = "Type: ${item.parcelType} | Received: ${item.receivedTime}", color = SecondaryText, fontSize = 13.sp)

                            if (item.status == Status.PARCEL_PENDING) {
                                Spacer(modifier = Modifier.height(14.dp))
                                PrimaryButton(
                                    title = "Update Delivery Directives",
                                    icon = Icons.Default.FormatListBulleted,
                                    onClick = { selectedParcelForOptions = item }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// 4. ADD EXPECTED VISITOR (Pre-approval)
@Composable
fun AddExpectedVisitorScreen(onNavigateToPass: (String, String) -> Unit, onBack: () -> Unit) {
    var guestName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var expectedDate by remember { mutableStateOf("Today, Jul 4") }
    var expectedTime by remember { mutableStateOf("12:00 PM") }
    var purpose by remember { mutableStateOf("Family Visit") }
    var validityTime by remember { mutableStateOf("24 Hours") }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Pre-Approve Guest",
            subtitle = "Generate digital gate pass",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(24.dp)
        ) {
            TextInputField(
                value = guestName,
                onValueChange = { guestName = it },
                label = "Guest Name *",
                placeholder = "Full Name",
                leadingIcon = Icons.Default.Person,
                modifier = Modifier.testTag("expected_visitor_name_input")
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = phone,
                onValueChange = { phone = it },
                label = "Mobile Number *",
                placeholder = "10 Digit Number",
                leadingIcon = Icons.Default.Phone
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = expectedDate,
                onValueChange = { expectedDate = it },
                label = "Expected Visit Date *",
                placeholder = "Select Date",
                leadingIcon = Icons.Default.CalendarToday
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = expectedTime,
                onValueChange = { expectedTime = it },
                label = "Expected Visit Time *",
                placeholder = "Select Time (e.g. 12:00 PM)",
                leadingIcon = Icons.Default.AccessTime
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = purpose,
                onValueChange = { purpose = it },
                label = "Purpose of Visit *",
                placeholder = "Family, Dinner, Business",
                leadingIcon = Icons.Default.Edit
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = validityTime,
                onValueChange = { validityTime = it },
                label = "Validity Time *",
                placeholder = "E.g. 24 Hours, 12 Hours",
                leadingIcon = Icons.Default.Timer
            )

            Spacer(modifier = Modifier.height(30.dp))

            PrimaryButton(
                title = "Generate Shareable Pass",
                icon = Icons.Default.QrCode,
                onClick = {
                    val trimmedPhone = phone.trim()
                    if (guestName.isBlank()) {
                        Toast.makeText(context, "Guest Name is required", Toast.LENGTH_SHORT).show()
                    } else if (trimmedPhone.isBlank()) {
                        Toast.makeText(context, "Mobile number is required", Toast.LENGTH_SHORT).show()
                    } else if (trimmedPhone.length != 10 || !trimmedPhone.all { it.isDigit() }) {
                        Toast.makeText(context, "Mobile number must be exactly 10 digits", Toast.LENGTH_SHORT).show()
                    } else if (expectedDate.isBlank()) {
                        Toast.makeText(context, "Visit date is required", Toast.LENGTH_SHORT).show()
                    } else if (expectedTime.isBlank()) {
                        Toast.makeText(context, "Visit time is required", Toast.LENGTH_SHORT).show()
                    } else if (purpose.isBlank()) {
                        Toast.makeText(context, "Purpose of visit is required", Toast.LENGTH_SHORT).show()
                    } else if (validityTime.isBlank()) {
                        Toast.makeText(context, "Validity time is required", Toast.LENGTH_SHORT).show()
                    } else {
                        val request = VisitorService.preApproveVisitor(
                            name = guestName,
                            phone = phone,
                            expectedDate = expectedDate,
                            expectedTime = expectedTime,
                            purpose = purpose,
                            validityTime = validityTime
                        )
                        Toast.makeText(context, "Pass code successfully compiled!", Toast.LENGTH_SHORT).show()
                        onNavigateToPass(request.otp, request.qrCode)
                    }
                },
                modifier = Modifier.testTag("expected_visitor_submit_button")
            )
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

private fun saveBitmapToGallery(context: android.content.Context, bitmap: Bitmap, tokenName: String): Boolean {
    val resolver = context.contentResolver
    val contentValues = ContentValues().apply {
        put(MediaStore.MediaColumns.DISPLAY_NAME, "gatepass_qr_${tokenName}_${System.currentTimeMillis()}.png")
        put(MediaStore.MediaColumns.MIME_TYPE, "image/png")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/SmartGatePass")
        }
    }

    val imageUri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)
    if (imageUri != null) {
        var outputStream: OutputStream? = null
        try {
            outputStream = resolver.openOutputStream(imageUri)
            if (outputStream != null) {
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
                return true
            }
        } catch (e: Exception) {
            resolver.delete(imageUri, null, null)
        } finally {
            outputStream?.close()
        }
    }
    return false
}

// 5. OTP / QR PASS DISPLAY SCREEN
@Composable
fun OtpQrPassScreen(otp: String, qrCode: String, onBack: () -> Unit) {
    val context = LocalContext.current
    val visitor = MockDataStore.visitorsList.firstOrNull { it.otp == otp || it.qrCode == qrCode }
    val parcel = if (visitor == null) MockDataStore.parcelsList.firstOrNull { it.id == qrCode || it.id == otp } else null

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Active Gate Pass", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = PrimaryNavy)
        Text(text = "Share these pass details with your guest/courier", fontSize = 14.sp, color = SecondaryText, textAlign = TextAlign.Center)

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, BorderColor),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Pass header info
                if (visitor != null) {
                    Text(text = "VISITOR PASS", fontSize = 12.sp, color = RoyalBlue, fontWeight = FontWeight.ExtraBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = visitor.name, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = PrimaryText)
                    Text(text = "Purpose: ${visitor.purpose} • Destination: ${visitor.flatNo}", fontSize = 13.sp, color = SecondaryText)
                    Spacer(modifier = Modifier.height(8.dp))
                    StatusBadge(status = visitor.status)
                } else if (parcel != null) {
                    Text(text = "PARCEL DIRECTIVE", fontSize = 12.sp, color = RoyalBlue, fontWeight = FontWeight.ExtraBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = parcel.companyName, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = PrimaryText)
                    Text(text = "Courier: ${parcel.courierName} • Flat: ${parcel.flatNo}", fontSize = 13.sp, color = SecondaryText)
                    Spacer(modifier = Modifier.height(8.dp))
                    StatusBadge(status = parcel.status)
                } else {
                    Text(text = "GATE PASS TOKEN", fontSize = 12.sp, color = RoyalBlue, fontWeight = FontWeight.ExtraBold)
                }

                Spacer(modifier = Modifier.height(20.dp))

                // QR Code generated from token
                val qrBitmap = remember(qrCode) {
                    try {
                        com.example.util.QRCodeUtil.generateBitmap(qrCode)
                    } catch (e: Exception) {
                        null
                    }
                }
                Box(
                    modifier = Modifier
                        .size(180.dp)
                        .border(BorderStroke(2.dp, RoyalBlue), shape = RoundedCornerShape(16.dp))
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    if (qrBitmap != null) {
                        Image(
                            bitmap = qrBitmap.asImageBitmap(),
                            contentDescription = "QR Code",
                            modifier = Modifier.size(140.dp)
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.QrCode,
                            contentDescription = "QR placeholder",
                            tint = PrimaryNavy,
                            modifier = Modifier.size(140.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Text(text = "QR Token: $qrCode", fontSize = 12.sp, color = SecondaryText, fontWeight = FontWeight.Bold)

                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = {
                        if (qrBitmap != null) {
                            val success = saveBitmapToGallery(context, qrBitmap, qrCode)
                            if (success) {
                                Toast.makeText(context, "QR code image saved to gallery!", Toast.LENGTH_LONG).show()
                            } else {
                                Toast.makeText(context, "Error: Failed to save QR code image.", Toast.LENGTH_LONG).show()
                            }
                        } else {
                            Toast.makeText(context, "Error: QR Bitmap not available.", Toast.LENGTH_SHORT).show()
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = RoyalBlue),
                    border = BorderStroke(1.dp, RoyalBlue)
                ) {
                    Icon(imageVector = Icons.Default.Save, contentDescription = "Save QR to Gallery", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Save QR Code", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 18.dp), color = BorderColor)

                // 6-digit OTP Box
                Text(text = "6-DIGIT ENTRY PIN", fontSize = 11.sp, color = SecondaryText, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = otp,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    color = RoyalBlue,
                    letterSpacing = 4.sp
                )

                Spacer(modifier = Modifier.height(16.dp))
                Box(
                    modifier = Modifier
                        .background(WarningAmberMuted, shape = RoundedCornerShape(20.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "VALIDITY: " + (visitor?.validityTime?.uppercase() ?: "24 HOURS"),
                        color = WarningAmber,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        PrimaryButton(
            title = "Share Pass via SMS/WhatsApp",
            icon = Icons.Default.Share,
            onClick = {
                try {
                    val shareText = "Gate Pass Details:\nGuest: ${visitor?.name ?: "Guest"}\nOTP: $otp\nQR Token: $qrCode\nValidity: ${visitor?.validityTime ?: "24 Hours"}"
                    val shareIntent = Intent().apply {
                        action = Intent.ACTION_SEND
                        putExtra(Intent.EXTRA_TEXT, shareText)
                        type = "text/plain"
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Share Pass Details"))
                } catch (e: Exception) {
                    Toast.makeText(context, "Error sharing: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        )

        Spacer(modifier = Modifier.height(12.dp))

        SecondaryButton(title = "Return to Dashboard", onClick = onBack)
    }
}

// 6. NOTIFICATION HISTORY
@Composable
fun NotificationHistoryScreen(onBack: () -> Unit) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    val list = MockDataStore.notificationsList.filter { 
        it.body.contains(flatNo.trim(), ignoreCase = true) || it.title.contains("System", ignoreCase = true) 
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Gate Alerts History",
            subtitle = "Logged dynamic push notifications",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "System Alerts", fontWeight = FontWeight.Bold, color = PrimaryNavy, fontSize = 15.sp)
            Text(
                text = "Mark all read",
                fontWeight = FontWeight.Bold,
                color = RoyalBlue,
                fontSize = 13.sp,
                modifier = Modifier.clickable {
                    MockDataStore.markNotificationsAsRead()
                }
            )
        }

        if (list.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                EmptyState(title = "No notifications yet", description = "Security alerts logged at the gate will show here.", icon = Icons.Default.NotificationsNone)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp)
            ) {
                items(list) { item ->
                    NotificationCard(
                        title = item.title,
                        body = item.body,
                        time = item.timestamp,
                        isRead = item.isRead,
                        onMarkAsRead = {
                            val idx = MockDataStore.notificationsList.indexOfFirst { it.id == item.id }
                            if (idx != -1) {
                                MockDataStore.notificationsList[idx] = MockDataStore.notificationsList[idx].copy(isRead = true)
                            }
                        }
                    )
                }
            }
        }
    }
}

// 7. MY VISITORS SCREEN
@Composable
fun MyVisitorsScreen(
    onNavigate: (String) -> Unit,
    onBack: () -> Unit
) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Pending", "Approved", "Checked In", "Checked Out", "Rejected")

    val allVisitors = MockDataStore.getMyVisitors(flatNo)
    val filteredVisitors = when (selectedFilter) {
        "Pending" -> allVisitors.filter { it.status == Status.VISITOR_PENDING }
        "Approved" -> allVisitors.filter { it.status == Status.VISITOR_APPROVED || it.status == Status.VISITOR_OTP_GENERATED || it.status == Status.VISITOR_QR_GENERATED }
        "Checked In" -> allVisitors.filter { it.status == Status.VISITOR_CHECKED_IN }
        "Checked Out" -> allVisitors.filter { it.status == Status.VISITOR_CHECKED_OUT }
        "Rejected" -> allVisitors.filter { it.status == Status.VISITOR_REJECTED }
        else -> allVisitors
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "My Visitors",
            subtitle = "Visitor Log & Pass History",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        // Filter chips row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            filters.forEach { filter ->
                val isSelected = selectedFilter == filter
                val bgColor = if (isSelected) RoyalBlue else Color.White
                val textColor = if (isSelected) Color.White else SecondaryText
                val borderStroke = if (isSelected) null else BorderStroke(1.dp, BorderColor)

                Box(
                    modifier = Modifier
                        .background(bgColor, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = filter }
                        .then(if (borderStroke != null) Modifier.border(borderStroke.width, borderStroke.brush, RoundedCornerShape(20.dp)) else Modifier)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = filter,
                        color = textColor,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        if (filteredVisitors.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                EmptyState(
                    title = "No visitor records found",
                    description = "There are no guests in '$selectedFilter' status.",
                    icon = Icons.Default.People
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredVisitors) { item ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, BorderColor),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                if (item.isPreApproved && (item.status == Status.VISITOR_APPROVED || item.status == Status.VISITOR_OTP_GENERATED)) {
                                    onNavigate("otp_qr_pass/${item.otp}/${item.qrCode}")
                                }
                            }
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = item.name,
                                    fontWeight = FontWeight.Bold,
                                    color = PrimaryText,
                                    fontSize = 16.sp
                                )
                                StatusBadge(status = item.status)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "Phone: ${item.phone}", color = SecondaryText, fontSize = 13.sp)
                            Text(text = "Purpose: ${item.purpose}", color = SecondaryText, fontSize = 13.sp)
                            
                            if (item.entryTime != null) {
                                Text(text = "Entry Time: ${item.entryTime}", color = SecondaryText, fontSize = 13.sp)
                            }
                            if (item.exitTime != null) {
                                Text(text = "Exit Time: ${item.exitTime}", color = SecondaryText, fontSize = 13.sp)
                            }
                            
                            Text(
                                text = "Requested: ${item.requestTime}",
                                color = MutedText,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                            if (item.isPreApproved && (item.status == Status.VISITOR_APPROVED || item.status == Status.VISITOR_OTP_GENERATED)) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "TAP TO VIEW DIGITAL PASS",
                                    color = RoyalBlue,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                        }
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

// 8. MY PARCELS SCREEN
@Composable
fun MyParcelsScreen(
    onNavigate: (String) -> Unit,
    onBack: () -> Unit
) {
    val flatNo = com.example.services.AuthService.loggedInUserFlat
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Pending", "Held at Gate", "Delivery Inside", "Delivered", "Rejected")
    var searchQuery by remember { mutableStateOf("") }

    val allParcels = MockDataStore.getMyParcels(flatNo)
    val filteredParcelsBase = when (selectedFilter) {
        "Pending" -> allParcels.filter { it.status == Status.PARCEL_PENDING }
        "Held at Gate" -> allParcels.filter { it.status == Status.PARCEL_HELD_AT_GATE }
        "Delivery Inside" -> allParcels.filter { it.status == Status.PARCEL_DELIVERY_INSIDE }
        "Delivered" -> allParcels.filter { it.status == Status.PARCEL_DELIVERED }
        "Rejected" -> allParcels.filter { it.status == Status.PARCEL_REJECTED }
        else -> allParcels
    }
    val filteredParcels = if (searchQuery.isBlank()) {
        filteredParcelsBase
    } else {
        filteredParcelsBase.filter { parcel ->
            val q = searchQuery.lowercase()
            parcel.companyName.lowercase().contains(q) ||
            parcel.courierName.lowercase().contains(q) ||
            parcel.flatNo.lowercase().contains(q) ||
            parcel.parcelType.lowercase().contains(q) ||
            (parcel.orderId?.lowercase() ?: "").contains(q) ||
            parcel.status.lowercase().contains(q)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "My Parcels",
            subtitle = "Parcel Log & Pass History",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        // Filter chips row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            filters.forEach { filter ->
                val isSelected = selectedFilter == filter
                val bgColor = if (isSelected) RoyalBlue else Color.White
                val textColor = if (isSelected) Color.White else SecondaryText
                val borderStroke = if (isSelected) null else BorderStroke(1.dp, BorderColor)

                Box(
                    modifier = Modifier
                        .background(bgColor, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = filter }
                        .then(if (borderStroke != null) Modifier.border(borderStroke.width, borderStroke.brush, RoundedCornerShape(20.dp)) else Modifier)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = filter,
                        color = textColor,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        if (filteredParcels.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                EmptyState(
                    title = "No parcel records found",
                    description = "There are no packages in '$selectedFilter' status.",
                    icon = Icons.Default.Inbox
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredParcels) { item ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, BorderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = item.companyName,
                                    fontWeight = FontWeight.Bold,
                                    color = PrimaryText,
                                    fontSize = 16.sp
                                )
                                StatusBadge(status = item.status)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "Courier: ${item.courierName} (${item.phone})", color = SecondaryText, fontSize = 13.sp)
                            Text(text = "Type: ${item.parcelType}", color = SecondaryText, fontSize = 13.sp)
                            if (!item.orderId.isNullOrBlank()) {
                                Text(text = "Tracking ID: ${item.orderId}", color = MutedText, fontSize = 12.sp)
                            }
                            Text(
                                text = "Received: ${item.receivedTime}" + if (item.deliveredTime != null) " | Delivered: ${item.deliveredTime}" else "",
                                color = MutedText,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

