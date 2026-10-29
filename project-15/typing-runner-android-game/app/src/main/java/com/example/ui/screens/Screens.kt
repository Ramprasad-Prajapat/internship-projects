package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.ui.draw.alpha
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.runtime.DisposableEffect
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.EquipmentData
import com.example.data.LevelData
import com.example.data.MistakeData
import com.example.data.ModeData
import com.example.data.UserData
import com.example.ui.TypingViewModel
import com.example.ui.components.AppButton
import com.example.auth.AuthManager
import com.example.ui.components.BadgeCard
import com.example.ui.components.BottomTabBar
import com.example.ui.components.EquipmentCard
import com.example.ui.components.GameHud
import com.example.ui.components.LevelCard
import com.example.ui.components.MistakeCard
import com.example.ui.components.ModeCard
import com.example.ui.components.ProfileCard
import com.example.ui.components.ProgressBar
import com.example.ui.components.RewardCard
import com.example.ui.components.StatCard
import com.example.ui.theme.BorderGray
import com.example.ui.theme.CardSurface
import com.example.ui.theme.ErrorRed
import com.example.ui.theme.GoldCoin
import com.example.ui.theme.LightBackground
import com.example.ui.theme.PerfectGreen
import com.example.ui.theme.PrimaryPurple
import com.example.ui.theme.PrimaryPurpleLight
import com.example.ui.theme.PurpleAccent
import com.example.ui.theme.SecondaryPurple
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import kotlinx.coroutines.delay

// ==========================================
// DATA HOLDERS FOR SPLASH SCREEN
// ==========================================
object imagesData {
    val splashImage: @Composable (pulseAlpha: Float) -> Unit = { pulseAlpha ->
        // High-fidelity horizontal card illustrating the 3D female runner
        Card(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(180.dp)
                .shadow(16.dp, RoundedCornerShape(24.dp)),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.12f)),
            border = BorderStroke(2.dp, Color.White.copy(alpha = 0.25f))
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                // Futuristic Track Background Gradient
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = size.width
                    val h = size.height
                    
                    // Cyberpunk background grid/lines
                    drawRect(
                        brush = Brush.verticalGradient(
                            colors = listOf(Color(0xFF3B0066), Color(0xFF1A0033))
                        )
                    )
                    
                    // Perspective lines (cyber track)
                    val trackY = h * 0.7f
                    drawLine(
                        color = Color(0xFF9D4EDD).copy(alpha = 0.4f),
                        start = Offset(0f, trackY),
                        end = Offset(w, trackY),
                        strokeWidth = 3f
                    )
                    
                    // Speed/wind trails blowing backward
                    for (i in 0..6) {
                        val lineY = h * (0.2f + i * 0.1f)
                        val lineLength = w * (0.1f + (i % 3) * 0.08f)
                        val startX = w * 0.1f + (pulseAlpha * 20f)
                        drawLine(
                            color = Color(0xFF00F5D4).copy(alpha = 0.35f),
                            start = Offset(startX, lineY),
                            end = Offset(startX + lineLength, lineY),
                            strokeWidth = 4f
                        )
                    }
                    
                    // Running path glow
                    drawCircle(
                        color = Color(0xFF00F5D4).copy(alpha = 0.15f * pulseAlpha),
                        radius = h * 0.4f,
                        center = Offset(w * 0.5f, h * 0.5f)
                    )
                }
                
                // Detailed Stylized Vector Illustration of Female Runner
                Canvas(
                    modifier = Modifier
                        .size(120.dp)
                        .align(Alignment.Center)
                ) {
                    val width = size.width
                    val height = size.height

                    // Head of the cartoon female runner
                    drawCircle(
                        color = Color(0xFFFFD166), // skin tone
                        radius = 11f,
                        center = Offset(width * 0.55f, height * 0.25f)
                    )
                    
                    // Athletic ponytail sweeping backward
                    val hairPath = Path().apply {
                        moveTo(width * 0.52f, height * 0.22f)
                        quadraticTo(
                            width * 0.38f, height * 0.18f,
                            width * 0.30f, height * 0.28f
                        )
                        quadraticTo(
                            width * 0.40f, height * 0.30f,
                            width * 0.52f, height * 0.26f
                        )
                    }
                    drawPath(hairPath, color = Color(0xFF3A0CA3))

                    // Athletic violet/purple clothing & torso
                    val torsoPath = Path().apply {
                        moveTo(width * 0.55f, height * 0.32f)
                        lineTo(width * 0.48f, height * 0.52f)
                        lineTo(width * 0.42f, height * 0.50f)
                        close()
                    }
                    drawPath(torsoPath, color = Color(0xFF7209B7))

                    // Dynamic swinging arms
                    // Back arm swinging backward
                    val backArm = Path().apply {
                        moveTo(width * 0.52f, height * 0.34f)
                        lineTo(width * 0.40f, height * 0.32f)
                        lineTo(width * 0.35f, height * 0.44f)
                    }
                    drawPath(backArm, color = Color(0xFF4CC9F0), style = Stroke(width = 8f, cap = StrokeCap.Round))

                    // Front arm reaching forward
                    val frontArm = Path().apply {
                        moveTo(width * 0.54f, height * 0.34f)
                        lineTo(width * 0.64f, height * 0.40f)
                        lineTo(width * 0.72f, height * 0.32f)
                    }
                    drawPath(frontArm, color = Color(0xFF7209B7), style = Stroke(width = 8f, cap = StrokeCap.Round))

                    // Sprinting athletic legs
                    // Front leg bent high forward
                    val frontLeg = Path().apply {
                        moveTo(width * 0.48f, height * 0.52f)
                        lineTo(width * 0.60f, height * 0.62f)
                        lineTo(width * 0.52f, height * 0.78f)
                    }
                    drawPath(frontLeg, color = Color(0xFF7209B7), style = Stroke(width = 9f, cap = StrokeCap.Round))
                    
                    // Front shoe (neon teal!)
                    drawCircle(Color(0xFF00F5D4), 6f, center = Offset(width * 0.52f, height * 0.78f))

                    // Back leg trailing behind
                    val backLeg = Path().apply {
                        moveTo(width * 0.46f, height * 0.51f)
                        lineTo(width * 0.35f, height * 0.60f)
                        lineTo(width * 0.28f, height * 0.56f)
                    }
                    drawPath(backLeg, color = Color(0xFF4CC9F0), style = Stroke(width = 9f, cap = StrokeCap.Round))
                    
                    // Back shoe (neon teal!)
                    drawCircle(Color(0xFF00F5D4), 6f, center = Offset(width * 0.28f, height * 0.56f))
                }
            }
        }
    }
}

