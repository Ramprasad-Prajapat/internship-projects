package com.example.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.components.PrimaryButton
import com.example.components.TextInputField
import com.example.constants.Routes
import com.example.services.AuthService
import com.example.ui.theme.*
import kotlinx.coroutines.delay

// 1. SPLASH SCREEN
@Composable
fun SplashScreen(onNavigate: (String) -> Unit) {
    var loadingPercent by remember { mutableStateOf(0f) }

    LaunchedEffect(Unit) {
        // Simple mock loading animation
        while (loadingPercent < 1f) {
            delay(100)
            loadingPercent += 0.1f
        }
        
        if (AuthService.checkAuthStatus()) {
            val user = AuthService.getCurrentUser()
            when (user?.role) {
                "GUARD" -> onNavigate(Routes.GUARD_DASHBOARD)
                "RESIDENT" -> onNavigate(Routes.RESIDENT_DASHBOARD)
                else -> onNavigate(Routes.UNAUTHORIZED)
            }
        } else {
            onNavigate(Routes.LOGIN)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryNavy)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Rounded Shield Icon Box
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .background(Color.White, shape = RoundedCornerShape(28.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = "Smart Gate Shield",
                    tint = PrimaryNavy,
                    modifier = Modifier.size(54.dp)
                )
            }
            Spacer(modifier = Modifier.height(28.dp))
            Text(
                text = "Smart Gate Pass",
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Secure Visitor & Parcel Management",
                color = MutedText,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )
        }

        // Connection text and progress line at the bottom
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 48.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Horizontal Blue progress bar
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.6f)
                    .height(4.dp)
                    .background(PrimaryNavyMuted.copy(alpha = 0.2f), shape = RoundedCornerShape(2.dp))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(loadingPercent)
                        .fillMaxHeight()
                        .background(RoyalBlue, shape = RoundedCornerShape(2.dp))
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "CHECKING SECURE SESSION...",
                color = MutedText,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        }
    }
}

// 2. LOGIN SCREEN
@Composable
fun LoginScreen(onNavigate: (String) -> Unit) {
    var identifier by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Spacer(modifier = Modifier.height(30.dp))

        // App Logo Icon Header
        Box(
            modifier = Modifier
                .size(64.dp)
                .background(RoyalBlueMuted, shape = RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = "SmartGate Logo",
                tint = RoyalBlue,
                modifier = Modifier.size(34.dp)
            )
        }
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "SmartGate",
            fontSize = 36.sp,
            fontWeight = FontWeight.ExtraBold,
            color = PrimaryNavy
        )
        Text(
            text = "Professional Security Management",
            fontSize = 14.sp,
            color = SecondaryText,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // Login Panel Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, BorderColor),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp)
            ) {
                TextInputField(
                    value = identifier,
                    onValueChange = { identifier = it; errorMessage = null },
                    label = "Mobile or Email",
                    placeholder = "Enter contact details",
                    leadingIcon = Icons.Default.Person,
                    modifier = Modifier.testTag("login_username_input")
                )

                Spacer(modifier = Modifier.height(16.dp))

                TextInputField(
                    value = password,
                    onValueChange = { password = it; errorMessage = null },
                    label = "Password",
                    placeholder = "••••••••",
                    leadingIcon = Icons.Default.Lock,
                    isPassword = true,
                    modifier = Modifier.testTag("login_password_input")
                )

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = rememberMe,
                            onCheckedChange = { rememberMe = it },
                            colors = CheckboxDefaults.colors(checkedColor = RoyalBlue)
                        )
                        Text(text = "Remember me", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = SecondaryText)
                    }
                    Text(
                        text = "Forgot Password?",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue,
                        modifier = Modifier.clickable { }
                    )
                }

                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = DangerRed,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                PrimaryButton(
                    title = "Login",
                    icon = Icons.Default.Login,
                    onClick = {
                        AuthService.login(identifier, password) { success, role ->
                            if (success) {
                                when (role) {
                                    "GUARD" -> onNavigate(Routes.GUARD_DASHBOARD)
                                    "RESIDENT" -> onNavigate(Routes.RESIDENT_DASHBOARD)
                                    else -> onNavigate(Routes.UNAUTHORIZED)
                                }
                            } else {
                                errorMessage = role
                            }
                        }
                    },
                    modifier = Modifier.testTag("login_submit_button")
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Footer section with secondary login buttons
                Text(
                    text = "Secured by SmartGate Enterprise",
                    color = SecondaryText,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(BorderColor.copy(alpha = 0.5f), shape = CircleShape)
                            .clickable { },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Fingerprint, contentDescription = "Biometrics", tint = SecondaryText)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(BorderColor.copy(alpha = 0.5f), shape = CircleShape)
                            .clickable { },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.QrCode, contentDescription = "QR Auth", tint = SecondaryText)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Quick login shortcuts for developer convenience
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PrimaryNavyMuted.copy(alpha = 0.3f)),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = "Quick Mock Logins (Tap to prefill):",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryNavy
                )
                Spacer(modifier = Modifier.height(8.dp))
                 Row(modifier = Modifier.fillMaxWidth()) {
                    Button(
                        onClick = { identifier = "9999999999"; password = "guard123" },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlueMuted),
                        modifier = Modifier.weight(1f).padding(end = 4.dp).testTag("quick_login_guard")
                    ) {
                        Text("As Guard", color = RoyalBlue, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Button(
                        onClick = { identifier = "8888888888"; password = "resident123" },
                        colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenMuted),
                        modifier = Modifier.weight(1f).padding(start = 4.dp).testTag("quick_login_resident")
                    ) {
                        Text("As Resident", color = SuccessGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        val context = androidx.compose.ui.platform.LocalContext.current
        androidx.compose.material3.OutlinedButton(
            onClick = {
                com.example.storage.LocalDataStorage.clearDataAndRestoreDefaults()
                android.widget.Toast.makeText(context, "Demo data reset successfully", android.widget.Toast.LENGTH_SHORT).show()
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp)
                .testTag("reset_demo_data_button"),
            colors = androidx.compose.material3.ButtonDefaults.outlinedButtonColors(contentColor = DangerRed),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, DangerRed),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
        ) {
            Text("Reset Demo Data", color = DangerRed, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "New to SmartGate? Contact Administrator for access credentials.",
            fontSize = 12.sp,
            color = SecondaryText,
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
    }
}

// 3. UNAUTHORIZED SCREEN
@Composable
fun UnauthorizedScreen(onBackToLogin: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.GppBad,
                contentDescription = "Access Denied",
                tint = DangerRed,
                modifier = Modifier.size(72.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Access Denied",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = PrimaryNavy
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Your account role is not allowed to use this mobile app.",
                fontSize = 14.sp,
                color = SecondaryText,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
            Spacer(modifier = Modifier.height(32.dp))
            PrimaryButton(title = "Return to Login", onClick = {
                AuthService.logout()
                onBackToLogin()
            })
        }
    }
}
