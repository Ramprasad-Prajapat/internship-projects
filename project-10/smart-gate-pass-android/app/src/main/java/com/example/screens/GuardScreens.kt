package com.example.screens

import android.Manifest
import android.content.Context
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import android.content.pm.PackageManager
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.compose.LocalLifecycleOwner
import java.util.concurrent.Executors
import com.google.zxing.PlanarYUVLuminanceSource
import com.google.zxing.BinaryBitmap
import com.google.zxing.common.HybridBinarizer
import com.google.zxing.qrcode.QRCodeReader
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.window.Dialog
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
import com.example.components.*
import com.example.constants.Routes
import com.example.constants.Status
import com.example.data.MockDataStore
import com.example.data.ParcelRequest
import com.example.data.VisitorRequest
import com.example.services.ParcelService
import com.example.services.VisitorService
import com.example.ui.theme.*

// 1. GUARD DASHBOARD
@Composable
fun GuardDashboardScreen(
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    // Collect state dynamically from mock datastore
    val stats = MockDataStore.getGuardStats()
    val visitorsList = MockDataStore.visitorsList
    val recentActivities = visitorsList.take(3) // Top 3 as recent activities

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "SmartGate",
            subtitle = "Gate 1 - Day Shift",
            showBackButton = false,
            profileInitial = "G",
            onNotificationClick = { onNavigate(Routes.NOTIFICATION_HISTORY) }
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text(
                text = "Hello, Guard",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = PrimaryNavy,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Statistics Grid (2x2)
            Row(modifier = Modifier.fillMaxWidth()) {
                DashboardCard(
                    count = stats["todayVisitors"].toString(),
                    title = "Today Visitors",
                    badgeText = "TODAY",
                    badgeColor = RoyalBlue,
                    badgeBg = RoyalBlueMuted,
                    icon = Icons.Default.Groups,
                    iconTint = RoyalBlue,
                    iconBg = RoyalBlueMuted,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(Routes.INSIDE_VISITORS) }
                )
                DashboardCard(
                    count = stats["pendingApprovals"].toString(),
                    title = "Pending Approvals",
                    badgeText = "ALERT",
                    badgeColor = DangerRed,
                    badgeBg = DangerRedMuted,
                    icon = Icons.Default.Pending,
                    iconTint = DangerRed,
                    iconBg = DangerRedMuted,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(Routes.GUARD_PENDING_REQUESTS) }
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(modifier = Modifier.fillMaxWidth()) {
                DashboardCard(
                    count = stats["insideVisitors"].toString(),
                    title = "Inside Visitors",
                    badgeText = "ACTIVE",
                    badgeColor = SuccessGreen,
                    badgeBg = SuccessGreenMuted,
                    icon = Icons.Default.MeetingRoom,
                    iconTint = SuccessGreen,
                    iconBg = SuccessGreenMuted,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(Routes.INSIDE_VISITORS) }
                )
                DashboardCard(
                    count = stats["pendingParcels"].toString(),
                    title = "Pending Parcels",
                    badgeText = "HUB",
                    badgeColor = WarningAmber,
                    badgeBg = WarningAmberMuted,
                    icon = Icons.Default.Inventory2,
                    iconTint = WarningAmber,
                    iconBg = WarningAmberMuted,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(Routes.GUARD_PENDING_REQUESTS) }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Quick Actions Grid (2x2)
            Text(
                text = "Quick Actions",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = PrimaryNavy,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            Row(modifier = Modifier.fillMaxWidth()) {
                QuickActionButton(
                    title = "Add Visitor",
                    icon = Icons.Default.PersonAdd,
                    backgroundColor = RoyalBlue,
                    textColor = Color.White,
                    onClick = { onNavigate(Routes.ADD_VISITOR) },
                    modifier = Modifier.weight(1f).testTag("quick_action_add_visitor")
                )
                QuickActionButton(
                    title = "Add Parcel",
                    icon = Icons.Default.AddBox,
                    backgroundColor = Color.Black,
                    textColor = Color.White,
                    onClick = { onNavigate(Routes.ADD_PARCEL) },
                    modifier = Modifier.weight(1f).testTag("quick_action_add_parcel")
                )
            }
            Row(modifier = Modifier.fillMaxWidth()) {
                QuickActionButton(
                    title = "Scan QR",
                    icon = Icons.Default.QrCodeScanner,
                    backgroundColor = Color.White,
                    textColor = RoyalBlue,
                    onClick = { onNavigate(Routes.SCAN_QR) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                QuickActionButton(
                    title = "Verify OTP",
                    icon = Icons.Default.Password,
                    backgroundColor = Color.White,
                    textColor = RoyalBlue,
                    onClick = { onNavigate(Routes.VERIFY_OTP) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
            }
            Row(modifier = Modifier.fillMaxWidth()) {
                QuickActionButton(
                    title = "Parcel Records",
                    icon = Icons.Default.Inventory,
                    backgroundColor = Color.White,
                    textColor = RoyalBlue,
                    onClick = { onNavigate(Routes.PARCEL_RECORDS) },
                    modifier = Modifier.weight(1f).border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Recent Activity List header
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
                    modifier = Modifier.clickable { onNavigate(Routes.INSIDE_VISITORS) }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))

            if (recentActivities.isEmpty()) {
                EmptyState(title = "No recent entries", description = "New entries logged will appear here.")
            } else {
                recentActivities.forEach { item ->
                    ActivityCard(
                        title = item.name,
                        subtitle = "Visitor • Flat ${item.flatNo}",
                        time = item.requestTime,
                        status = item.status,
                        avatarInitial = item.name.firstOrNull()?.toString() ?: "V"
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            SecondaryButton(title = "Logout from Gate", onClick = onLogout)
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

// 2. ADD VISITOR FORM
@Composable
fun AddVisitorScreen(onBack: () -> Unit) {
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var flatNo by remember { mutableStateOf("B-403") }
    val residentName = if (flatNo == "B-403") "Ananya Sharma" else "John Smith"
    var purposeOption by remember { mutableStateOf("Guest") } // Guest or Delivery
    var otherPurpose by remember { mutableStateOf("") }
    var vehicleNo by remember { mutableStateOf("") }
    val context = LocalContext.current

    val flatOptions = listOf("B-403", "A-102", "C-101")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Add New Visitor",
            subtitle = "Security Station: Gate 4 - Entrance",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Photo Upload Placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .border(
                        border = BorderStroke(1.dp, MutedText),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .background(Color.White)
                    .clickable {
                        Toast.makeText(context, "Camera permission requested", Toast.LENGTH_SHORT).show()
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.PhotoCamera,
                        contentDescription = "Upload Photo",
                        tint = RoyalBlue,
                        modifier = Modifier.size(36.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "Upload Visitor Photo", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = PrimaryNavy)
                    Text(text = "Required for security log", fontSize = 11.sp, color = SecondaryText)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            TextInputField(
                value = name,
                onValueChange = { name = it },
                label = "Visitor Name *",
                placeholder = "Full Name",
                leadingIcon = Icons.Default.Person,
                modifier = Modifier.testTag("visitor_name_input")
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = phone,
                onValueChange = { phone = it },
                label = "Mobile Number *",
                placeholder = "+91 00000 00000",
                leadingIcon = Icons.Default.Phone,
                modifier = Modifier.testTag("visitor_phone_input")
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(modifier = Modifier.fillMaxWidth()) {
                DropdownField(
                    selectedOption = flatNo,
                    options = flatOptions,
                    onOptionSelected = { flatNo = it },
                    label = "Flat Number *",
                    modifier = Modifier.weight(1.1f)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Resident Name",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryNavy,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .background(BorderColor.copy(alpha = 0.4f), shape = RoundedCornerShape(12.dp))
                            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                            .padding(horizontal = 12.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Text(text = residentName, color = PrimaryText, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Purpose of visit toggle tabs
            Text(text = "Purpose of Visit *", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = PrimaryNavy)
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth()) {
                Button(
                    onClick = { purposeOption = "Guest" },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (purposeOption == "Guest") RoyalBlueMuted else Color.White
                    ),
                    border = BorderStroke(1.dp, if (purposeOption == "Guest") RoyalBlue else BorderColor),
                    modifier = Modifier.weight(1f).height(48.dp)
                ) {
                    Icon(imageVector = Icons.Default.Home, contentDescription = "Guest", tint = if (purposeOption == "Guest") RoyalBlue else SecondaryText)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Guest", color = if (purposeOption == "Guest") RoyalBlue else SecondaryText, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Button(
                    onClick = { purposeOption = "Delivery" },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (purposeOption == "Delivery") RoyalBlueMuted else Color.White
                    ),
                    border = BorderStroke(1.dp, if (purposeOption == "Delivery") RoyalBlue else BorderColor),
                    modifier = Modifier.weight(1f).height(48.dp)
                ) {
                    Icon(imageVector = Icons.Default.LocalShipping, contentDescription = "Delivery", tint = if (purposeOption == "Delivery") RoyalBlue else SecondaryText)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Delivery", color = if (purposeOption == "Delivery") RoyalBlue else SecondaryText, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            TextInputField(
                value = otherPurpose,
                onValueChange = { otherPurpose = it },
                label = "Purpose Details (Optional)",
                placeholder = "E.g. AC Maintenance, Plumber",
                leadingIcon = Icons.Default.Edit
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = vehicleNo,
                onValueChange = { vehicleNo = it },
                label = "Vehicle Number (Optional)",
                placeholder = "E.g. MH 12 AB 1234",
                leadingIcon = Icons.Default.DirectionsCar
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Notice Infobox
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = RoyalBlueMuted.copy(alpha = 0.4f)),
                border = BorderStroke(1.dp, RoyalBlueMuted)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Info, contentDescription = "Info", tint = RoyalBlue)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "The resident will receive a real-time notification to approve or deny the visitor's entry request.",
                        color = RoyalBlue,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(30.dp))

            PrimaryButton(
                title = "Submit Request",
                icon = Icons.Default.Send,
                onClick = {
                    if (name.isBlank() || phone.isBlank()) {
                        Toast.makeText(context, "Please enter all required fields (*)", Toast.LENGTH_SHORT).show()
                    } else {
                        VisitorService.createVisitor(
                            name = name,
                            phone = phone,
                            flatNo = flatNo,
                            purpose = if (otherPurpose.isNotBlank()) "$purposeOption - $otherPurpose" else purposeOption,
                            vehicleNo = vehicleNo.ifBlank { null },
                            count = 1
                        )
                        Toast.makeText(context, "Request dispatched to Resident!", Toast.LENGTH_LONG).show()
                        onBack()
                    }
                },
                modifier = Modifier.testTag("visitor_submit_button")
            )
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

// 3. ADD PARCEL FORM
@Composable
fun AddParcelScreen(onBack: () -> Unit) {
    var company by remember { mutableStateOf("") }
    var courierName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var flatNo by remember { mutableStateOf("B-403") }
    val residentName = if (flatNo == "B-403") "Ananya Sharma" else "John Smith"
    var parcelType by remember { mutableStateOf("Box") }
    var orderId by remember { mutableStateOf("") }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Add Parcel Log",
            subtitle = "Security Station: Gate 4 - Entrance",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            TextInputField(
                value = company,
                onValueChange = { company = it },
                label = "Delivery Company *",
                placeholder = "E.g. Amazon, BlueDart",
                leadingIcon = Icons.Default.LocalShipping,
                modifier = Modifier.testTag("parcel_company_input")
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = courierName,
                onValueChange = { courierName = it },
                label = "Delivery Boy Name *",
                placeholder = "E.g. Rohan Das",
                leadingIcon = Icons.Default.Person,
                modifier = Modifier.testTag("parcel_courier_input")
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = phone,
                onValueChange = { phone = it },
                label = "Courier Phone",
                placeholder = "+91 00000 00000",
                leadingIcon = Icons.Default.Phone
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(modifier = Modifier.fillMaxWidth()) {
                DropdownField(
                    selectedOption = flatNo,
                    options = listOf("B-403", "A-102", "C-101"),
                    onOptionSelected = { flatNo = it },
                    label = "Flat Number *",
                    modifier = Modifier.weight(1.1f)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Resident Name",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryNavy,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .background(BorderColor.copy(alpha = 0.4f), shape = RoundedCornerShape(12.dp))
                            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                            .padding(horizontal = 12.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Text(text = residentName, color = PrimaryText, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = parcelType,
                onValueChange = { parcelType = it },
                label = "Parcel Type",
                placeholder = "E.g. Box, Envelope, Bag",
                leadingIcon = Icons.Default.Inventory
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextInputField(
                value = orderId,
                onValueChange = { orderId = it },
                label = "Order ID / Tracking ID (Optional)",
                placeholder = "E.g. 123-4567-890",
                leadingIcon = Icons.Default.Tag
            )

            Spacer(modifier = Modifier.height(30.dp))

            PrimaryButton(
                title = "Log Parcel & Notify Resident",
                icon = Icons.Default.Inventory2,
                onClick = {
                    if (company.isBlank() || courierName.isBlank()) {
                        Toast.makeText(context, "Please fill out Company and Courier Name", Toast.LENGTH_SHORT).show()
                    } else {
                        ParcelService.createParcel(
                            company = company,
                            courier = courierName,
                            phone = phone,
                            flatNo = flatNo,
                            type = parcelType,
                            orderId = orderId.ifBlank { null }
                        )
                        Toast.makeText(context, "Parcel Logged and Resident Notified!", Toast.LENGTH_LONG).show()
                        onBack()
                    }
                },
                modifier = Modifier.testTag("parcel_submit_button")
            )
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

// 4. GUARD PENDING REQUESTS SCREEN (Tabbed view)
@Composable
fun GuardPendingRequestsScreen(onNavigate: (String) -> Unit) {
    var selectedTab by remember { mutableStateOf(0) } // 0: Visitors, 1: Parcels
    val context = LocalContext.current
    val visitors = MockDataStore.visitorsList.filter { 
        it.status == Status.VISITOR_PENDING || 
        it.status == Status.VISITOR_APPROVED || 
        it.status == Status.VISITOR_REJECTED 
    }
    val parcels = MockDataStore.parcelsList

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Gate Pending Queue",
            subtitle = "Awaiting Resident Responses",
            showBackButton = false,
            onNotificationClick = { onNavigate(Routes.NOTIFICATION_HISTORY) }
        )

        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.White,
            contentColor = RoyalBlue
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Visitors (${visitors.size})", fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Parcels (${parcels.size})", fontWeight = FontWeight.Bold) }
            )
        }
// Search bar for filtering visitors and parcels
val searchQuery = remember { mutableStateOf("") }
Row(
    modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 8.dp),
    verticalAlignment = Alignment.CenterVertically
) {
    OutlinedTextField(
        value = searchQuery.value,
        onValueChange = { searchQuery.value = it },
        label = { Text("Search") },
        placeholder = { Text("Enter keywords") },
        singleLine = true,
        trailingIcon = {
            if (searchQuery.value.isNotEmpty()) {
                IconButton(onClick = { searchQuery.value = "" }) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Clear")
                }
            }
        },
        modifier = Modifier.weight(1f)
    )
}
        val filteredVisitors = if (searchQuery.value.isBlank()) visitors else visitors.filter { visitor ->
    val q = searchQuery.value.lowercase()
    visitor.name.lowercase().contains(q) ||
    visitor.phone.lowercase().contains(q) ||
    visitor.flatNo.lowercase().contains(q) ||
    visitor.purpose.lowercase().contains(q) ||
    visitor.status.toString().lowercase().contains(q) }

val filteredParcels = if (searchQuery.value.isBlank()) parcels else parcels.filter { parcel ->
    val q = searchQuery.value.lowercase()
    parcel.flatNo.lowercase().contains(q) ||
    parcel.companyName.lowercase().contains(q) ||
    parcel.courierName.lowercase().contains(q) ||
    parcel.parcelType.lowercase().contains(q) ||
    (parcel.orderId?.lowercase() ?: "").contains(q) ||
    parcel.status.toString().lowercase().contains(q) }

if (selectedTab == 0) {
            if (filteredVisitors.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    EmptyState(title = "All Cleared!", description = "No visitor requests are pending currently.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(filteredVisitors) { item ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, BorderColor),
                            modifier = Modifier.padding(vertical = 6.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = item.name, fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                                    StatusBadge(status = item.status)
                                }
                                Text(text = "Flat ${item.flatNo} • ${item.phone}", color = SecondaryText, fontSize = 13.sp)
                                Text(text = "Purpose: ${item.purpose}", color = SecondaryText, fontSize = 13.sp)
                                Divider(modifier = Modifier.padding(vertical = 12.dp), color = BorderColor)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "Sent: ${item.requestTime}", color = MutedText, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Row {
                                        if (item.status == Status.VISITOR_PENDING) {
                                            Button(
                                                onClick = { VisitorService.rejectVisitor(item.id) },
                                                colors = ButtonDefaults.buttonColors(containerColor = DangerRedMuted),
                                                shape = RoundedCornerShape(8.dp),
                                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                                modifier = Modifier.padding(end = 4.dp)
                                            ) {
                                                Text("Reject", color = DangerRed, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                            }
                                            Button(
                                                onClick = { VisitorService.approveVisitor(item.id) },
                                                colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenMuted),
                                                shape = RoundedCornerShape(8.dp),
                                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                            ) {
                                                Text("Approve", color = SuccessGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                            }
                                        } else if (item.status == Status.VISITOR_APPROVED) {
                                            Button(
                                                onClick = { 
                                                    VisitorService.checkInVisitor(item.id)
                                                    Toast.makeText(context, "Welcome ${item.name}! Checked In.", Toast.LENGTH_LONG).show()
                                                },
                                                colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen),
                                                shape = RoundedCornerShape(8.dp),
                                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                                            ) {
                                                Text("Check In", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (filteredParcels.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    EmptyState(title = "No Pending Parcels", description = "All deliveries have been updated.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(filteredParcels) { item ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, BorderColor),
                            modifier = Modifier.padding(vertical = 6.dp)
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
                                Text(text = "Flat ${item.flatNo} • Courier: ${item.courierName}", color = SecondaryText, fontSize = 13.sp)
                                Text(text = "Type: ${item.parcelType}", color = SecondaryText, fontSize = 13.sp)
                                Divider(modifier = Modifier.padding(vertical = 12.dp), color = BorderColor)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "Logged: ${item.receivedTime}", color = MutedText, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Row {
                                        Button(
                                            onClick = { ParcelService.updateParcelStatus(item.id, 4) }, // Reject
                                            colors = ButtonDefaults.buttonColors(containerColor = DangerRedMuted),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.padding(end = 4.dp)
                                        ) {
                                            Text("Reject", color = DangerRed, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                        Button(
                                            onClick = { ParcelService.updateParcelStatus(item.id, 1) }, // Allow inside
                                            colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenMuted),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text("Deliver Inside", color = SuccessGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun getBitmapFromUri(context: Context, uri: Uri): Bitmap? {
    return try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            val source = ImageDecoder.createSource(context.contentResolver, uri)
            ImageDecoder.decodeBitmap(source) { decoder, _, _ ->
                decoder.isMutableRequired = true
            }
        } else {
            @Suppress("DEPRECATION")
            MediaStore.Images.Media.getBitmap(context.contentResolver, uri)
        }
    } catch (e: Exception) {
        null
    }
}

private fun verifyAndProcessToken(
    token: String,
    context: Context,
    onSuccess: () -> Unit
) {
    val trimmedToken = token.trim()
    if (trimmedToken.isEmpty()) {
        Toast.makeText(context, "Error: Code cannot be empty", Toast.LENGTH_SHORT).show()
        return
    }

    when (trimmedToken) {
        "VISITOR-QR-001" -> {
            val match = MockDataStore.visitorsList.firstOrNull { it.qrCode == "VISITOR-QR-001" }
            if (match != null) {
                if (match.status == Status.VISITOR_CHECKED_IN) {
                    Toast.makeText(context, "Visitor is already checked in.", Toast.LENGTH_LONG).show()
                } else if (match.status != Status.VISITOR_PENDING && match.status != Status.VISITOR_APPROVED) {
                    Toast.makeText(context, "Error: Visitor cannot be checked in (status: ${match.status}).", Toast.LENGTH_LONG).show()
                } else {
                    MockDataStore.setVisitorStatus(match.id, Status.VISITOR_CHECKED_IN, "11:20 AM")
                    onSuccess()
                    Toast.makeText(context, "Success! Visitor ${match.name} Checked In (Flat ${match.flatNo})", Toast.LENGTH_LONG).show()
                }
            } else {
                Toast.makeText(context, "Error: Pre-approved visitor not found", Toast.LENGTH_SHORT).show()
            }
        }
        "PARCEL-QR-001" -> {
            val match = MockDataStore.parcelsList.firstOrNull { it.id == "2" }
            if (match != null) {
                MockDataStore.setParcelStatus(match.id, Status.PARCEL_APPROVED)
                onSuccess()
                Toast.makeText(context, "Success! Parcel QR Verified: Courier ${match.courierName} (${match.companyName}) Approved.", Toast.LENGTH_LONG).show()
            } else {
                onSuccess()
                Toast.makeText(context, "Success! Parcel QR Code verified.", Toast.LENGTH_LONG).show()
            }
        }
        else -> {
            val match = MockDataStore.visitorsList.firstOrNull { it.qrCode == trimmedToken }
            if (match != null) {
                if (match.status == Status.VISITOR_CHECKED_IN) {
                    Toast.makeText(context, "Visitor is already checked in.", Toast.LENGTH_LONG).show()
                } else if (match.status == Status.VISITOR_REJECTED) {
                    Toast.makeText(context, "Error: Visitor request was rejected.", Toast.LENGTH_LONG).show()
                } else if (match.status == Status.VISITOR_CHECKED_OUT) {
                    Toast.makeText(context, "Error: Visitor has already checked out.", Toast.LENGTH_LONG).show()
                } else if (match.status == Status.VISITOR_EXPIRED) {
                    Toast.makeText(context, "Error: Visitor pass has expired.", Toast.LENGTH_LONG).show()
                } else if (match.status == Status.VISITOR_BLOCKED) {
                    Toast.makeText(context, "Error: Visitor is blocked from entry.", Toast.LENGTH_LONG).show()
                } else if (match.status != Status.VISITOR_PENDING && match.status != Status.VISITOR_APPROVED && match.status != Status.VISITOR_OTP_GENERATED) {
                    Toast.makeText(context, "Error: Visitor cannot be checked in (status: ${match.status}).", Toast.LENGTH_LONG).show()
                } else {
                    MockDataStore.setVisitorStatus(match.id, Status.VISITOR_CHECKED_IN, "11:20 AM")
                    onSuccess()
                    Toast.makeText(context, "Success! QR Code Verified. Welcome ${match.name}! Checked In.", Toast.LENGTH_LONG).show()
                }
            } else {
                Toast.makeText(context, "Error: Invalid QR code.", Toast.LENGTH_LONG).show()
            }
        }
    }
}

class QRCodeAnalyzer(private val onQRCodeDetected: (String) -> Unit) : ImageAnalysis.Analyzer {
    private val reader = QRCodeReader()
    private var lastScannedToken: String? = null
    private var lastScanTime = 0L

    private val hints = java.util.EnumMap<com.google.zxing.DecodeHintType, Any>(com.google.zxing.DecodeHintType::class.java).apply {
        put(com.google.zxing.DecodeHintType.TRY_HARDER, java.lang.Boolean.TRUE)
        put(com.google.zxing.DecodeHintType.POSSIBLE_FORMATS, listOf(com.google.zxing.BarcodeFormat.QR_CODE))
    }

    override fun analyze(image: ImageProxy) {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastScanTime < 1500) {
            image.close()
            return
        }

        try {
            val planes = image.planes
            if (planes.isNotEmpty()) {
                val yPlane = planes[0]
                val buffer = yPlane.buffer
                val width = image.width
                val height = image.height
                val rowStride = yPlane.rowStride

                val data = ByteArray(rowStride * height)
                val remaining = buffer.remaining()
                buffer.get(data, 0, minOf(remaining, data.size))

                var source: com.google.zxing.LuminanceSource = PlanarYUVLuminanceSource(
                    data, rowStride, height,
                    0, 0, width, height,
                    false
                )

                var decodedText: String? = null

                try {
                    val binaryBitmap = BinaryBitmap(HybridBinarizer(source))
                    val result = reader.decode(binaryBitmap, hints)
                    decodedText = result.text
                } catch (e: Exception) {
                    // Try rotated
                }

                if (decodedText == null && source.isRotateSupported) {
                    try {
                        val rotation = image.imageInfo.rotationDegrees
                        var rotatedSource = source
                        if (rotation == 90) {
                            rotatedSource = source.rotateCounterClockwise()
                        } else if (rotation == 180) {
                            rotatedSource = source.rotateCounterClockwise().rotateCounterClockwise()
                        } else if (rotation == 270) {
                            rotatedSource = source.rotateCounterClockwise().rotateCounterClockwise().rotateCounterClockwise()
                        }
                        if (rotatedSource != source) {
                            val binaryBitmap = BinaryBitmap(HybridBinarizer(rotatedSource))
                            val result = reader.decode(binaryBitmap, hints)
                            decodedText = result.text
                        }
                    } catch (e: Exception) {
                        // Ignore
                    }
                }

                if (decodedText != null) {
                    val trimmed = decodedText.trim()
                    if (trimmed.isNotEmpty() && trimmed != lastScannedToken) {
                        lastScannedToken = trimmed
                        lastScanTime = currentTime
                        onQRCodeDetected(trimmed)
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore
        } finally {
            image.close()
        }
    }
}

// 5. SCAN QR SCREEN
@Composable
fun ScanQrScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    var showManualInput by remember { mutableStateOf(false) }
    var codeValue by remember { mutableStateOf("") }
    val lifecycleOwner = LocalLifecycleOwner.current
    var cameraControl by remember { mutableStateOf<androidx.camera.core.CameraControl?>(null) }
    var isTorchOn by remember { mutableStateOf(false) }
    var showSimulateScanDialog by remember { mutableStateOf(false) }
    var simulatedScanCode by remember { mutableStateOf("") }

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            val bitmap = getBitmapFromUri(context, uri)
            if (bitmap != null) {
                val decodedToken = com.example.util.QRCodeUtil.decodeBitmap(bitmap)
                if (decodedToken != null) {
                    verifyAndProcessToken(decodedToken, context) {
                        onBack()
                    }
                } else {
                    Toast.makeText(context, "Error: Unreadable QR Code image.", Toast.LENGTH_LONG).show()
                }
            } else {
                Toast.makeText(context, "Error: Failed to load selected image.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    var isCameraActive by remember { mutableStateOf(false) }
    val cameraProviderFuture = remember { ProcessCameraProvider.getInstance(context) }
    var hasScanned by remember { mutableStateOf(false) }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            isCameraActive = true
            Toast.makeText(context, "Camera access granted.", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(context, "Camera permission denied. Using manual fallback.", Toast.LENGTH_LONG).show()
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            try {
                if (cameraProviderFuture.isDone) {
                    val cameraProvider = cameraProviderFuture.get()
                    cameraProvider.unbindAll()
                }
            } catch (e: Exception) {
                // Ignore
            }
        }
    }

    if (showManualInput) {
        Dialog(onDismissRequest = { showManualInput = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Enter Code Manually", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = PrimaryNavy)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = codeValue,
                        onValueChange = { codeValue = it },
                        placeholder = { Text("E.g. PASS-1234") },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showManualInput = false }) { Text("Cancel") }
                        Button(
                            onClick = {
                                showManualInput = false
                                verifyAndProcessToken(codeValue, context) {
                                    onBack()
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                        ) {
                            Text("Verify Code")
                        }
                    }
                }
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(BackgroundColor)) {
        if (isCameraActive) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier.padding(24.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .background(SuccessGreen, shape = RoundedCornerShape(20.dp))
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "REAL CAMERA SCANNER ACTIVE",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Align visitor pass QR inside the scan frame.",
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 16.sp,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(32.dp))

                    Box(
                        modifier = Modifier
                            .size(240.dp)
                            .border(BorderStroke(3.dp, SuccessGreen), shape = RoundedCornerShape(24.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        AndroidView(
                            factory = { ctx ->
                                val previewView = PreviewView(ctx).apply {
                                    scaleType = PreviewView.ScaleType.FILL_CENTER
                                }
                                val executor = Executors.newSingleThreadExecutor()
                                cameraProviderFuture.addListener({
                                    val cameraProvider = cameraProviderFuture.get()
                                    val preview = Preview.Builder().build().also {
                                        it.surfaceProvider = previewView.surfaceProvider
                                    }

                                    val imageAnalysis = ImageAnalysis.Builder()
                                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                                        .build()
                                        .also {
                                            it.setAnalyzer(executor, QRCodeAnalyzer { scannedCode ->
                                                if (!hasScanned) {
                                                    hasScanned = true
                                                    previewView.post {
                                                        verifyAndProcessToken(scannedCode, context) {
                                                            onBack()
                                                        }
                                                        previewView.postDelayed({ hasScanned = false }, 3000)
                                                    }
                                                }
                                            })
                                        }

                                    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                                    try {
                                        cameraProvider.unbindAll()
                                        val camera = cameraProvider.bindToLifecycle(
                                            lifecycleOwner,
                                            cameraSelector,
                                            preview,
                                            imageAnalysis
                                        )
                                        cameraControl = camera.cameraControl
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Error binding camera: ${e.message}", Toast.LENGTH_SHORT).show()
                                    }
                                }, ContextCompat.getMainExecutor(ctx))
                                previewView
                            },
                            modifier = Modifier.fillMaxSize()
                        )

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(2.dp)
                                .background(SuccessGreen)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "Point camera at Resident QR code\nKeep QR inside frame\nIncrease brightness on other phone",
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 12.sp,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 16.sp
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Button(
                            onClick = {
                                cameraControl?.let {
                                    val nextTorchState = !isTorchOn
                                    it.enableTorch(nextTorchState)
                                    isTorchOn = nextTorchState
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = if (isTorchOn) RoyalBlue else SuccessGreen),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                imageVector = if (isTorchOn) Icons.Default.FlashOn else Icons.Default.FlashOff,
                                contentDescription = "Torch Toggle",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(if (isTorchOn) "Torch ON" else "Torch OFF", color = Color.White, fontSize = 12.sp)
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Button(
                            onClick = { showSimulateScanDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(imageVector = Icons.Default.CameraAlt, contentDescription = "Simulate Scan", tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Simulate", color = Color.White, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    TextButton(onClick = { 
                        isCameraActive = false 
                        try {
                            val cameraProvider = cameraProviderFuture.get()
                            cameraProvider.unbindAll()
                        } catch (e: Exception) {}
                    }) {
                        Text("Cancel Camera Scan", color = Color.White)
                    }

                    if (showSimulateScanDialog) {
                        Dialog(onDismissRequest = { showSimulateScanDialog = false }) {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text("Simulate QR Scan Code", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = PrimaryNavy)
                                    Spacer(modifier = Modifier.height(12.dp))
                                    OutlinedTextField(
                                        value = simulatedScanCode,
                                        onValueChange = { simulatedScanCode = it },
                                        placeholder = { Text("E.g. PASS-1234") },
                                        shape = RoundedCornerShape(12.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                                        TextButton(onClick = { showSimulateScanDialog = false }) { Text("Cancel") }
                                        Button(
                                            onClick = {
                                                showSimulateScanDialog = false
                                                verifyAndProcessToken(simulatedScanCode, context) {
                                                    onBack()
                                                }
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen)
                                        ) {
                                            Text("Simulate Scan")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(RoyalBlue.copy(alpha = 0.1f), shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCodeScanner,
                        contentDescription = "QR Scanner",
                        tint = RoyalBlue,
                        modifier = Modifier.size(40.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "Verify Gate Pass QR",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryNavy,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "Verify incoming visitors using their generated digital gate pass",
                    fontSize = 14.sp,
                    color = SecondaryText,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )

                Spacer(modifier = Modifier.height(36.dp))

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable {
                            val permissionCheck = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
                            if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
                                isCameraActive = true
                            } else {
                                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                            }
                        },
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(SuccessGreenMuted, shape = RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.CameraAlt, contentDescription = "Camera", tint = SuccessGreen)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text("Scan QR with Camera", fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                            Text("Use device camera to scan QR code pass", color = SecondaryText, fontSize = 12.sp)
                        }
                    }
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable {
                            galleryLauncher.launch("image/*")
                        },
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(RoyalBlueMuted, shape = RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.PhotoLibrary, contentDescription = "Gallery", tint = RoyalBlue)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text("Import QR from Gallery", fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                            Text("Select a saved QR pass image from gallery", color = SecondaryText, fontSize = 12.sp)
                        }
                    }
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable { showManualInput = true },
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(WarningAmberMuted, shape = RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.Keyboard, contentDescription = "Keyboard", tint = WarningAmber)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text("Enter QR Token Manually", fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                            Text("Manually enter QR/pass token string fallback", color = SecondaryText, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        IconButton(
            onClick = onBack,
            modifier = Modifier
                .statusBarsPadding()
                .padding(12.dp)
                .background(Color.White, shape = CircleShape)
                .align(Alignment.TopStart)
        ) {
            Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = PrimaryNavy)
        }
    }
}

// 6. VERIFY OTP SCREEN
@Composable
fun VerifyOtpScreen(onBack: () -> Unit) {
    val otpValues = remember { mutableStateListOf("", "", "", "", "", "") }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .background(RoyalBlue, shape = CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = Icons.Default.Shield, contentDescription = "Security", tint = Color.White, modifier = Modifier.size(36.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Verify Guard Identity",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = PrimaryNavy,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "We've sent a 6-digit verification code to your registered device for Station A.",
            fontSize = 14.sp,
            color = SecondaryText,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(32.dp))

        OTPInput(
            otpValues = otpValues,
            onValueChange = { index, value ->
                otpValues[index] = value
            }
        )

        Spacer(modifier = Modifier.height(32.dp))

        PrimaryButton(
            title = "Verify",
            icon = Icons.Default.VerifiedUser,
            onClick = {
                val fullOtp = otpValues.joinToString("").trim()
                if (fullOtp.isEmpty()) {
                    Toast.makeText(context, "Error: OTP cannot be empty", Toast.LENGTH_SHORT).show()
                    return@PrimaryButton
                }
                if (fullOtp.length != 6) {
                    Toast.makeText(context, "Error: OTP must be exactly 6 digits", Toast.LENGTH_SHORT).show()
                    return@PrimaryButton
                }
                if (fullOtp == "000000") {
                    Toast.makeText(context, "Error: This OTP code has expired!", Toast.LENGTH_LONG).show()
                    return@PrimaryButton
                }
                val match = MockDataStore.visitorsList.firstOrNull { it.otp == fullOtp }
                if (match != null) {
                    when (match.status) {
                        Status.VISITOR_EXPIRED -> {
                            Toast.makeText(context, "Error: This OTP code has expired!", Toast.LENGTH_LONG).show()
                        }
                        Status.VISITOR_CHECKED_IN -> {
                            Toast.makeText(context, "Error: Visitor already checked in via OTP.", Toast.LENGTH_SHORT).show()
                        }
                        else -> {
                            MockDataStore.setVisitorStatus(match.id, Status.VISITOR_CHECKED_IN, "11:20 AM")
                            Toast.makeText(context, "Success! OTP Verified. Checked In ${match.name}.", Toast.LENGTH_LONG).show()
                            onBack()
                        }
                    }
                } else {
                    Toast.makeText(context, "Error: Invalid OTP code. Hint: Try 123456 or 482913", Toast.LENGTH_LONG).show()
                }
            },
            modifier = Modifier.testTag("verify_otp_button")
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Didn't receive the code? Resend OTP",
            color = RoyalBlue,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.clickable {
                Toast.makeText(context, "New OTP dispatched to Station Gate", Toast.LENGTH_SHORT).show()
            }
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Back to Station Login",
            color = SecondaryText,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.clickable { onBack() }
        )

        Spacer(modifier = Modifier.height(60.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(imageVector = Icons.Default.Lock, contentDescription = "Secure", tint = MutedText, modifier = Modifier.size(14.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(text = "Secure Guard Authentication Protocol v2.4", color = MutedText, fontSize = 11.sp, fontWeight = FontWeight.Medium)
        }
    }
}

// 7. INSIDE VISITORS & HISTORY
@Composable
fun InsideVisitorsScreen(onNavigate: (String) -> Unit) {
    val activeVisitors = MockDataStore.visitorsList.filter { it.status == Status.VISITOR_CHECKED_IN }
    val historicalVisitors = MockDataStore.visitorsList.filter { it.status == Status.VISITOR_CHECKED_OUT || it.status == Status.VISITOR_REJECTED }
    var showHistoricalTab by remember { mutableStateOf(false) } // False: Inside now, True: Past logs

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Gate Activity Feed",
            subtitle = if (showHistoricalTab) "Historical Security Logs" else "Currently Inside Society",
            onNotificationClick = { onNavigate(Routes.NOTIFICATION_HISTORY) }
        )

        TabRow(selectedTabIndex = if (showHistoricalTab) 1 else 0, containerColor = Color.White, contentColor = RoyalBlue) {
            Tab(selected = !showHistoricalTab, onClick = { showHistoricalTab = false }, text = { Text("Currently Inside (${activeVisitors.size})", fontWeight = FontWeight.Bold) })
            Tab(selected = showHistoricalTab, onClick = { showHistoricalTab = true }, text = { Text("Log History (${historicalVisitors.size})", fontWeight = FontWeight.Bold) })
        }

        if (!showHistoricalTab) {
            if (activeVisitors.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    EmptyState(title = "No inside visitors", description = "All incoming guests have checked out.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(activeVisitors) { item ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, BorderColor),
                            modifier = Modifier.padding(vertical = 6.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = item.name, fontWeight = FontWeight.Bold, color = PrimaryText, fontSize = 16.sp)
                                    StatusBadge(status = item.status)
                                }
                                Text(text = "Flat ${item.flatNo} • ${item.phone}", color = SecondaryText, fontSize = 13.sp)
                                Text(text = "Purpose: ${item.purpose}", color = SecondaryText, fontSize = 13.sp)
                                Text(text = "Entered: ${item.entryTime ?: "09:00 AM"}", color = MutedText, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 4.dp))
                                Spacer(modifier = Modifier.height(14.dp))
                                PrimaryButton(
                                    title = "Mark Outward Exit",
                                    icon = Icons.Default.Logout,
                                    onClick = {
                                    onNavigate("checkout_visitor/${item.id}")
                                }
                                )
                            }
                        }
                    }
                }
            }
        } else {
            if (historicalVisitors.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    EmptyState(title = "No history logged yet", description = "Guest checkouts will log here.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    items(historicalVisitors) { item ->
                        ActivityCard(
                            title = item.name,
                            subtitle = "Flat ${item.flatNo} • Purpose: ${item.purpose}",
                            time = "In: ${item.entryTime ?: "-"} | Out: ${item.exitTime ?: "-"}",
                            status = item.status,
                            avatarInitial = item.name.firstOrNull()?.toString() ?: "V"
                        )
                    }
                }
            }
        }
    }
}

// 8. CHECKOUT VISITOR SCREEN
@Composable
fun CheckoutVisitorScreen(
    visitorId: String,
    onBack: () -> Unit,
    onCheckoutConfirmed: () -> Unit
) {
    val context = LocalContext.current
    val item = MockDataStore.visitorsList.firstOrNull { it.id == visitorId }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Confirm Outward Exit",
            subtitle = "Security Station: Gate 4",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        if (item == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Visitor not found", color = SecondaryText, fontSize = 16.sp)
            }
        } else {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(DangerRedMuted, shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Logout,
                        contentDescription = "Exit",
                        tint = DangerRed,
                        modifier = Modifier.size(40.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "Confirm Checkout?",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryNavy
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "This will register the exit time and mark the visitor as checked out.",
                    fontSize = 14.sp,
                    color = SecondaryText,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Visitor details card
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, BorderColor),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "Visitor Name", color = MutedText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(text = item.name, color = PrimaryText, fontSize = 16.sp, fontWeight = FontWeight.Bold)

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = "Destination Flat", color = MutedText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Flat ${item.flatNo} (${item.residentName})", color = PrimaryText, fontSize = 15.sp)

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = "Mobile Number", color = MutedText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(text = item.phone, color = PrimaryText, fontSize = 15.sp)

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = "Entry Time", color = MutedText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(text = item.entryTime ?: "Just Now", color = PrimaryText, fontSize = 15.sp)
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                PrimaryButton(
                    title = "Confirm Exit",
                    icon = Icons.Default.Check,
                    onClick = {
                        MockDataStore.setVisitorStatus(item.id, Status.VISITOR_CHECKED_OUT, "11:20 AM")
                        Toast.makeText(context, "Exit registered for ${item.name} successfully!", Toast.LENGTH_LONG).show()
                        onCheckoutConfirmed()
                    },
                    modifier = Modifier.testTag("confirm_checkout_button")
                )

                Spacer(modifier = Modifier.height(12.dp))

                SecondaryButton(
                    title = "Cancel / Go Back",
                    onClick = onBack
                )
            }
        }
    }
}

// 9. PARCEL RECORDS SCREEN
@Composable
fun ParcelRecordsScreen(
    onNavigate: (String) -> Unit,
    onBack: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("All") }
    var searchQueryState by remember { mutableStateOf("") }
    val filters = listOf("All", "Pending", "Held at Gate", "Delivered", "Rejected")

    // Reactive filtered parcels directly from MockDataStore.parcelsList
    val filteredParcels by derivedStateOf {
        val baseList = MockDataStore.parcelsList
        val statusFiltered = when (selectedFilter) {
            "Pending" -> baseList.filter { it.status == Status.PARCEL_PENDING }
            "Held at Gate" -> baseList.filter { it.status == Status.PARCEL_HELD_AT_GATE }
            "Delivered" -> baseList.filter { it.status == Status.PARCEL_DELIVERED }
            "Rejected" -> baseList.filter { it.status == Status.PARCEL_REJECTED }
            else -> baseList
        }
        if (searchQueryState.isBlank()) {
            statusFiltered
        } else {
            val q = searchQueryState.lowercase()
            statusFiltered.filter { parcel ->
                parcel.flatNo.lowercase().contains(q) ||
                parcel.companyName.lowercase().contains(q) ||
                parcel.courierName.lowercase().contains(q) ||
                parcel.parcelType.lowercase().contains(q) ||
                (parcel.orderId?.lowercase() ?: "").contains(q) ||
                parcel.status.lowercase().contains(q)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        AppHeader(
            title = "Parcel Records",
            subtitle = "Manage Deliveries at Gate",
            showBackButton = true,
            onBackClick = onBack,
            showProfileAvatar = false
        )

        // Search bar
        OutlinedTextField(
            value = searchQueryState,
            onValueChange = { searchQueryState = it },
            label = { Text("Search parcels") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            trailingIcon = {
                if (searchQueryState.isNotEmpty()) {
                    IconButton(onClick = { searchQueryState = "" }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear")
                    }
                }
            },
            singleLine = true
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
                    description = "There are no packages in '$selectedFilter' status."
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
                            Text(text = "Flat ${item.flatNo} • Courier: ${item.courierName}", color = SecondaryText, fontSize = 13.sp)
                            Text(text = "Mobile: ${item.phone}", color = SecondaryText, fontSize = 13.sp)
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

                            // Action buttons if parcel is pending or held at gate
                            if (item.status == Status.PARCEL_PENDING || item.status == Status.PARCEL_HELD_AT_GATE) {
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Button(
                                        onClick = { MockDataStore.setParcelStatus(item.id, Status.PARCEL_DELIVERED) },
                                        colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenMuted),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(vertical = 8.dp)
                                    ) {
                                        Text("Mark Delivered", color = SuccessGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                    if (item.status != Status.PARCEL_HELD_AT_GATE) {
                                        Button(
                                            onClick = { MockDataStore.setParcelStatus(item.id, Status.PARCEL_HELD_AT_GATE) },
                                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlueMuted),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.weight(1f),
                                            contentPadding = PaddingValues(vertical = 8.dp)
                                        ) {
                                            Text("Hold at Gate", color = RoyalBlue, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                    Button(
                                        onClick = { MockDataStore.setParcelStatus(item.id, Status.PARCEL_REJECTED) },
                                        colors = ButtonDefaults.buttonColors(containerColor = DangerRedMuted),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(vertical = 8.dp)
                                    ) {
                                        Text("Reject", color = DangerRed, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
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