object splashData {
    val splashTitle: String = "TYPING RUNNER"
    val splashSubtitle: String = "Run faster by typing better English"
    val loadingText: String = "READY TO SPRINT!"
}

// ==========================================
// 1. SPLASH SCREEN
// ==========================================
@Composable
fun SplashScreen(
    authManager: AuthManager,
    onNavigateNext: () -> Unit,
    modifier: Modifier = Modifier,
    title: String = splashData.splashTitle,
    subtitle: String = splashData.splashSubtitle,
    loadingLabel: String = splashData.loadingText,
    image: @Composable (pulseAlpha: Float) -> Unit = imagesData.splashImage
) {
    var progress by remember { mutableStateOf(0f) }

    LaunchedEffect(Unit) {
        while (progress < 1f) {
            delay(40)
            progress += 0.025f
        }
        progress = 1f
        delay(200)
        onNavigateNext()
    }

    val pulseTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by pulseTransition.animateFloat(
        initialValue = 0.5f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(PrimaryPurple, PurpleAccent)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(28.dp)
        ) {
            Spacer(modifier = Modifier.weight(1.2f))

            // Brand Header
            Text(
                text = title,
                color = Color.White,
                fontSize = 40.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = subtitle,
                color = PrimaryPurpleLight,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(48.dp))

            // Runner vector artwork inside a beautiful card
            image(pulseAlpha)

            Spacer(modifier = Modifier.weight(1.5f))

            // Progress bar and side-by-side labels matching the reference exactly
            ProgressBar(progress = progress, color = Color.White)
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = loadingLabel.uppercase(),
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "${(progress * 100).toInt()}%",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}


// ==========================================
// 2. LOGIN SCREEN
// ==========================================
@Composable
fun LoginScreen(
    authManager: com.example.auth.AuthManager,
    onLoginSuccess: () -> Unit,
    onRegisterClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .verticalScroll(rememberScrollState()),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            // App Brand Header with custom controller icon emoji
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "🎮 TYPING RUNNER",
                    color = PrimaryPurple,
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Login Card Form
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(12.dp, RoundedCornerShape(28.dp)),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(28.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    // Header Row with Floating Overlapping Preview Circle Badge
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Welcome Back",
                                color = TextPrimary,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Continue your Typing Runner journey",
                                color = TextSecondary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                        
                        // Overlapping Preview Circle Badge (micro runner)
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .shadow(8.dp, CircleShape)
                                .background(Color.White, CircleShape)
                                .border(2.dp, PrimaryPurple, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Canvas(modifier = Modifier.size(42.dp)) {
                                drawCircle(Color(0xFFE5D5FF), radius = size.minDimension / 2f)
                                drawLine(
                                    color = PrimaryPurple,
                                    start = Offset(size.width * 0.15f, size.height * 0.75f),
                                    end = Offset(size.width * 0.85f, size.height * 0.25f),
                                    strokeWidth = 4f
                                )
                                drawCircle(Color(0xFF00F5D4), radius = 6f, center = Offset(size.width * 0.55f, size.height * 0.5f))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(28.dp))

                    // Email Address Input
                    Text(
                        text = "EMAIL ADDRESS",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        placeholder = { Text("runner@example.com") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Email,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("email_input"),
                        shape = RoundedCornerShape(14.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Password Input
                    Text(
                        text = "PASSWORD",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        placeholder = { Text("••••••••") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("password_input"),
                        shape = RoundedCornerShape(14.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Forgot Password link (Right Aligned)
                    Text(
                        text = "Forgot Password?",
                        color = PrimaryPurple,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.End,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { }
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    if (errorMessage.isNotEmpty()) {
                        Text(
                            text = errorMessage,
                            color = ErrorRed,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                    }

                    // Main Login Button
                    AppButton(
                        text = "Login ⚡",
                        onClick = {
                            if (authManager.login(email, password)) {
                                onLoginSuccess()
                            } else {
                                errorMessage = "Invalid credentials"
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        tag = "submit_login"
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // OR DEMO Divider Section
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(modifier = Modifier.weight(1f).height(1.dp).background(BorderGray))
                        Text(
                            text = "OR DEMO",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 12.dp),
                            letterSpacing = 1.sp
                        )
                        Box(modifier = Modifier.weight(1f).height(1.dp).background(BorderGray))
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Student Demo Login quick log with Demo Credentials exactly matching the layout
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp)
                            .shadow(4.dp, RoundedCornerShape(27.dp))
                            .clickable {
                                authManager.login("demo@typingrunner.com", "demo123")
                                onLoginSuccess()
                            },
                        shape = RoundedCornerShape(27.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF9D4EDD))
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = "Student Demo Login",
                                color = Color.White,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "DEMO@TYPINGRUNNER.COM / DEMO123",
                                color = Color.White.copy(alpha = 0.85f),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Footer Register Links
            Row {
                Text(
                    text = "Don't have an account? ",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
                Text(
                    text = "Register",
                    color = PrimaryPurple,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onRegisterClicked() }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun RegisterScreen(
    authManager: AuthManager,
    onRegisterSuccess: () -> Unit,
    onNavigateLogin: () -> Unit,
    modifier: Modifier = Modifier
) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .verticalScroll(rememberScrollState()),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(32.dp))
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "📝 TYPING RUNNER",
                    color = PrimaryPurple,
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
            Spacer(modifier = Modifier.height(36.dp))
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(12.dp, RoundedCornerShape(28.dp)),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(28.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Create Account",
                                color = TextPrimary,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Join the Typing Runner community",
                                color = TextSecondary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(28.dp))
                    // Full Name
                    Text(
                        text = "FULL NAME",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = fullName,
                        onValueChange = { fullName = it },
                        placeholder = { Text("Your Name") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("fullname_input"),
                        shape = RoundedCornerShape(14.dp)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    // Email
                    Text(
                        text = "EMAIL ADDRESS",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        placeholder = { Text("runner@example.com") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Email,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("email_input"),
                        shape = RoundedCornerShape(14.dp)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    // Password
                    Text(
                        text = "PASSWORD",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        placeholder = { Text("••••••••") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("password_input"),
                        shape = RoundedCornerShape(14.dp)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    // Confirm Password
                    Text(
                        text = "CONFIRM PASSWORD",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        placeholder = { Text("••••••••") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                tint = TextSecondary.copy(alpha = 0.5f)
                            )
                        },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryPurple,
                            unfocusedBorderColor = BorderGray,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("confirm_password_input"),
                        shape = RoundedCornerShape(14.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    if (errorMessage.isNotEmpty()) {
                        Text(
                            text = errorMessage,
                            color = ErrorRed,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                    }
                    // Register Button
                    AppButton(
                        text = "Register 🚀",
                        onClick = {
                            if (fullName.isBlank() || email.isBlank() || password.isBlank()) {
                                errorMessage = "All fields are required"
                            } else if (password != confirmPassword) {
                                errorMessage = "Passwords do not match"
                            } else {
                                if (authManager.register(fullName, email, password)) {
                                    onRegisterSuccess()
                                } else {
                                    errorMessage = "Email already exists"
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        tag = "submit_register"
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Already have an account? ",
                            color = TextSecondary,
                            fontSize = 13.sp
                        )
                        Text(
                            text = "Login",
                            color = PrimaryPurple,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.clickable { onNavigateLogin() }
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(36.dp))
        }
    }
}


// ==========================================
// 3. HOME SCREEN
// ==========================================
@Composable
fun HomeScreen(
    viewModel: TypingViewModel,
    onStartGameClick: () -> Unit,
    onViewProgressClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val stats by viewModel.userStats.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // Profile Header Section matching reference exactly
        stats?.let { user ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .shadow(4.dp, CircleShape)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(PrimaryPurple, PurpleAccent)
                                ),
                                CircleShape
                            )
                            .border(2.dp, Color.White, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Canvas(modifier = Modifier.size(36.dp)) {
                            drawCircle(Color.White.copy(alpha = 0.25f), radius = size.minDimension / 2f)
                            drawCircle(Color(0xFFFFD166), radius = 6f, center = Offset(size.width * 0.5f, size.height * 0.4f))
                            drawLine(
                                color = Color.White,
                                start = Offset(size.width * 0.3f, size.height * 0.72f),
                                end = Offset(size.width * 0.7f, size.height * 0.72f),
                                strokeWidth = 3f,
                                cap = StrokeCap.Round
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Hello, Runner!",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = user.username,
                            color = TextPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }

                // Game controller & settings cog icons on the right
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "🎮",
                        fontSize = 18.sp,
                        modifier = Modifier
                            .clickable { onStartGameClick() }
                            .padding(4.dp)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(
                        text = "⚙️",
                        fontSize = 18.sp,
                        modifier = Modifier
                            .clickable { }
                            .padding(4.dp)
                    )
                }
            }
        }

        // Floating Coin Badge Card Aligned to Top-Right
        stats?.let { user ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 24.dp, end = 24.dp, bottom = 12.dp),
                horizontalArrangement = Arrangement.End
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .border(1.dp, BorderGray, RoundedCornerShape(16.dp))
                        .shadow(2.dp, RoundedCornerShape(16.dp))
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(text = "🪙", fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "%,d".format(user.coins),
                        color = GoldCoin,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }

        // Velocity Sprint Banner card matching reference
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp)
                .padding(horizontal = 24.dp)
                .shadow(8.dp, RoundedCornerShape(20.dp)),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = size.width
                    val h = size.height
                    // Light clean sports game track styling
                    drawRect(
                        brush = Brush.linearGradient(
                            colors = listOf(Color(0xFFE2F1FF), Color(0xFFEDF2FE))
                        )
                    )
                    // Speed track pathways
                    val path = Path().apply {
                        moveTo(0f, h * 0.75f)
                        cubicTo(w * 0.35f, h * 0.45f, w * 0.65f, h * 0.9f, w, h * 0.6f)
                    }
                    drawPath(path, color = Color(0xFFD6E4FF), style = Stroke(width = 18f))
                    drawPath(path, color = Color.White, style = Stroke(width = 4f, pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(12f, 12f), 0f)))
                    
                    // Sprinter marker
                    drawCircle(Color(0xFF7209B7), radius = 10f, center = Offset(w * 0.58f, h * 0.61f))
                    drawLine(Color(0xFF7209B7), start = Offset(w * 0.58f, h * 0.61f), end = Offset(w * 0.54f, h * 0.76f), strokeWidth = 5f, cap = StrokeCap.Round)
                    drawLine(Color(0xFF00F5D4), start = Offset(w * 0.58f, h * 0.63f), end = Offset(w * 0.62f, h * 0.52f), strokeWidth = 4f, cap = StrokeCap.Round)
                }
                
                // Speed overlays drawn on card
                Text(
                    text = "Velocity Sprint",
                    color = Color(0xFF1E1B4B),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 10.dp)
                )
                
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .padding(start = 16.dp, end = 16.dp, bottom = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🏁 ACTIVE",
                        color = PrimaryPurple,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "WPM: 45 | ACC: 92%",
                        color = TextSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // START GAME Hero Card Banner
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 16.dp)
                .shadow(16.dp, RoundedCornerShape(24.dp))
                .clickable { onStartGameClick() },
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = PrimaryPurple)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.linearGradient(
                            colors = listOf(PrimaryPurple, PurpleAccent)
                        )
                    )
                    .padding(vertical = 24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "START GAME",
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 2.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "JUMP INTO THE RACE",
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }
        }

        // Stats Card Grid
        stats?.let { user ->
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
            ) {
                Text(
                    text = "YOUR STATISTICS",
                    color = TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.5.sp
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(modifier = Modifier.fillMaxWidth()) {
                    StatCard(
                        title = "Best WPM",
                        value = user.bestWpm.toString(),
                        icon = Icons.Default.Speed,
                        iconColor = PrimaryPurple,
                        modifier = Modifier.weight(1f),
                        tag = "best_wpm_card"
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    StatCard(
                        title = "Accuracy",
                        value = "${user.accuracy.toInt()}%",
                        icon = Icons.Default.CheckCircle,
                        iconColor = PerfectGreen,
                        modifier = Modifier.weight(1f),
                        tag = "accuracy_card"
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(modifier = Modifier.fillMaxWidth()) {
                    StatCard(
                        title = "Daily Streak",
                        value = "${user.streak} Days",
                        icon = Icons.Default.LocalFireDepartment,
                        iconColor = ErrorRed,
                        modifier = Modifier.weight(1f),
                        tag = "streak_card"
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    StatCard(
                        title = "Rank",
                        value = user.rank,
                        icon = Icons.Default.Star,
                        iconColor = GoldCoin,
                        modifier = Modifier.weight(1f),
                        tag = "rank_card"
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Game Modes brief select
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
        ) {
            Text(
                text = "GAME MODES",
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(12.dp))

            // Mode items with chevrons
            val previewModes = listOf(
                "Practice Mode" to "Sharpen your speed",
                "Grammar Mode" to "Focus on accuracy"
            )

            previewModes.forEach { (title, subtitle) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                        .clickable { onStartGameClick() },
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = title,
                                color = TextPrimary,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = subtitle,
                                color = TextSecondary,
                                fontSize = 12.sp
                            )
                        }
                        Icon(
                            imageVector = Icons.Default.ChevronRight,
                            contentDescription = "Go",
                            tint = PrimaryPurple
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // View full progress
            AppButton(
                text = "View Full Progress",
                onClick = onViewProgressClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .border(1.5.dp, PrimaryPurple, RoundedCornerShape(24.dp)),
                tag = "home_view_progress"
            )

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}


// ==========================================
// 4. GAME SELECT MODE SCREEN
// ==========================================
@Composable
fun SelectModeScreen(
    viewModel: TypingViewModel,
    onModeSelected: (ModeData) -> Unit,
    modifier: Modifier = Modifier
) {
    val modesList by viewModel.modes.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Consistent, highly polished Header Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Game Modes",
                    color = PrimaryPurple,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Choose a typing mode to start sprinting",
                    color = TextSecondary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // Top right icons (gamepad & settings gear)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "🎮",
                    fontSize = 18.sp,
                    modifier = Modifier.padding(4.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Text(
                    text = "⚙️",
                    fontSize = 18.sp,
                    modifier = Modifier.padding(4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(modesList) { mode ->
                ModeCard(
                    mode = mode,
                    onStartClick = {
                        viewModel.selectMode(mode)
                        onModeSelected(mode)
                    }
                )
            }
            item {
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }
}


// ==========================================
// 5. GAMEPLAY SCREEN (TYPING ARENA WITH REAL RUNNER CANVAS!)
// ==========================================
@Composable
fun GameplayScreen(
    viewModel: TypingViewModel,
    onGameplayFinished: () -> Unit,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val targetText by viewModel.targetText.collectAsState()
    val typedInput by viewModel.typedInput.collectAsState()
    val elapsedSeconds by viewModel.elapsedSeconds.collectAsState()
    val remainingSeconds by viewModel.timeRemainingSeconds.collectAsState()
    val liveWpm by viewModel.liveWpm.collectAsState()
    val liveAccuracy by viewModel.liveAccuracy.collectAsState()
    val health by viewModel.health.collectAsState()
    val coinsCollected by viewModel.coinsCollected.collectAsState()
    val gameActive by viewModel.gameActive.collectAsState()
    val paused by viewModel.paused.collectAsState()
    val selectedMode by viewModel.selectedMode.collectAsState()
    val activeChallenge by viewModel.activeChallenge.collectAsState()

    val focusRequester = remember { FocusRequester() }
    val lifecycleOwner = LocalLifecycleOwner.current

    // Auto-pause when app leaves foreground
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE) {
                viewModel.pauseGameplay()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    // Stop gameplay session when screen is exited (back pressed or complete)
    DisposableEffect(Unit) {
        onDispose {
            viewModel.stopGameplaySession()
        }
    }

    // Trigger keyboard auto-focus on load
    LaunchedEffect(gameActive, paused) {
        if (gameActive && !paused) {
            delay(100)
            focusRequester.requestFocus()
        }
    }

    // Safe error/empty check
    if (gameActive && activeChallenge == null) {
        LaunchedEffect(Unit) {
            onBackClick()
        }
        return
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(LightBackground)
                .verticalScroll(rememberScrollState())
        ) {
            // 1. Header Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("🎮", fontSize = 24.sp, modifier = Modifier.padding(end = 8.dp))
                    Text(
                        text = "TYPING RUNNER",
                        color = PrimaryPurple,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                }
                
                IconButton(
                    onClick = {},
                    modifier = Modifier
                        .size(40.dp)
                        .background(PrimaryPurpleLight, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = PrimaryPurple,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            // 2. Top HUD Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val timerFormatted = "%02d:%02d".format(remainingSeconds / 60, remainingSeconds % 60)
                HudCard(label = "TIME", value = timerFormatted, modifier = Modifier.weight(1f))
                HudCard(label = "WPM", value = liveWpm.toString(), modifier = Modifier.weight(1f))
                HudCard(label = "ACC.", value = "${liveAccuracy.toInt()}%", modifier = Modifier.weight(1f))
                HudCard(label = "COINS", value = "🪙 $coinsCollected", modifier = Modifier.weight(1f))
            }

            // 3. Green HP / Progress Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(10.dp)
                        .clip(RoundedCornerShape(5.dp))
                        .background(BorderGray)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(if (health > 0) (health.toFloat() / 3f) else 0f) // Max health is 3 in Phase 3
                            .clip(RoundedCornerShape(5.dp))
                            .background(PerfectGreen)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "HP ${health * 33}/100",
                    color = PerfectGreen,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            // 4. Interactive Track Canvas Area
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(170.dp)
                    .padding(horizontal = 20.dp, vertical = 4.dp)
                    .shadow(4.dp, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E2E))
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val w = size.width
                        val h = size.height
                        
                        drawLine(
                            color = PrimaryPurple.copy(alpha = 0.4f),
                            start = Offset(w * 0.15f, h * 0.5f),
                            end = Offset(w * 0.85f, h * 0.5f),
                            strokeWidth = 3f
                        )
                        
                        for (i in 0..6) {
                            val x = (w * 0.15f) + (i * w * 0.7f / 6f)
                            drawLine(
                                color = SecondaryPurple.copy(alpha = 0.3f),
                                start = Offset(x, h * 0.5f),
                                end = Offset(x + (i - 3) * 15f, h),
                                strokeWidth = 2f
                            )
                        }
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(68.dp)
                                .border(
                                    BorderStroke(1.5.dp, Color.White.copy(alpha = 0.3f)),
                                    RoundedCornerShape(12.dp)
                                )
                                .background(Color.White.copy(alpha = 0.05f))
                                .padding(8.dp)
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "GRAMMAR GATE",
                                    color = Color.White.copy(alpha = 0.8f),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .background(PrimaryPurple, RoundedCornerShape(8.dp))
                                            .padding(horizontal = 16.dp, vertical = 4.dp)
                                    ) {
                                        Text("ITS", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Black)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .background(SecondaryPurple, RoundedCornerShape(8.dp))
                                            .padding(horizontal = 16.dp, vertical = 4.dp)
                                    ) {
                                        Text("IT'S", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Black)
                                    }
                                }
                            }
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(50.dp, 35.dp)
                                    .background(
                                        Brush.linearGradient(listOf(PrimaryPurple, SecondaryPurple)),
                                        RoundedCornerShape(8.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("🏃⚡", fontSize = 16.sp)
                            }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.15f)),
                                shape = RoundedCornerShape(8.dp),
                                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.25f)),
                                modifier = Modifier.size(45.dp, 35.dp)
                            ) {
                                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                    Text("👆", fontSize = 16.sp)
                                }
                            }
                        }
                    }
                }
            }

            // 5. High-fidelity Typist Arena Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
                    .shadow(4.dp, RoundedCornerShape(24.dp)),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    val annotatedString = buildAnnotatedString {
                        val modeId = selectedMode?.id ?: ""
                        val challenge = activeChallenge
                        if (challenge != null) {
                            if (modeId == "grammar_challenge" || modeId == "hindi_to_english") {
                                withStyle(SpanStyle(color = TextSecondary, fontSize = 13.sp, fontWeight = FontWeight.Bold)) {
                                    append(if (modeId == "grammar_challenge") "CORRECT THIS SENTENCE:\n" else "TRANSLATE INTO ENGLISH:\n")
                                }
                                withStyle(SpanStyle(color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Black)) {
                                    append(challenge.promptText)
                                }
                                append("\n\n")
                                withStyle(SpanStyle(color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)) {
                                    append("YOUR TRANSLATION:\n")
                                }
                                if (typedInput.isEmpty()) {
                                    withStyle(SpanStyle(color = TextSecondary.copy(alpha = 0.4f), fontStyle = FontStyle.Italic)) {
                                        append("(Start typing below...)")
                                    }
                                } else {
                                    for (i in typedInput.indices) {
                                        val typedChar = typedInput[i]
                                        val expectedChar = challenge.expectedText.getOrNull(i)
                                        if (typedChar == expectedChar) {
                                            withStyle(SpanStyle(color = PerfectGreen, fontWeight = FontWeight.Bold)) {
                                                append(typedChar)
                                            }
                                        } else {
                                            withStyle(SpanStyle(color = ErrorRed, fontWeight = FontWeight.Black, background = ErrorRed.copy(alpha = 0.15f))) {
                                                append(typedChar)
                                            }
                                        }
                                    }
                                }
                            } else {
                                val typedLen = typedInput.length
                                val target = challenge.expectedText
                                for (i in target.indices) {
                                    val expectedChar = target[i]
                                    val typedChar = typedInput.getOrNull(i)
                                    when {
                                        typedChar == null -> {
                                            if (i == typedLen) {
                                                withStyle(SpanStyle(color = TextPrimary, fontWeight = FontWeight.Black, background = Color(0xFFFFEB3B))) {
                                                    append(expectedChar)
                                                }
                                            } else {
                                                withStyle(SpanStyle(color = TextSecondary.copy(alpha = 0.5f))) {
                                                    append(expectedChar)
                                                }
                                            }
                                        }
                                        typedChar == expectedChar -> {
                                            withStyle(SpanStyle(color = PerfectGreen, fontWeight = FontWeight.Bold)) {
                                                append(expectedChar)
                                            }
                                        }
                                        else -> {
                                            withStyle(SpanStyle(color = ErrorRed, fontWeight = FontWeight.Black, background = ErrorRed.copy(alpha = 0.15f))) {
                                                append(expectedChar)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(LightBackground, RoundedCornerShape(16.dp))
                            .padding(16.dp)
                    ) {
                        Text(
                            text = annotatedString,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            lineHeight = 22.sp,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    // Input box
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.5.dp, PrimaryPurple.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                            .background(Color.White, RoundedCornerShape(16.dp))
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(modifier = Modifier.weight(1f)) {
                            if (typedInput.isEmpty()) {
                                Text(
                                    text = "Type here...",
                                    color = TextSecondary.copy(alpha = 0.5f),
                                    fontSize = 14.sp
                                )
                            }
                            BasicTextField(
                                value = typedInput,
                                onValueChange = { viewModel.onTypedInputChanged(it) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .focusRequester(focusRequester)
                                    .testTag("type_text_field"),
                                textStyle = TextStyle(
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Medium
                                ),
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Text,
                                    autoCorrectEnabled = false,
                                    imeAction = ImeAction.Done
                                ),
                                keyboardActions = KeyboardActions(
                                    onDone = {
                                        viewModel.submitCurrentAnswer()
                                    }
                                ),
                                readOnly = paused || !gameActive
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF2F80ED))
                                .clickable {
                                    viewModel.submitCurrentAnswer()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text("↩", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(PrimaryPurpleLight)
                                    .clickable {},
                                contentAlignment = Alignment.Center
                            ) {
                                Text("⚡", fontSize = 16.sp)
                            }

                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(PrimaryPurpleLight)
                                    .clickable {},
                                contentAlignment = Alignment.Center
                            ) {
                                Text("🛡️", fontSize = 16.sp)
                            }
                        }

                        Text(
                            text = "SAFE ZONE FOR KEYBOARD",
                            color = TextSecondary.copy(alpha = 0.4f),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )

                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color(0xFFD35400))
                                .clickable {
                                    viewModel.togglePauseState()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(if (paused) "▶" else "⏸", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    if (!gameActive) {
                        AppButton(
                            text = "SEE RESULTS 🏆",
                            onClick = onGameplayFinished,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(44.dp),
                            tag = "see_results_button"
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }

        // Pause Overlay
        if (paused) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.7f))
                    .clickable { viewModel.togglePauseState() },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("GAME PAUSED", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Tap anywhere to Resume", color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun HudCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier
            .shadow(2.dp, RoundedCornerShape(12.dp)),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardSurface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = label,
                color = TextSecondary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                color = if (label == "WPM") PrimaryPurple else TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black
            )
        }
    }
}


// ==========================================
// 6. LEVEL SELECTION SCREEN
// ==========================================
@Composable
fun LevelSelectionScreen(
    viewModel: TypingViewModel,
    onLevelSelected: (LevelData) -> Unit,
    modifier: Modifier = Modifier
) {
    val selectedMode by viewModel.selectedMode.collectAsState()
    val levelsList by viewModel.levelsList.collectAsState()
    val userStats by viewModel.userStats.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
    ) {
        // 1. Header Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🎮", fontSize = 24.sp, modifier = Modifier.padding(end = 8.dp))
                Text(
                    text = "TYPING RUNNER",
                    color = PrimaryPurple,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
            
            IconButton(
                onClick = {},
                modifier = Modifier
                    .size(40.dp)
                    .background(PrimaryPurpleLight, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = PrimaryPurple,
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // 2. Mode Title & XP Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = selectedMode?.name ?: "Word Run",
                        color = Color(0xFF3B82F6),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .background(Color(0xFFFEF3C7), RoundedCornerShape(12.dp))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text("⭐", fontSize = 12.sp, color = Color(0xFFD97706))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "XP: ${userStats?.xp ?: 2450}",
                            color = Color(0xFFD97706),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 3. Summary Cards Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .shadow(2.dp, RoundedCornerShape(16.dp)),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = CardSurface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("HIGHEST WPM", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("${userStats?.bestWpm ?: 42} wpm", color = Color(0xFF3B82F6), fontSize = 16.sp, fontWeight = FontWeight.Black)
                        }
                    }

                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .shadow(2.dp, RoundedCornerShape(16.dp)),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = CardSurface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("TOTAL WORDS", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("1,284", color = PrimaryPurple, fontSize = 16.sp, fontWeight = FontWeight.Black)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            // 4. Vertical Level Timeline Items
            itemsIndexed(levelsList) { index, lvl ->
                Row(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.width(40.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .width(2.dp)
                                .height(16.dp)
                                .background(if (index > 0) Color(0xFFCBD5E1) else Color.Transparent)
                        )

                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(
                                    when {
                                        !lvl.unlocked -> Color(0xFFE2E8F0)
                                        lvl.completed -> Color(0xFF5D5FEF)
                                        else -> PrimaryPurple
                                    },
                                    CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (lvl.unlocked) {
                                Text(
                                    text = (index + 1).toString(),
                                    color = Color.White,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            } else {
                                Icon(
                                    imageVector = Icons.Default.Lock,
                                    contentDescription = "Locked",
                                    tint = TextSecondary,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .width(2.dp)
                                .weight(1f)
                                .background(if (index < levelsList.size - 1) Color(0xFFCBD5E1) else Color.Transparent)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(bottom = 16.dp)
                    ) {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .shadow(if (lvl.unlocked) 3.dp else 1.dp, RoundedCornerShape(16.dp))
                                .alpha(if (lvl.unlocked) 1f else 0.6f),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = CardSurface)
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
                                    Text(
                                        text = lvl.name,
                                        color = TextPrimary,
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.ExtraBold
                                    )

                                    if (lvl.completed) {
                                        Box(
                                            modifier = Modifier
                                                .background(Color(0xFFEFF6FF), RoundedCornerShape(8.dp))
                                                .padding(horizontal = 8.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "COMPLETED",
                                                color = Color(0xFF1D4ED8),
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFFEEF2FF), RoundedCornerShape(6.dp))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = lvl.difficultyLabel.uppercase(),
                                            color = Color(0xFF4F46E5),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }

                                    val reqWpm = if (index == 0) 25 else if (index == 1) 30 else if (index == 2) 45 else if (index == 3) 60 else 80
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFFFFF7ED), RoundedCornerShape(6.dp))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = "REQUIRED: $reqWpm WPM",
                                            color = Color(0xFFEA580C),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                if (lvl.unlocked) {
                                    if (lvl.completed) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text("WORDS", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                                Text("25", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                            }
                                            Column {
                                                Text("TIME", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                                Text("90s", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                            }
                                            Column {
                                                Text("ACC.", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                                Text("90%", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(12.dp))

                                        AppButton(
                                            text = "REPLAY RUN ▶",
                                            onClick = {
                                                viewModel.selectLevel(lvl)
                                                viewModel.startGameplaySession(lvl.targetText)
                                                onLevelSelected(lvl)
                                            },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(38.dp),
                                            tag = "play_level_${lvl.id}"
                                        )
                                    } else {
                                        Text(
                                            text = "Focus on short sentences with basic punctuation. Watch your breath!",
                                            color = TextSecondary,
                                            fontSize = 12.sp,
                                            lineHeight = 16.sp
                                        )

                                        Spacer(modifier = Modifier.height(12.dp))

                                        AppButton(
                                            text = "START LEVEL 🚀",
                                            onClick = {
                                                viewModel.selectLevel(lvl)
                                                viewModel.startGameplaySession(lvl.targetText)
                                                onLevelSelected(lvl)
                                            },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(38.dp),
                                            tag = "play_level_${lvl.id}"
                                        )
                                    }
                                } else {
                                    val lockedDesc = if (index == 2) "LOCKED: COMPLETE LEVEL 2" else "LOCKED"
                                    Text(
                                        text = lockedDesc,
                                        color = TextSecondary.copy(alpha = 0.7f),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
}


// ==========================================
// 7. PROFILE & SETTINGS SCREEN
// ==========================================
@Composable
fun ProfileSettingsScreen(
    viewModel: TypingViewModel,
    onLogoutClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val stats by viewModel.userStats.collectAsState()

    var soundEffectsEnabled by remember { mutableStateOf(true) }
    var hapticFeedbackEnabled by remember { mutableStateOf(true) }
    var isDarkTheme by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
    ) {
        // 1. Header Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🎮", fontSize = 24.sp, modifier = Modifier.padding(end = 8.dp))
                Text(
                    text = "TYPING RUNNER",
                    color = PrimaryPurple,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
            
            IconButton(
                onClick = {},
                modifier = Modifier
                    .size(40.dp)
                    .background(PrimaryPurpleLight, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = PrimaryPurple,
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // 2. Avatar with Blue edit overlay
            Box(
                contentAlignment = Alignment.BottomEnd,
                modifier = Modifier.size(90.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.sweepGradient(listOf(Color(0xFF8B5CF6), Color(0xFFEC4899), Color(0xFF3B82F6))),
                            CircleShape
                        )
                        .padding(3.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color(0xFFDBEAFE), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🧑‍🚀", fontSize = 42.sp)
                    }
                }

                Box(
                    modifier = Modifier
                        .size(26.dp)
                        .background(Color(0xFF2563EB), CircleShape)
                        .border(2.dp, Color.White, CircleShape)
                        .clickable {},
                    contentAlignment = Alignment.Center
                ) {
                    Text("✏️", fontSize = 11.sp, color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = stats?.username ?: "SpeedyTypist24",
                color = PrimaryPurple,
                fontSize = 24.sp,
                fontWeight = FontWeight.Black
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = stats?.email ?: "speedy.runner@gmail.com",
                color = TextSecondary,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(24.dp))

            // 3. Total Coins card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(2.dp, RoundedCornerShape(16.dp))
                    .clickable {},
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFFEF3C7), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("🪙", fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "TOTAL COINS",
                                color = TextSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                            Text(
                                text = "%,d".format(stats?.coins ?: 12450),
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }

                    Text("〉", color = TextSecondary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 4. Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .shadow(2.dp, RoundedCornerShape(16.dp)),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFEFF6FF), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("⏱️", fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "BEST WPM",
                                color = TextSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = (stats?.bestWpm ?: 108).toString(),
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }

                Card(
                    modifier = Modifier
                        .weight(1f)
                        .shadow(2.dp, RoundedCornerShape(16.dp)),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFFDF2F8), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("🎯", fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "BEST ACC",
                                color = TextSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${(stats?.accuracy ?: 98.0).toInt()}%",
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 5. Preferences Heading & Panel
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Start
            ) {
                Text(
                    text = "Preferences",
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(2.dp, RoundedCornerShape(16.dp)),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🔊", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Sound Effects", color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Switch(
                            checked = soundEffectsEnabled,
                            onCheckedChange = { soundEffectsEnabled = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = PrimaryPurple
                            )
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("📳", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Haptic Feedback", color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Switch(
                            checked = hapticFeedbackEnabled,
                            onCheckedChange = { hapticFeedbackEnabled = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = PrimaryPurple
                            )
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🎨", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Theme", color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                        }
                        
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .background(BorderGray, RoundedCornerShape(10.dp))
                                .padding(4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (!isDarkTheme) Color.White else Color.Transparent)
                                    .clickable { isDarkTheme = false }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("☀️", fontSize = 12.sp)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isDarkTheme) Color.White else Color.Transparent)
                                    .clickable { isDarkTheme = true }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("🌙", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            AppButton(
                text = "Reset Demo Data",
                onClick = { viewModel.resetDemoData() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp),
                tag = "reset_demo_data"
            )

            Spacer(modifier = Modifier.height(10.dp))

            AppButton(
                text = "Logout",
                onClick = onLogoutClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
                    .border(1.dp, Color(0xFFEF4444), RoundedCornerShape(12.dp)),
                tag = "profile_logout"
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Typing Runner v2.4.0",
                color = TextSecondary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}


// ==========================================
// 8. LEVEL COMPLETE CELEBRATION SCREEN
// ==========================================
@Composable
fun LevelCompleteScreen(
    viewModel: TypingViewModel,
    onNextLevelClick: () -> Unit,
    onReplayClick: () -> Unit,
    onReviewErrorsClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val liveWpm by viewModel.liveWpm.collectAsState()
    val liveAccuracy by viewModel.liveAccuracy.collectAsState()
    val health by viewModel.health.collectAsState()
    val coinsCollected by viewModel.coinsCollected.collectAsState()
    val gameOutcome by viewModel.gameOutcome.collectAsState()

    val isSuccess = gameOutcome == com.example.data.GameOutcome.COMPLETED
    val starsCount = if (isSuccess) {
        if (liveAccuracy >= 95.0 && health == 3) 3 else if (liveAccuracy >= 85.0) 2 else 1
    } else {
        0
    }

    val totalScore = if (isSuccess) {
        (liveWpm * 100) + (liveAccuracy * 120).toInt() + (health * 500)
    } else {
        0
    }

    val titleText = when (gameOutcome) {
        com.example.data.GameOutcome.COMPLETED -> "LEVEL COMPLETE!"
        com.example.data.GameOutcome.HEALTH_DEPLETED -> "DEFEAT: HEALTH DEPLETED 💀"
        com.example.data.GameOutcome.TIME_EXPIRED -> "DEFEAT: TIME EXPIRED ⏱️"
        else -> "GAME OVER"
    }

    val trophyEmoji = when (gameOutcome) {
        com.example.data.GameOutcome.COMPLETED -> "🏆"
        com.example.data.GameOutcome.HEALTH_DEPLETED -> "💀"
        com.example.data.GameOutcome.TIME_EXPIRED -> "⏱️"
        else -> "🏁"
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .padding(horizontal = 24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        // Celebration Trophy / Outcome Icon
        Box(
            modifier = Modifier
                .size(100.dp)
                .background(GoldCoin.copy(alpha = 0.15f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(trophyEmoji, fontSize = 54.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = titleText,
            color = if (isSuccess) PrimaryPurple else ErrorRed,
            fontSize = 28.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 1.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Celebratory Stars
        Row {
            repeat(3) { index ->
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = if (index < starsCount) GoldCoin else BorderGray,
                    modifier = Modifier.size(44.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Total Score Badge Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(6.dp, RoundedCornerShape(24.dp)),
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "TOTAL SCORE",
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "%,d".format(totalScore),
                    color = if (isSuccess) PrimaryPurple else TextSecondary,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Black
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("SPEED", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("$liveWpm WPM", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Black)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("ACCURACY", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("${liveAccuracy.toInt()}%", color = PerfectGreen, fontSize = 16.sp, fontWeight = FontWeight.Black)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("HEALTH", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("$health / 3", color = ErrorRed, fontSize = 16.sp, fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Rewards Gained indicators
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Card(
                modifier = Modifier
                    .weight(1f)
                    .shadow(3.dp, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("COINS REWARD", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(if (isSuccess) "🪙 +$coinsCollected" else "🪙 +0", color = GoldCoin, fontSize = 18.sp, fontWeight = FontWeight.Black)
                }
            }

            Card(
                modifier = Modifier
                    .weight(1f)
                    .shadow(3.dp, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("XP GROWTH", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(if (isSuccess) "⚡ +120 XP" else "⚡ +0 XP", color = PrimaryPurple, fontSize = 18.sp, fontWeight = FontWeight.Black)
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Direct Action Buttons
        if (isSuccess) {
            AppButton(
                text = "NEXT LEVEL ▶",
                onClick = onNextLevelClick,
                modifier = Modifier.fillMaxWidth(),
                tag = "complete_next_level"
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        Row(modifier = Modifier.fillMaxWidth()) {
            AppButton(
                text = "REPLAY",
                onClick = onReplayClick,
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .border(1.5.dp, PrimaryPurple, RoundedCornerShape(24.dp)),
                tag = "complete_replay"
            )
            Spacer(modifier = Modifier.width(16.dp))
            AppButton(
                text = "ERRORS",
                onClick = onReviewErrorsClick,
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .border(1.5.dp, BorderGray, RoundedCornerShape(24.dp)),
                tag = "complete_errors"
            )
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}


// ==========================================
// 9. MISTAKE REVIEW SCREEN
// ==========================================
@Composable
fun MistakeReviewScreen(
    viewModel: TypingViewModel,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val mistakesList by viewModel.mistakes.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .padding(horizontal = 24.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "⚡ REVIEW MISTAKES",
            color = PrimaryPurple,
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 1.sp
        )
        Text(
            text = "Refine your speed by fixing these trip-ups.",
            color = TextSecondary,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Stats summary banner
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(3.dp, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("TOTAL RECORDED", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text("${mistakesList.size} Words", color = ErrorRed, fontSize = 16.sp, fontWeight = FontWeight.Black)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("FOCUS SKILL", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text("Spelling", color = PrimaryPurple, fontSize = 16.sp, fontWeight = FontWeight.Black)
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        if (mistakesList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("✨", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No recorded mistakes! Clean runs!",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(mistakesList) { mistake ->
                    MistakeCard(
                        mistake = mistake,
                        onClearClick = { viewModel.clearMistake(mistake.id) }
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(10.dp))
                    AppButton(
                        text = "Export to Mistake Book",
                        onClick = { viewModel.clearAllMistakes() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .border(1.5.dp, PrimaryPurple, RoundedCornerShape(24.dp)),
                        tag = "clear_all_mistakes"
                    )
                    Spacer(modifier = Modifier.height(100.dp))
                }
            }
        }
    }
}


// ==========================================
// 10. REWARDS & ACHIEVEMENTS SCREEN (SHOP INCLUDED!)
// ==========================================
@Composable
fun RewardsAchievementsScreen(
    viewModel: TypingViewModel,
    modifier: Modifier = Modifier
) {
    val stats by viewModel.userStats.collectAsState()
    val badgesList by viewModel.badges.collectAsState()
    val equipmentList by viewModel.equipment.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(LightBackground)
            .padding(horizontal = 24.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "⚡ REWARDS",
                    color = PrimaryPurple,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Customize and earn badges",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }

            // Coin counter
            stats?.let { user ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .border(1.dp, BorderGray, RoundedCornerShape(16.dp))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(text = "🪙", fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "%,d".format(user.coins),
                        color = GoldCoin,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Badge Achievements section
        Text(
            text = "ACHIEVEMENTS",
            color = TextPrimary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 0.5.sp
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Grid-like layout for achievements badges
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            // Split list of badges into pairs
            badgesList.chunked(2).forEach { pair ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    pair.forEach { b ->
                        BadgeCard(badge = b, modifier = Modifier.weight(1f))
                    }
                    if (pair.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Custom Equipment Shop Section
        Text(
            text = "RUNNER EQUIPMENT",
            color = TextPrimary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 0.5.sp
        )
        Spacer(modifier = Modifier.height(12.dp))

        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            equipmentList.forEach { equip ->
                EquipmentCard(
                    equipment = equip,
                    onActionClick = {
                        if (!equip.unlocked) {
                            // Logic placeholder for shop purchase
                        } else {
                            viewModel.equipItem(equip)
                        }
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(120.dp))
    }
}
