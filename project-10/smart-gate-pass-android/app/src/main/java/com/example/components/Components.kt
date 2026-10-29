package com.example.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.constants.Status
import com.example.ui.theme.*

// 1. App Header
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppHeader(
    title: String = "SmartGate",
    subtitle: String? = null,
    showBackButton: Boolean = false,
    onBackClick: () -> Unit = {},
    showProfileAvatar: Boolean = true,
    profileInitial: String = "S",
    unreadNotificationsCount: Int = 3,
    onNotificationClick: () -> Unit = {}
) {
    TopAppBar(
        title = {
            Column {
                Text(
                    text = title,
                    color = PrimaryNavy,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        color = SecondaryText,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        },
        navigationIcon = {
            if (showBackButton) {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = PrimaryNavy
                    )
                }
            } else if (showProfileAvatar) {
                Box(
                    modifier = Modifier
                        .padding(start = 12.dp, end = 8.dp)
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(RoyalBlueMuted)
                        .clickable { },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = profileInitial,
                        color = RoyalBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            }
        },
        actions = {
            Box(
                modifier = Modifier
                    .padding(end = 12.dp)
                    .clickable { onNotificationClick() }
            ) {
                IconButton(onClick = onNotificationClick) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = PrimaryNavy,
                        modifier = Modifier.size(26.dp)
                    )
                }
                if (unreadNotificationsCount > 0) {
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .background(DangerRed, shape = CircleShape)
                            .align(Alignment.TopEnd)
                            .offset(x = (-4).dp, y = 4.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = unreadNotificationsCount.toString(),
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color.White
        )
    )
}

// 2. Bottom Tab Bar
@Composable
fun BottomTabBar(
    selectedRoute: String,
    onRouteSelected: (String) -> Unit,
    isGuard: Boolean = true
) {
    Surface(
        tonalElevation = 8.dp,
        color = Color.White,
        modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp)
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            val items = if (isGuard) {
                listOf(
                    Triple("guard_dashboard", Icons.Default.Home, "Home"),
                    Triple("guard_pending", Icons.Default.Pending, "Pending"),
                    Triple("scan_qr", Icons.Default.QrCodeScanner, "QR Scan"),
                    Triple("inside_visitors", Icons.Default.Groups, "Inside")
                )
            } else {
                listOf(
                    Triple("resident_dashboard", Icons.Default.Home, "Home"),
                    Triple("visitor_requests", Icons.Default.AssignmentInd, "Visitor Req"),
                    Triple("parcel_requests", Icons.Default.Inventory, "Parcel Req"),
                    Triple("notification_history", Icons.Default.History, "Alerts")
                )
            }

            items.forEach { (route, icon, label) ->
                val isSelected = selectedRoute == route
                val tintColor = if (isSelected) RoyalBlue else SecondaryText

                Column(
                    modifier = Modifier
                        .testTag("tab_button_$route")
                        .weight(1f)
                        .clickable { onRouteSelected(route) }
                        .padding(vertical = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        tint = tintColor,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = label,
                        color = tintColor,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }
    }
}

// 3. Dashboard Card (Counter Card)
@Composable
fun DashboardCard(
    count: String,
    title: String,
    badgeText: String,
    badgeColor: Color,
    badgeBg: Color,
    icon: ImageVector,
    iconTint: Color,
    iconBg: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, BorderColor),
        modifier = modifier
            .padding(4.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(iconBg, shape = RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = icon, contentDescription = title, tint = iconTint, modifier = Modifier.size(20.dp))
                }
                Box(
                    modifier = Modifier
                        .background(badgeBg, shape = RoundedCornerShape(20.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = badgeText,
                        color = badgeColor,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = count,
                color = PrimaryNavy,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = title,
                color = SecondaryText,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

// 4. Quick Action Button
@Composable
fun QuickActionButton(
    title: String,
    icon: ImageVector,
    backgroundColor: Color,
    textColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        modifier = modifier
            .padding(4.dp)
            .height(96.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = textColor,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                color = textColor,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
    }
}

// 5. Status Badge
@Composable
fun StatusBadge(status: String) {
    Box(
        modifier = Modifier
            .background(
                color = Status.getStatusContainerColor(status),
                shape = RoundedCornerShape(20.dp)
            )
            .padding(horizontal = 10.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = status.uppercase(),
            color = Status.getStatusTextColor(status),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

// 6. Text Input Field
@Composable
fun TextInputField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    leadingIcon: ImageVector,
    isPassword: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
    modifier: Modifier = Modifier
) {
    var passwordVisible by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = PrimaryNavy,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = MutedText) },
            leadingIcon = { Icon(imageVector = leadingIcon, contentDescription = label, tint = SecondaryText) },
            trailingIcon = {
                if (isPassword) {
                    val icon = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(imageVector = icon, contentDescription = "Toggle password")
                    }
                }
            },
            visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = RoyalBlue,
                unfocusedBorderColor = BorderColor,
                focusedTextColor = PrimaryText,
                unfocusedTextColor = PrimaryText
            ),
            modifier = Modifier.fillMaxWidth()
        )
    }
}

// 7. Dropdown Field
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DropdownField(
    selectedOption: String,
    options: List<String>,
    onOptionSelected: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = PrimaryNavy,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        ExposedDropdownMenuBox(
            expanded = expanded,
            onExpandedChange = { expanded = !expanded },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = selectedOption,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedBorderColor = RoyalBlue,
                    unfocusedBorderColor = BorderColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                ),
                modifier = Modifier
                    .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                    .fillMaxWidth()
            )
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(Color.White)
            ) {
                options.forEach { option ->
                    DropdownMenuItem(
                        text = { Text(option, fontWeight = FontWeight.Medium) },
                        onClick = {
                            onOptionSelected(option)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}

// 8. Buttons
@Composable
fun PrimaryButton(
    title: String,
    icon: ImageVector? = null,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
        shape = RoundedCornerShape(12.dp),
        contentPadding = PaddingValues(16.dp),
        modifier = modifier.fillMaxWidth().testTag("primary_button")
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(imageVector = icon, contentDescription = title, tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(text = title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
fun SecondaryButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedButton(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, BorderColor),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryNavy),
        contentPadding = PaddingValues(16.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Text(text = title, fontSize = 16.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun DangerButton(
    title: String,
    icon: ImageVector? = null,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = DangerRedMuted),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, DangerRed),
        contentPadding = PaddingValues(14.dp),
        modifier = modifier.testTag("danger_button")
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(imageVector = icon, contentDescription = title, tint = DangerRed)
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = DangerRed)
        }
    }
}

@Composable
fun SuccessButton(
    title: String,
    icon: ImageVector? = null,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenMuted),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, SuccessGreen),
        contentPadding = PaddingValues(14.dp),
        modifier = modifier.testTag("success_button")
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(imageVector = icon, contentDescription = title, tint = SuccessGreen)
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = SuccessGreen)
        }
    }
}

// 9. OTP Input Composable
@Composable
fun OTPInput(
    otpValues: List<String>,
    onValueChange: (Int, String) -> Unit
) {
    Row(
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp)
    ) {
        for (i in 0..5) {
            OutlinedTextField(
                value = otpValues[i],
                onValueChange = { newValue ->
                    if (newValue.length <= 1) {
                        onValueChange(i, newValue)
                    }
                },
                textStyle = LocalTextStyle.current.copy(
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                ),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedBorderColor = RoyalBlue,
                    unfocusedBorderColor = BorderColor
                ),
                modifier = Modifier
                    .size(46.dp)
                    .testTag("otp_input_$i")
            )
            if (i == 2) {
                Text(
                    text = "-",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = SecondaryText,
                    modifier = Modifier.padding(horizontal = 4.dp)
                )
            }
        }
    }
}

// 10. QR Scanner Placeholder Overlay
@Composable
fun QRScannerPlaceholder(
    onManualCodeClick: () -> Unit,
    onFlashClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.85f)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(24.dp)
        ) {
            Box(
                modifier = Modifier
                    .background(RoyalBlue, shape = RoundedCornerShape(20.dp))
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "SCANNER ACTIVE",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Place the QR code inside the frame to scan.",
                color = Color.White,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
                textAlign = TextAlign.Center
            )
            Text(
                text = "Ensure the code is well-lit and centered.",
                color = MutedText,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Visual scan outline
            Box(
                modifier = Modifier
                    .size(240.dp)
                    .border(BorderStroke(3.dp, RoyalBlue), shape = RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.QrCode2,
                    contentDescription = "QR Code Scanner",
                    tint = Color.White.copy(alpha = 0.3f),
                    modifier = Modifier.size(160.dp)
                )
                // Middle scan alignment line
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp)
                        .background(RoyalBlue)
                )
            }

            Spacer(modifier = Modifier.height(40.dp))

            Button(
                onClick = onManualCodeClick,
                colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.2f)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.Keyboard, contentDescription = "Manual Code", tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Enter Code Manually", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        // Floating Flash icon
        FloatingActionButton(
            onClick = onFlashClick,
            containerColor = Color.White.copy(alpha = 0.2f),
            shape = CircleShape,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
        ) {
            Icon(imageVector = Icons.Default.FlashlightOn, contentDescription = "Flashlight", tint = Color.White)
        }
    }
}

// 11. Activity Log Card
@Composable
fun ActivityCard(
    title: String,
    subtitle: String,
    time: String,
    status: String,
    avatarInitial: String,
    onClick: () -> Unit = {}
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, BorderColor),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(PrimaryNavyMuted),
                contentAlignment = Alignment.Center
            ) {
                Text(text = avatarInitial, color = PrimaryNavy, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = title, color = PrimaryText, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    StatusBadge(status = status)
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(text = subtitle, color = SecondaryText, fontSize = 12.sp)
                Text(text = time, color = MutedText, fontSize = 10.sp, modifier = Modifier.padding(top = 2.dp))
            }
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "Details",
                tint = MutedText,
                modifier = Modifier.padding(start = 4.dp)
            )
        }
    }
}

// 12. Notification Alert Card
@Composable
fun NotificationCard(
    title: String,
    body: String,
    time: String,
    isRead: Boolean,
    onMarkAsRead: () -> Unit = {}
) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (isRead) Color.White else RoyalBlueMuted.copy(alpha = 0.3f)
        ),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, if (isRead) BorderColor else RoyalBlueMuted),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable { onMarkAsRead() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .padding(top = 4.dp)
                    .size(8.dp)
                    .background(if (isRead) Color.Transparent else RoyalBlue, shape = CircleShape)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = PrimaryText
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = body,
                    fontSize = 12.sp,
                    color = SecondaryText
                )
                Text(
                    text = time,
                    fontSize = 10.sp,
                    color = MutedText,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
    }
}

// 13. Empty State Card
@Composable
fun EmptyState(
    title: String,
    description: String,
    icon: ImageVector = Icons.Default.Info
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = "Empty",
            tint = MutedText,
            modifier = Modifier.size(64.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = PrimaryNavy,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = description,
            fontSize = 13.sp,
            color = SecondaryText,
            textAlign = TextAlign.Center
        )
    }
}

// 14. Loading State
@Composable
fun LoadingState() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(color = RoyalBlue)
    }
}

// 15. Error State
@Composable
fun ErrorState(message: String, onRetry: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(imageVector = Icons.Default.Error, contentDescription = "Error", tint = DangerRed, modifier = Modifier.size(54.dp))
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "An Error Occurred", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = PrimaryNavy)
        Text(
            text = message,
            fontSize = 13.sp,
            color = SecondaryText,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 4.dp)
        )
        Spacer(modifier = Modifier.height(24.dp))
        SecondaryButton(title = "Retry", onClick = onRetry)
    }
}

// 16. Interactive Modal Confirmation Dialog
@Composable
fun ConfirmationModal(
    show: Boolean,
    title: String,
    message: String,
    confirmText: String = "Confirm",
    cancelText: String = "Cancel",
    onConfirm: () -> Unit,
    onCancel: () -> Unit
) {
    if (show) {
        Dialog(onDismissRequest = onCancel) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = PrimaryNavy
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = message,
                        fontSize = 14.sp,
                        color = SecondaryText,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        OutlinedButton(
                            onClick = onCancel,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f).padding(end = 8.dp)
                        ) {
                            Text(text = cancelText, color = PrimaryNavy, fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = onConfirm,
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                            modifier = Modifier.weight(1f).padding(start = 8.dp)
                        ) {
                            Text(text = confirmText, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
