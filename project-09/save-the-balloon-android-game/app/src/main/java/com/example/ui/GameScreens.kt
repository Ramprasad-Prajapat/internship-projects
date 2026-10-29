package com.example.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.game.*
import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.ui.platform.LocalContext
import android.widget.Toast
import com.example.ui.theme.*
import kotlin.math.cos
import kotlin.math.sin
import androidx.compose.animation.animateColorAsState

val BalloonBlue = Color(0xFF2196F3)
val BalloonBlueDark = Color(0xFF1565C0)

@Composable
fun SaveTheBalloonApp(viewModel: GameViewModel) {
    val screen by viewModel.currentScreen.collectAsStateWithLifecycle()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = SkyBlueLight
    ) {
        when (screen) {
            Screen.Splash -> SplashScreenView(viewModel)
            Screen.Menu -> MainMenuView(viewModel)
            Screen.Game -> GameplayView(viewModel)
            Screen.GameOver -> GameOverView(viewModel)
            Screen.Settings -> SettingsView(viewModel)
            Screen.Shop -> ShopView(viewModel)
        }
    }
}

// ---------------- SPLASH SCREEN ----------------
@Composable
fun SplashScreenView(viewModel: GameViewModel) {
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(2500)
        viewModel.setScreen(Screen.Menu)
    }

    val infiniteTransition = rememberInfiniteTransition(label = "SplashTransition")
    
    val floatAnim by infiniteTransition.animateFloat(
        initialValue = -10f,
        targetValue = 10f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "BalloonFloat"
    )

    val scaleAnim by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = EaseInOutQuad),
            repeatMode = RepeatMode.Reverse
        ),
        label = "TitleScale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .clickable { viewModel.setScreen(Screen.Menu) }
            .background(
                Brush.verticalGradient(
                    colors = listOf(SkyBlueDark, SkyBlueMedium, SkyBlueLight)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        BackgroundClouds()

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Canvas(
                modifier = Modifier
                    .size(160.dp)
                    .offset(y = floatAnim.dp)
                    .scale(1.1f)
            ) {
                drawGlossyBalloon(
                    center = Offset(size.width / 2f, size.height / 2f - 10f),
                    radius = 65.dp.toPx(),
                    skinName = "Red",
                    shieldActive = false,
                    magnetActive = false,
                    slowMoActive = false,
                    time = System.currentTimeMillis() / 1000f
                )
            }

            Spacer(modifier = Modifier.height(40.dp))

            Text(
                text = "Save the Balloon",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontSize = 38.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = CloudWhite,
                    letterSpacing = 1.sp,
                    fontFamily = FontFamily.SansSerif
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .scale(scaleAnim)
                    .padding(horizontal = 24.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Rising up to the safe zone...",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = SkyBlueLight,
                    fontWeight = FontWeight.Medium
                ),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(48.dp))

            CircularProgressIndicator(
                color = CoinGold,
                strokeWidth = 4.dp,
                modifier = Modifier.size(36.dp)
            )
        }
    }
}

// ---------------- MAIN MENU SCREEN ----------------
@Composable
fun MainMenuView(viewModel: GameViewModel) {
    val highScore by viewModel.highScore.collectAsStateWithLifecycle()
    val totalCoins by viewModel.totalCoins.collectAsStateWithLifecycle()
    val infiniteTransition = rememberInfiniteTransition(label = "MenuTransition")

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.98f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PlayPulse"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(SkyBlueMedium, SkyBlueLight)
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        BackgroundClouds()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 40.dp)
            ) {
                Text(
                    text = "SAVE THE",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = SkyBlueDark,
                        letterSpacing = 4.sp
                    )
                )
                Text(
                    text = "Balloon",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        fontSize = 54.sp,
                        fontWeight = FontWeight.Black,
                        color = BalloonRed,
                        fontFamily = FontFamily.SansSerif
                    ),
                    modifier = Modifier.padding(vertical = 4.dp)
                )
                
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CloudWhite.copy(alpha = 0.5f),
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.EmojiEvents,
                            contentDescription = "Best Score",
                            tint = CoinGoldDark,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Best: ${highScore}m",
                            color = SkyBlueDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                    }
                }
            }

            Column(
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.spacedBy(16.dp),
    modifier = Modifier.widthIn(max = 280.dp)
) {
    // Control mode selection
    val controlMode by viewModel.controlMode.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (!isGranted) {
            Toast.makeText(context, "Camera permission denied, using Manual control", Toast.LENGTH_SHORT).show()
            viewModel.setControlMode(ControlMode.Manual)
        }
    }

    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Button(
            onClick = { viewModel.setControlMode(ControlMode.Manual) },
            colors = ButtonDefaults.buttonColors(
                containerColor = if (controlMode == ControlMode.Manual) BalloonRed else Color.Gray,
                contentColor = CloudWhite
            ),
            modifier = Modifier.weight(1f)
        ) {
            Text("Manual Control")
        }
        Button(
            onClick = {
                permissionLauncher.launch(Manifest.permission.CAMERA)
                viewModel.setControlMode(ControlMode.Hand)
            },
            colors = ButtonDefaults.buttonColors(
                containerColor = if (controlMode == ControlMode.Hand) BalloonRed else Color.Gray,
                contentColor = CloudWhite
            ),
            modifier = Modifier.weight(1f)
        ) {
            Text("Hand Control")
        }
    }
                Button(
                    onClick = { viewModel.startGame() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BalloonRed,
                        contentColor = CloudWhite
                    ),
                    shape = RoundedCornerShape(24.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                        .scale(pulseScale)
                        .testTag("play_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Play",
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "PLAY NOW",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                    }
                }

                Button(
                    onClick = { viewModel.setScreen(Screen.Shop) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFF9800),
                        contentColor = CloudWhite
                    ),
                    shape = RoundedCornerShape(24.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 6.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .testTag("shop_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Palette,
                            contentDescription = "Balloon Skins Shop",
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "BALLOON SHOP",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                Button(
                    onClick = { viewModel.setScreen(Screen.Settings) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CloudWhite,
                        contentColor = SkyBlueDark
                    ),
                    shape = RoundedCornerShape(24.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .testTag("settings_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Settings",
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Settings",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                var showExitDialog by remember { mutableStateOf(false) }
                
                Button(
                    onClick = {
                        viewModel.soundManager.playTapSound()
                        showExitDialog = true
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CloudWhite.copy(alpha = 0.6f),
                        contentColor = SkyBlueDark.copy(alpha = 0.8f)
                    ),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("exit_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.ExitToApp,
                            contentDescription = "Exit",
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Exit Game",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                if (showExitDialog) {
                    AlertDialog(
                        onDismissRequest = { showExitDialog = false },
                        title = { Text("Exit Game") },
                        text = { Text("Are you sure you want to close Save the Balloon?") },
                        confirmButton = {
                            TextButton(onClick = {
                                showExitDialog = false
                                System.exit(0)
                            }) {
                                Text("Exit")
                            }
                        },
                        dismissButton = {
                            TextButton(onClick = { showExitDialog = false }) {
                                Text("Cancel")
                            }
                        }
                    )
                }
            }

            Card(
                colors = CardDefaults.cardColors(
                    containerColor = CloudWhite.copy(alpha = 0.9f)
                ),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Coins",
                            tint = CoinGoldDark,
                            modifier = Modifier.size(26.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Total Coins",
                                fontSize = 11.sp,
                                color = SkyBlueDark.copy(alpha = 0.6f),
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "$totalCoins",
                                fontSize = 18.sp,
                                color = SkyBlueDark,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }

                    VerticalDivider(
                        color = SkyBlueMedium.copy(alpha = 0.3f),
                        modifier = Modifier.height(36.dp)
                    )

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Leaderboard,
                            contentDescription = "High Score",
                            tint = BalloonRed,
                            modifier = Modifier.size(26.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Best Distance",
                                fontSize = 11.sp,
                                color = SkyBlueDark.copy(alpha = 0.6f),
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${highScore}m",
                                fontSize = 18.sp,
                                color = SkyBlueDark,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }
                }
            }
        }
    }
}

// ---------------- SETTINGS SCREEN ----------------
@Composable
fun SettingsView(viewModel: GameViewModel) {
    val soundEnabled by viewModel.soundEnabled.collectAsStateWithLifecycle()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(SkyBlueMedium, SkyBlueLight)
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        BackgroundClouds()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 40.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings Icon",
                    tint = SkyBlueDark,
                    modifier = Modifier.size(48.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "SETTINGS",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = SkyBlueDark,
                        letterSpacing = 1.5.sp
                    )
                )
            }

            Card(
                colors = CardDefaults.cardColors(
                    containerColor = CloudWhite.copy(alpha = 0.95f)
                ),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = if (soundEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                                contentDescription = "Sound Toggle",
                                tint = SkyBlueDark,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Sound Effects",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = SkyBlueDark
                                )
                                Text(
                                    text = "Game sound & audio feedback",
                                    fontSize = 12.sp,
                                    color = SkyBlueDark.copy(alpha = 0.6f)
                                )
                            }
                        }
                        Switch(
                            checked = soundEnabled,
                            onCheckedChange = { viewModel.toggleSound() },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = CloudWhite,
                                checkedTrackColor = BalloonRed,
                                uncheckedThumbColor = SkyBlueMedium,
                                uncheckedTrackColor = CloudGray
                            ),
                            modifier = Modifier.testTag("sound_switch")
                        )
                    }

                    HorizontalDivider(color = SkyBlueMedium.copy(alpha = 0.2f))

                    Column {
                        Text(
                            text = "How to Play",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = SkyBlueDark,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Row(verticalAlignment = Alignment.Top) {
                            Text(text = "🎈", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Drag left/right anywhere on the screen to guide the rising balloon.",
                                fontSize = 13.sp,
                                color = SkyBlueDark.copy(alpha = 0.8f)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.Top) {
                            Text(text = "⚡", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Avoid spikes, needles, storm clouds, and rockets. Use power-ups (Shield, Magnet, SlowMo) to survive!",
                                fontSize = 13.sp,
                                color = SkyBlueDark.copy(alpha = 0.8f)
                            )
                        }
                    }
                }
            }

            Button(
                onClick = { viewModel.setScreen(Screen.Menu) },
                colors = ButtonDefaults.buttonColors(
                    containerColor = SkyBlueDark,
                    contentColor = CloudWhite
                ),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .testTag("back_button")
            ) {
                Text(
                    text = "BACK TO MENU",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// ---------------- GAME OVER SCREEN ----------------
@Composable
fun GameOverView(viewModel: GameViewModel) {
    val highScore by viewModel.highScore.collectAsStateWithLifecycle()
    val finalScoreFloat by viewModel.score.collectAsStateWithLifecycle()
    val finalScore = finalScoreFloat.toInt()
    val coinsCollected by viewModel.coinsCollected.collectAsStateWithLifecycle()

    val isNewHighScore = finalScore >= highScore && finalScore > 0

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(DarkSkyBg, SkyBlueDark)
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        BackgroundClouds()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 40.dp)
            ) {
                Text(
                    text = "GAME OVER",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        fontSize = 44.sp,
                        fontWeight = FontWeight.Black,
                        color = BalloonRed,
                        letterSpacing = 2.sp
                    ),
                    textAlign = TextAlign.Center
                )
                
                if (isNewHighScore) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = CoinGold,
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text(
                            text = "👑 NEW RECORD! 👑",
                            color = BalloonRedDark,
                            fontWeight = FontWeight.Black,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            Card(
                colors = CardDefaults.cardColors(
                    containerColor = CloudWhite.copy(alpha = 0.95f)
                ),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Distance Reached",
                            fontSize = 13.sp,
                            color = SkyBlueDark.copy(alpha = 0.6f),
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${finalScore}m",
                            fontSize = 48.sp,
                            color = SkyBlueDark,
                            fontWeight = FontWeight.Black
                        )
                    }

                    HorizontalDivider(color = SkyBlueMedium.copy(alpha = 0.2f))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Coins",
                                    tint = CoinGoldDark,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "+$coinsCollected",
                                    fontSize = 20.sp,
                                    color = SkyBlueDark,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Text(
                                text = "Coins Collected",
                                fontSize = 11.sp,
                                color = SkyBlueDark.copy(alpha = 0.5f)
                            )
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.EmojiEvents,
                                    contentDescription = "Personal Best",
                                    tint = BalloonRed,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${highScore}m",
                                    fontSize = 20.sp,
                                    color = SkyBlueDark,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Text(
                                text = "Best Distance",
                                fontSize = 11.sp,
                                color = SkyBlueDark.copy(alpha = 0.5f)
                            )
                        }
                    }
                }
            }

            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Button(
                    onClick = { viewModel.startGame() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BalloonRed,
                        contentColor = CloudWhite
                    ),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .testTag("retry_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Retry")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("PLAY AGAIN", fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Button(
                    onClick = { viewModel.setScreen(Screen.Menu) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CloudWhite.copy(alpha = 0.2f),
                        contentColor = CloudWhite
                    ),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("home_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(imageVector = Icons.Default.Home, contentDescription = "Home")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("BACK TO HOME", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ---------------- GAMEPLAY SCREEN ----------------
@Composable
fun GameplayView(viewModel: GameViewModel) {
    val controlMode by viewModel.controlMode.collectAsStateWithLifecycle()
    val context = LocalContext.current
    // Initialize HandGestureHelper only when needed
    val handHelper = remember { HandGestureHelper(context, viewModel) }
    LaunchedEffect(key1 = controlMode) {
        if (controlMode == ControlMode.Hand) {
            handHelper.start()
        } else {
            handHelper.stop()
        }
    }
    val scoreFloat by viewModel.score.collectAsStateWithLifecycle()
    val score = scoreFloat.toInt()
    val coinsCollected by viewModel.coinsCollected.collectAsStateWithLifecycle()
    val obstacles by viewModel.obstacles.collectAsStateWithLifecycle()
    val coins by viewModel.coins.collectAsStateWithLifecycle()
    val powerUps by viewModel.powerUps.collectAsStateWithLifecycle()

    val shieldTime by viewModel.shieldTime.collectAsStateWithLifecycle()
    val magnetTime by viewModel.magnetTime.collectAsStateWithLifecycle()
    val slowMoTime by viewModel.slowMoTime.collectAsStateWithLifecycle()
    val isPaused by viewModel.isPaused.collectAsStateWithLifecycle()

    val screenShake by viewModel.screenShake.collectAsStateWithLifecycle()
    val shieldBreakEffect by viewModel.shieldBreakEffect.collectAsStateWithLifecycle()
    val isBursting by viewModel.isBursting.collectAsStateWithLifecycle()
    val selectedSkin by viewModel.selectedSkin.collectAsStateWithLifecycle()

    val windDirection by viewModel.windDirection.collectAsStateWithLifecycle()
    val windSpeed by viewModel.windSpeed.collectAsStateWithLifecycle()

    val comboCount by viewModel.comboCount.collectAsStateWithLifecycle()
    val comboText by viewModel.comboText.collectAsStateWithLifecycle()

    val shieldActive = shieldTime > 0f
    val magnetActive = magnetTime > 0f
    val slowMoActive = slowMoTime > 0f

    val configuration = LocalConfiguration.current
    val screenHeight = configuration.screenHeightDp.dp
    val screenWidth = configuration.screenWidthDp.dp

    // Weather Progression Gradients
    val sunnyStart = Color(0xFF87CEEB)
    val sunnyEnd = Color(0xFFB0E2FF)
    val cloudyStart = Color(0xFF90A4AE)
    val cloudyEnd = Color(0xFFCFD8DC)
    val rainyStart = Color(0xFF37474F)
    val rainyEnd = Color(0xFF546E7A)
    val nightStart = Color(0xFF0D1B2A)
    val nightEnd = Color(0xFF1B263B)

    val targetColors = when {
        score < 200 -> Pair(sunnyStart, sunnyEnd)
        score < 500 -> Pair(cloudyStart, cloudyEnd)
        score < 900 -> Pair(rainyStart, rainyEnd)
        else -> Pair(nightStart, nightEnd)
    }

    val animatedStartColor by animateColorAsState(targetValue = targetColors.first, animationSpec = tween(1500), label = "StartColorAnim")
    val animatedEndColor by animateColorAsState(targetValue = targetColors.second, animationSpec = tween(1500), label = "EndColorAnim")

    // Screen Shake Offset Calculation
    val shakeX = if (screenShake > 0f) {
        (kotlin.random.Random.nextFloat() - 0.5f) * 2f * screenShake * 16f
    } else 0f
    val shakeY = if (screenShake > 0f) {
        (kotlin.random.Random.nextFloat() - 0.5f) * 2f * screenShake * 16f
    } else 0f

    // Balloon Trail Tracking
    val trailXList = remember { mutableStateListOf<Float>() }
    LaunchedEffect(balloonX) {
        trailXList.add(balloonX)
        if (trailXList.size > 8) {
            trailXList.removeAt(0)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .offset(x = shakeX.dp, y = shakeY.dp)
            .background(
                if (slowMoActive) {
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF0D47A1), Color(0xFF1976D2), Color(0xFFE0F7FA))
                    )
                } else {
                    Brush.verticalGradient(
                        colors = listOf(animatedStartColor, animatedEndColor)
                    )
                }
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    awaitPointerEventScope {
                        while (true) {
                            val event = awaitPointerEvent()
                            val change = event.changes.firstOrNull()
                            if (change != null) {
                                val width = size.width
                                if (width > 0) {
                                    val newFraction = change.position.x / width
                                    if (!newFraction.isNaN()) {
                                        viewModel.setBalloonX(newFraction)
                                    }
                                }
                                change.consume()
                            }
                        }
                    }
                }
        ) {
            val width = size.width
            val height = size.height

            // Render weather progression decorations
            if (score < 200) {
                drawGameSkyDecoration(width, height)
            } else if (score in 200..499) {
                // Clouds
                drawCloudShape(Offset(0.2f * width, 0.2f * height), 0.12f * width, Color.White.copy(alpha = 0.35f))
                drawCloudShape(Offset(0.75f * width, 0.45f * height), 0.10f * width, Color.White.copy(alpha = 0.25f))
            } else if (score in 500..899) {
                // Rain lines
                val rainTime = System.currentTimeMillis() / 150f
                for (i in 0 until 16) {
                    val rx = ((i * 0.06f + rainTime * 0.04f) % 1.0f) * width
                    val ry = ((i * 0.11f + rainTime * 0.22f) % 1.0f) * height
                    drawLine(
                        color = Color(0x55B2EBF2),
                        start = Offset(rx, ry),
                        end = Offset(rx - 8f, ry + 24f),
                        strokeWidth = 3f
                    )
                }
            } else {
                // Stars
                val starTime = System.currentTimeMillis()
                for (i in 0 until 24) {
                    val sx = ((i * 0.07f + 0.13f) % 1.0f) * width
                    val sy = ((i * 0.13f + 0.07f) % 1.0f) * height
                    val blink = if ((starTime + i * 150) % 1000 < 500) 1.0f else 0.3f
                    drawCircle(
                        color = Color.White.copy(alpha = 0.75f * blink),
                        radius = if (i % 3 == 0) 3.5f else 1.8f,
                        center = Offset(sx, sy)
                    )
                }
            }

            for (coin in coins) {
                if (!coin.isCollected) {
                    drawCoinEntity(coin, width, height)
                }
            }

            for (pu in powerUps) {
                if (!pu.isCollected) {
                    drawPowerUpEntity(pu, width, height)
                }
            }

            for (obs in obstacles) {
                drawObstacleEntity(obs, width, height)
            }

            val balloonRadius = 0.06f * width
            val bx = balloonX * width
            val by = 0.75f * height

            // Draw Trail Bubbles
            for (i in trailXList.indices) {
                val tx = trailXList[i] * width
                val progress = i.toFloat() / trailXList.size
                val ty = by + balloonRadius * (1.1f + (1f - progress) * 1.4f)
                val trailRadius = balloonRadius * 0.3f * progress
                val trailColor = when (selectedSkin) {
                    "Blue" -> Color(0x5F90CAF9)
                    "Heart" -> Color(0x5FF48FB1)
                    "Star" -> Color(0x5FFFFE0B)
                    "Golden" -> Color(0x5FFFAB91)
                    else -> Color(0x5FFFCDD2)
                }
                drawCircle(
                    color = trailColor,
                    radius = trailRadius,
                    center = Offset(tx, ty)
                )
            }

            drawGlossyBalloon(
                center = Offset(bx, by),
                radius = balloonRadius,
                skinName = selectedSkin,
                shieldActive = shieldActive,
                magnetActive = magnetActive,
                slowMoActive = slowMoActive,
                time = System.currentTimeMillis() / 1000f,
                shieldBreakEffect = shieldBreakEffect,
                isBursting = isBursting
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = CloudWhite.copy(alpha = 0.85f),
                        tonalElevation = 2.dp
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.ArrowUpward,
                                contentDescription = "Altitude",
                                tint = SkyBlueDark,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${score}m",
                                color = SkyBlueDark,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = CloudWhite.copy(alpha = 0.85f),
                        tonalElevation = 2.dp
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = "Coins",
                                tint = CoinGoldDark,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "$coinsCollected",
                                color = SkyBlueDark,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }
                }

                IconButton(
                    onClick = { viewModel.pauseGame() },
                    colors = IconButtonDefaults.iconButtonColors(
                        containerColor = CloudWhite.copy(alpha = 0.85f)
                    ),
                    modifier = Modifier
                        .size(40.dp)
                        .testTag("pause_button")
                ) {
                    Icon(
                        imageVector = if (isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                        contentDescription = "Pause",
                        tint = SkyBlueDark
                    )
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
                horizontalAlignment = Alignment.Start
            ) {
                if (shieldActive) {
                    PowerUpBadge(text = "Shield Enabled", color = ShieldCyan, icon = Icons.Default.Security)
                }
                if (magnetActive) {
                    PowerUpBadge(text = "Magnet: ${"%.1f".format(magnetTime)}s", color = MagnetPurple, icon = Icons.Default.FlashOn)
                }
                if (slowMoActive) {
                    PowerUpBadge(text = "Slow-Mo: ${"%.1f".format(slowMoTime)}s", color = SlowMoGreen, icon = Icons.Default.Timer)
                }
            }
        }

        for (obs in obstacles) {
            if (obs.type == ObstacleType.Rocket && obs.warningTimer > 0f) {
                val rx = (obs.x * configuration.screenWidthDp).dp
                Box(
                    modifier = Modifier
                        .offset(x = rx - 20.dp, y = 16.dp)
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(BalloonRed)
                        .align(Alignment.TopStart),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Rocket Warning",
                        tint = CloudWhite,
                        modifier = Modifier
                            .size(24.dp)
                            .scale(if (System.currentTimeMillis() % 400 < 200) 1.2f else 0.8f)
                    )
                }
            }
        }

        // Wind System HUD Overlay
        if (windSpeed > 0f) {
            val windArrowAngle = if (windDirection > 0f) 90f else 270f
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = CloudWhite.copy(alpha = 0.85f),
                tonalElevation = 2.dp,
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 70.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Navigation,
                        contentDescription = "Wind Arrow",
                        tint = SkyBlueDark,
                        modifier = Modifier
                            .size(16.dp)
                            .rotate(windArrowAngle)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Wind: ${(windSpeed * 100).toInt()} km/h",
                        color = SkyBlueDark,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }
        }

        // Coin Combo Pop-up Text
        if (comboText.isNotEmpty()) {
            Text(
                text = comboText,
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Black,
                    color = CoinGold,
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                ),
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(bottom = 120.dp)
                    .scale(1.1f)
            )
        }

        if (isPaused) {
            Surface(
                color = Color.Black.copy(alpha = 0.5f),
                modifier = Modifier
                    .fillMaxSize()
                    .clickable(enabled = false) {}
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.fillMaxSize()
                ) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CloudWhite),
                        shape = RoundedCornerShape(28.dp),
                        modifier = Modifier
                            .width(300.dp)
                            .padding(24.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Text(
                                text = "Game Paused",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    color = SkyBlueDark
                                )
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Button(
                                onClick = { viewModel.resumeGame() },
                                colors = ButtonDefaults.buttonColors(containerColor = BalloonRed),
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.fillMaxWidth().height(50.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Resume")
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Resume Game", fontWeight = FontWeight.Bold)
                                }
                            }

                            Button(
                                onClick = { viewModel.startGame() },
                                colors = ButtonDefaults.buttonColors(containerColor = SkyBlueDark),
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.fillMaxWidth().height(50.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.Refresh, contentDescription = "Restart")
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Restart Run", fontWeight = FontWeight.Bold)
                                }
                            }

                            OutlinedButton(
                                onClick = { viewModel.quitToMenu() },
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.fillMaxWidth().height(50.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.Home, contentDescription = "Home")
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Back to Home", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ---------------- POWER-UP HUDBADGE ----------------
@Composable
fun PowerUpBadge(text: String, color: Color, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = color,
        tonalElevation = 4.dp
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = CloudWhite,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = text,
                color = CloudWhite,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }
    }
}

// ---------------- BACKGROUND CLOUDS DECORATIVE ----------------
@Composable
fun BackgroundClouds() {
    val infiniteTransition = rememberInfiniteTransition(label = "Clouds")
    val driftAnim1 = infiniteTransition.animateFloat(
        initialValue = -100f,
        targetValue = 500f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Cloud1"
    )
    val driftAnim2 = infiniteTransition.animateFloat(
        initialValue = 500f,
        targetValue = -100f,
        animationSpec = infiniteRepeatable(
            animation = tween(18000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Cloud2"
    )

    Canvas(modifier = Modifier.fillMaxSize()) {
        drawCloudShape(Offset(driftAnim1.value.dp.toPx(), 150.dp.toPx()), 45.dp.toPx(), CloudWhite.copy(alpha = 0.4f))
        drawCloudShape(Offset(driftAnim2.value.dp.toPx(), 450.dp.toPx()), 60.dp.toPx(), CloudWhite.copy(alpha = 0.25f))
    }
}

fun DrawScope.drawCloudShape(center: Offset, size: Float, color: Color) {
    drawCircle(color = color, radius = size, center = center)
    drawCircle(color = color, radius = size * 0.75f, center = Offset(center.x - size * 0.7f, center.y + size * 0.1f))
    drawCircle(color = color, radius = size * 0.85f, center = Offset(center.x + size * 0.7f, center.y + size * 0.05f))
}

// ---------------- CANVAS DRAWING HELPERS ----------------

fun DrawScope.drawGameSkyDecoration(width: Float, height: Float) {
    val t = System.currentTimeMillis() / 4000f
    val cx1 = (0.2f + 0.05f * sin(t)) * width
    val cy1 = 0.3f * height
    val cx2 = (0.8f + 0.04f * cos(t * 0.7f)) * width
    val cy2 = 0.55f * height

    drawCloudShape(Offset(cx1, cy1), 0.08f * width, CloudWhite.copy(alpha = 0.3f))
    drawCloudShape(Offset(cx2, cy2), 0.06f * width, CloudWhite.copy(alpha = 0.2f))
}

fun DrawScope.drawGlossyBalloon(
    center: Offset,
    radius: Float,
    skinName: String,
    shieldActive: Boolean,
    magnetActive: Boolean,
    slowMoActive: Boolean,
    time: Float,
    shieldBreakEffect: Float = 0f,
    isBursting: Boolean = false
) {
    val stringPath = Path().apply {
        moveTo(center.x, center.y + radius)
        quadraticTo(
            center.x + 8f * sin(time * 5f), center.y + radius + radius * 0.5f,
            center.x + 3f * sin(time * 3f), center.y + radius + radius * 1.1f
        )
    }
    drawPath(path = stringPath, color = Color.DarkGray, style = Stroke(width = 4f))

    if (magnetActive && !isBursting) {
        val magnetPulse = radius * (1.3f + 0.15f * sin(time * 12f))
        drawCircle(
            color = MagnetPurple.copy(alpha = 0.25f),
            radius = magnetPulse,
            center = center
        )
        drawCircle(
            color = MagnetPurple,
            radius = magnetPulse,
            center = center,
            style = Stroke(width = 3f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 15f), 0f))
        )
    }

    if (slowMoActive && !isBursting) {
        val slowMoPulse = radius * (1.4f + 0.10f * cos(time * 8f))
        drawCircle(
            color = SlowMoGreen.copy(alpha = 0.15f),
            radius = slowMoPulse,
            center = center
        )
    }

    if (shieldBreakEffect > 0f) {
        val progress = (0.6f - shieldBreakEffect) / 0.6f // 0f to 1f
        val ringRadius = radius * (1.15f + progress * 0.6f)
        val alpha = (1f - progress) * 0.8f
        drawCircle(
            color = ShieldCyan.copy(alpha = alpha),
            radius = ringRadius,
            center = center,
            style = Stroke(width = 6f * (1f - progress))
        )
    }

    // Burst Animation Shards
    if (isBursting) {
        val burstProgress = 0.5f
        val dist = radius * 1.8f * burstProgress
        val shardColors = when (skinName) {
            "Blue" -> listOf(BalloonBlue, BalloonBlueDark)
            "Heart" -> listOf(Color(0xFFE91E63), Color(0xFFC2185B))
            "Star" -> listOf(Color(0xFFFFEB3B), Color(0xFFF57C00))
            "Golden" -> listOf(CoinGold, CoinGoldDark)
            else -> listOf(BalloonRed, BalloonRedDark)
        }
        for (i in 0 until 8) {
            val angle = i * Math.PI / 4
            val px = center.x + dist * cos(angle).toFloat()
            val py = center.y + dist * sin(angle).toFloat()
            drawCircle(
                color = shardColors[i % shardColors.size].copy(alpha = 0.7f),
                radius = radius * 0.25f,
                center = Offset(px, py)
            )
        }
        return // Skip balloon body rendering
    }

    // Skin Configuration
    val mainColor: Color
    val darkColor: Color
    when (skinName) {
        "Blue" -> {
            mainColor = BalloonBlue
            darkColor = BalloonBlueDark
        }
        "Heart" -> {
            mainColor = Color(0xFFE91E63)
            darkColor = Color(0xFFAD1457)
        }
        "Star" -> {
            mainColor = Color(0xFFFFEB3B)
            darkColor = Color(0xFFF57C00)
        }
        "Golden" -> {
            mainColor = CoinGold
            darkColor = CoinGoldDark
        }
        else -> {
            mainColor = BalloonRed
            darkColor = BalloonRedDark
        }
    }

    // Knot
    val knotPath = Path().apply {
        moveTo(center.x, center.y + radius - 5f)
        lineTo(center.x - radius * 0.15f, center.y + radius + radius * 0.1f)
        lineTo(center.x + radius * 0.15f, center.y + radius + radius * 0.1f)
        close()
    }
    drawPath(path = knotPath, color = darkColor)

    // Balloon Body Shapes
    when (skinName) {
        "Heart" -> {
            val heartPath = Path().apply {
                moveTo(center.x, center.y + radius) // bottom tip
                cubicTo(
                    center.x - radius * 1.4f, center.y - radius * 0.3f,
                    center.x - radius * 0.8f, center.y - radius * 1.3f,
                    center.x, center.y - radius * 0.4f
                )
                cubicTo(
                    center.x + radius * 0.8f, center.y - radius * 1.3f,
                    center.x + radius * 1.4f, center.y - radius * 0.3f,
                    center.x, center.y + radius
                )
                close()
            }
            drawPath(
                path = heartPath,
                brush = Brush.radialGradient(
                    colors = listOf(mainColor.copy(alpha = 0.95f), darkColor),
                    center = Offset(center.x - radius * 0.2f, center.y - radius * 0.3f),
                    radius = radius * 1.2f
                )
            )
            // Gloss highlight
            drawCircle(
                color = Color.White.copy(alpha = 0.45f),
                radius = radius * 0.18f,
                center = Offset(center.x - radius * 0.35f, center.y - radius * 0.35f)
            )
        }
        "Star" -> {
            val starPath = Path().apply {
                val numPoints = 5
                val innerRadius = radius * 0.45f
                val outerRadius = radius * 1.15f
                for (i in 0 until numPoints * 2) {
                    val r = if (i % 2 == 0) outerRadius else innerRadius
                    val angle = i * Math.PI / numPoints - Math.PI / 2
                    val px = center.x + r * cos(angle).toFloat()
                    val py = center.y + r * sin(angle).toFloat()
                    if (i == 0) moveTo(px, py) else lineTo(px, py)
                }
                close()
            }
            drawPath(
                path = starPath,
                brush = Brush.radialGradient(
                    colors = listOf(mainColor.copy(alpha = 0.95f), darkColor),
                    center = Offset(center.x - radius * 0.1f, center.y - radius * 0.1f),
                    radius = radius * 1.2f
                )
            )
            // Gloss highlight
            drawCircle(
                color = Color.White.copy(alpha = 0.45f),
                radius = radius * 0.15f,
                center = Offset(center.x - radius * 0.25f, center.y - radius * 0.25f)
            )
        }
        else -> {
            withTransform({
                scale(1.0f, 1.15f, center)
            }) {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(mainColor.copy(alpha = 0.95f), darkColor),
                        center = Offset(center.x - radius * 0.2f, center.y - radius * 0.3f),
                        radius = radius
                    ),
                    radius = radius,
                    center = center
                )

                drawCircle(
                    color = Color.White.copy(alpha = 0.55f),
                    radius = radius * 0.22f,
                    center = Offset(center.x - radius * 0.45f, center.y - radius * 0.45f)
                )
            }
        }
    }

    if (shieldActive && !isBursting) {
        val pulse = 1.15f + 0.05f * sin(time * 10f)
        drawCircle(
            color = ShieldCyan.copy(alpha = 0.25f),
            radius = radius * pulse,
            center = center
        )
        drawCircle(
            color = ShieldCyan,
            radius = radius * pulse,
            center = center,
            style = Stroke(width = 6f)
        )
    }
}

fun DrawScope.drawCoinEntity(coin: Coin, width: Float, height: Float) {
    val px = coin.x * width
    val py = coin.y * height
    val r = (coin.size * width) / 2f
    val angle = (System.currentTimeMillis() % 1000) * 0.36f

    withTransform({
        rotate(angle, Offset(px, py))
    }) {
        drawCircle(
            color = CoinGoldDark,
            radius = r,
            center = Offset(px, py)
        )
        drawCircle(
            color = CoinGold,
            radius = r * 0.8f,
            center = Offset(px, py)
        )
        drawCircle(
            color = CloudWhite.copy(alpha = 0.8f),
            radius = r * 0.4f,
            center = Offset(px, py)
        )
    }
}

fun DrawScope.drawPowerUpEntity(pu: PowerUp, width: Float, height: Float) {
    val px = pu.x * width
    val py = pu.y * height
    val r = (pu.size * width) / 2f
    val pulse = 1.0f + 0.08f * sin((System.currentTimeMillis() % 1000) * 0.006f)

    val glowColor = when (pu.type) {
        PowerUpType.Shield -> ShieldCyan
        PowerUpType.Magnet -> MagnetPurple
        PowerUpType.SlowMotion -> SlowMoGreen
    }

    drawCircle(
        color = glowColor.copy(alpha = 0.3f),
        radius = r * pulse * 1.3f,
        center = Offset(px, py)
    )

    drawCircle(
        color = glowColor,
        radius = r * pulse,
        center = Offset(px, py)
    )

    when (pu.type) {
        PowerUpType.Shield -> {
            val path = Path().apply {
                moveTo(px, py - r * 0.5f)
                lineTo(px + r * 0.4f, py - r * 0.3f)
                lineTo(px + r * 0.3f, py + r * 0.2f)
                lineTo(px, py + r * 0.6f)
                lineTo(px - r * 0.3f, py + r * 0.2f)
                lineTo(px - r * 0.4f, py - r * 0.3f)
                close()
            }
            drawPath(path = path, color = CloudWhite)
        }
        PowerUpType.Magnet -> {
            val path = Path().apply {
                moveTo(px - r * 0.3f, py - r * 0.4f)
                lineTo(px - r * 0.3f, py + r * 0.1f)
                quadraticTo(px - r * 0.3f, py + r * 0.4f, px, py + r * 0.4f)
                quadraticTo(px + r * 0.3f, py + r * 0.4f, px + r * 0.3f, py + r * 0.1f)
                lineTo(px + r * 0.3f, py - r * 0.4f)
                lineTo(px + r * 0.1f, py - r * 0.4f)
                lineTo(px + r * 0.1f, py + r * 0.1f)
                quadraticTo(px + r * 0.1f, py + r * 0.15f, px, py + r * 0.15f)
                quadraticTo(px - r * 0.1f, py + r * 0.15f, px - r * 0.1f, py + r * 0.1f)
                lineTo(px - r * 0.1f, py - r * 0.4f)
                close()
            }
            drawPath(path = path, color = CloudWhite)
            drawRect(color = BalloonRed, topLeft = Offset(px - r * 0.3f, py - r * 0.4f), size = Size(r * 0.2f, r * 0.15f))
            drawRect(color = BalloonRed, topLeft = Offset(px + r * 0.1f, py - r * 0.4f), size = Size(r * 0.2f, r * 0.15f))
        }
        PowerUpType.SlowMotion -> {
            val path = Path().apply {
                moveTo(px - r * 0.35f, py - r * 0.4f)
                lineTo(px + r * 0.35f, py - r * 0.4f)
                lineTo(px + r * 0.05f, py)
                lineTo(px + r * 0.35f, py + r * 0.4f)
                lineTo(px - r * 0.35f, py + r * 0.4f)
                lineTo(px - r * 0.05f, py)
                close()
            }
            drawPath(path = path, color = CloudWhite)
        }
    }
}

fun DrawScope.drawObstacleEntity(obs: Obstacle, width: Float, height: Float) {
    if (obs.warningTimer > 0f) return

    val px = obs.x * width
    val py = obs.y * height
    val r = (obs.size * width) / 2f
    val time = System.currentTimeMillis() / 1000f

    when (obs.type) {
        ObstacleType.Spikes -> {
            val numSpikes = 8
            for (i in 0 until numSpikes) {
                val angleRad = (i * 2 * Math.PI / numSpikes) + (time * 1.5f)
                val sx = px + (r * 1.15f) * cos(angleRad.toDouble()).toFloat()
                val sy = py + (r * 1.15f) * sin(angleRad.toDouble()).toFloat()

                val spikePath = Path().apply {
                    val angleLeft = angleRad - 0.25f
                    val angleRight = angleRad + 0.25f
                    moveTo(sx, sy)
                    lineTo(px + r * 0.7f * cos(angleLeft.toDouble()).toFloat(), py + r * 0.7f * sin(angleLeft.toDouble()).toFloat())
                    lineTo(px + r * 0.7f * cos(angleRight.toDouble()).toFloat(), py + r * 0.7f * sin(angleRight.toDouble()).toFloat())
                    close()
                }
                drawPath(path = spikePath, color = Color.DarkGray)
            }
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF757575), Color(0xFF212121)),
                    center = Offset(px - r * 0.15f, py - r * 0.15f),
                    radius = r * 0.8f
                ),
                radius = r * 0.8f,
                center = Offset(px, py)
            )
            drawCircle(color = BalloonRed, radius = r * 0.25f, center = Offset(px, py))
        }

        ObstacleType.Bird -> {
            val isFlappingUp = (System.currentTimeMillis() % 300) < 150
            val flapFraction = if (isFlappingUp) -0.6f else 0.6f

            drawOval(
                color = CloudWhite,
                topLeft = Offset(px - r * 1.3f, py + (r * 0.3f * flapFraction) - r * 0.35f),
                size = Size(r * 0.8f, r * 0.4f)
            )
            drawOval(
                color = CloudWhite,
                topLeft = Offset(px + r * 0.5f, py + (r * 0.3f * flapFraction) - r * 0.35f),
                size = Size(r * 0.8f, r * 0.4f)
            )

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFFFFEE58), Color(0xFFFBC02D)),
                    center = Offset(px - r * 0.1f, py - r * 0.1f),
                    radius = r
                ),
                radius = r,
                center = Offset(px, py)
            )

            val beakPath = Path().apply {
                val driftDir = if (obs.driftSpeed >= 0) 1f else -1f
                moveTo(px + r * driftDir, py - r * 0.1f)
                lineTo(px + r * 1.35f * driftDir, py)
                lineTo(px + r * driftDir, py + r * 0.2f)
                close()
            }
            drawPath(path = beakPath, color = Color(0xFFFF9800))

            val driftEyeOffset = if (obs.driftSpeed >= 0) 0.3f else -0.3f
            drawCircle(
                color = Color.Black,
                radius = r * 0.15f,
                center = Offset(px + r * driftEyeOffset, py - r * 0.25f)
            )
        }

        ObstacleType.Needle -> {
            val path = Path().apply {
                moveTo(px, py - r * 1.2f)
                lineTo(px, py + r * 1.2f)
            }
            drawPath(
                path = path,
                color = Color(0xFFB0BEC5),
                style = Stroke(width = 7f, cap = StrokeCap.Round)
            )
            drawPath(
                path = Path().apply {
                    moveTo(px - 1f, py - r)
                    lineTo(px - 1f, py + r * 0.8f)
                },
                color = CloudWhite,
                style = Stroke(width = 2.5f)
            )
            drawCircle(
                color = Color.DarkGray,
                radius = 3f,
                center = Offset(px, py - r * 0.9f)
            )
        }

        ObstacleType.Cloud -> {
            drawCloudShape(Offset(px, py), r * 0.8f, Color(0xFF455A64))
            drawCloudShape(Offset(px, py), r * 0.75f, Color(0xFF37474F))

            val lightning = Path().apply {
                moveTo(px + r * 0.05f, py - r * 0.35f)
                lineTo(px - r * 0.15f, py + r * 0.05f)
                lineTo(px, py + r * 0.05f)
                lineTo(px - r * 0.05f, py + r * 0.45f)
                lineTo(px + r * 0.15f, py + r * 0.05f)
                lineTo(px, py + r * 0.05f)
                close()
            }
            drawPath(path = lightning, color = CoinGold)
        }

        ObstacleType.Rocket -> {
            val rocketAngle = 180f
            withTransform({
                rotate(rocketAngle, Offset(px, py))
            }) {
                if (System.currentTimeMillis() % 200 < 100) {
                    val flame = Path().apply {
                        moveTo(px - r * 0.25f, py - r)
                        lineTo(px, py - r * 1.5f)
                        lineTo(px + r * 0.25f, py - r)
                        close()
                    }
                    drawPath(path = flame, color = Color(0xFFFF3D00))
                }

                drawRoundRect(
                    color = Color(0xFFCFD8DC),
                    topLeft = Offset(px - r * 0.35f, py - r * 0.9f),
                    size = Size(r * 0.7f, r * 1.4f),
                    cornerRadius = CornerRadius(12f, 12f)
                )

                val cone = Path().apply {
                    moveTo(px - r * 0.35f, py + r * 0.5f)
                    quadraticTo(px, py + r * 1.3f, px + r * 0.35f, py + r * 0.5f)
                    close()
                }
                drawPath(path = cone, color = BalloonRed)

                drawCircle(color = SkyBlueMedium, radius = r * 0.18f, center = Offset(px, py - r * 0.1f))
                drawCircle(color = CloudWhite, radius = r * 0.18f, center = Offset(px, py - r * 0.1f), style = Stroke(width = 3f))

                val finLeft = Path().apply {
                    moveTo(px - r * 0.35f, py - r * 0.5f)
                    lineTo(px - r * 0.65f, py - r * 0.8f)
                    lineTo(px - r * 0.35f, py - r * 0.8f)
                    close()
                }
                drawPath(path = finLeft, color = BalloonRed)

                val finRight = Path().apply {
                    moveTo(px + r * 0.35f, py - r * 0.5f)
                    lineTo(px + r * 0.65f, py - r * 0.8f)
                    lineTo(px + r * 0.35f, py - r * 0.8f)
                    close()
                }
                drawPath(path = finRight, color = BalloonRed)
            }
        }
    }
}

@Composable
fun ShopView(viewModel: GameViewModel) {
    val totalCoins by viewModel.totalCoins.collectAsStateWithLifecycle()
    val unlockedSkins by viewModel.unlockedSkins.collectAsStateWithLifecycle()
    val selectedSkin by viewModel.selectedSkin.collectAsStateWithLifecycle()
    val missions by viewModel.missions.collectAsStateWithLifecycle()

    val skinsList = remember {
        listOf(
            Triple("Red", 0, "Default Ruby"),
            Triple("Blue", 50, "Cool Azure"),
            Triple("Heart", 100, "Lovely Heart"),
            Triple("Star", 150, "Shiny Star"),
            Triple("Golden", 250, "Royal Gold")
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(SkyBlueMedium, SkyBlueLight)
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        BackgroundClouds()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(
                    onClick = { viewModel.setScreen(Screen.Menu) },
                    colors = IconButtonDefaults.iconButtonColors(
                        containerColor = CloudWhite.copy(alpha = 0.8f)
                    ),
                    modifier = Modifier.testTag("back_to_menu")
                ) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = SkyBlueDark)
                }

                Text(
                    text = "SHOP & MISSIONS",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = SkyBlueDark,
                        fontSize = 22.sp
                    )
                )

                // Coin Counter
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = CloudWhite.copy(alpha = 0.85f),
                    tonalElevation = 2.dp
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Total Coins",
                            tint = CoinGoldDark,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$totalCoins",
                            color = SkyBlueDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                // Skins Section
                item {
                    Text(
                        text = "Customize Your Balloon",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = SkyBlueDark
                        ),
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                items(skinsList) { (skinName, cost, desc) ->
                    val isUnlocked = unlockedSkins.split(",").contains(skinName) || cost == 0
                    val isActive = selectedSkin == skinName

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isActive) CloudWhite else CloudWhite.copy(alpha = 0.65f)
                        ),
                        border = if (isActive) BorderStroke(3.dp, Color(0xFFFF9800)) else null
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            // Mini Canvas Preview of Balloon Skin
                            Box(
                                modifier = Modifier
                                    .size(72.dp)
                                    .background(Color(0xFFE0F2F1).copy(alpha = 0.5f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Canvas(modifier = Modifier.size(50.dp)) {
                                    drawGlossyBalloon(
                                        center = Offset(size.width / 2f, size.height / 2f - 4f),
                                        radius = 20.dp.toPx(),
                                        skinName = skinName,
                                        shieldActive = false,
                                        magnetActive = false,
                                        slowMoActive = false,
                                        time = System.currentTimeMillis() / 1000f
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            // Details
                            Column(
                                modifier = Modifier.weight(1f),
                                verticalArrangement = Arrangement.Center
                            ) {
                                Text(
                                    text = skinName,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = SkyBlueDark
                                    )
                                )
                                Text(
                                    text = desc,
                                    color = SkyBlueDark.copy(alpha = 0.7f),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }

                            // Action Button
                            when {
                                isActive -> {
                                    Button(
                                        onClick = {},
                                        enabled = false,
                                        colors = ButtonDefaults.buttonColors(
                                            disabledContainerColor = SkyBlueDark.copy(alpha = 0.15f),
                                            disabledContentColor = SkyBlueDark
                                        ),
                                        shape = RoundedCornerShape(16.dp),
                                        modifier = Modifier.height(38.dp)
                                    ) {
                                        Text("Selected", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                isUnlocked -> {
                                    Button(
                                        onClick = { viewModel.selectSkin(skinName) },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = SkyBlueMedium,
                                            contentColor = CloudWhite
                                        ),
                                        shape = RoundedCornerShape(16.dp),
                                        modifier = Modifier
                                            .height(38.dp)
                                            .testTag("select_skin_${skinName}")
                                    ) {
                                        Text("Select", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                else -> {
                                    Button(
                                        onClick = { viewModel.unlockSkin(skinName, cost) },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = Color(0xFFFF9800),
                                            contentColor = CloudWhite
                                        ),
                                        shape = RoundedCornerShape(16.dp),
                                        modifier = Modifier
                                            .height(38.dp)
                                            .testTag("unlock_skin_${skinName}")
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Default.Star,
                                                contentDescription = "Cost",
                                                tint = CloudWhite,
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(2.dp))
                                            Text("$cost", fontSize = 12.sp, fontWeight = FontWeight.Black)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Missions Section
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Daily Adventure Missions",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = SkyBlueDark
                        ),
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                items(missions) { mission ->
                    val progressFraction = if (mission.target > 0) {
                        mission.progress.toFloat() / mission.target
                    } else 0f

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = CloudWhite.copy(alpha = 0.65f)
                        )
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = mission.description,
                                    style = MaterialTheme.typography.titleSmall.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = SkyBlueDark
                                    ),
                                    modifier = Modifier.weight(1f)
                                )

                                Spacer(modifier = Modifier.width(8.dp))

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (mission.isCompleted) Color(0x264CAF50) else Color(0x1A000000)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        if (mission.isCompleted) {
                                            Icon(
                                                imageVector = Icons.Default.Check,
                                                contentDescription = "Completed",
                                                tint = Color(0xFF2E7D32),
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(2.dp))
                                            Text(
                                                text = "Done (+${mission.reward})",
                                                color = Color(0xFF2E7D32),
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        } else {
                                            Icon(
                                                imageVector = Icons.Default.Star,
                                                contentDescription = "Reward",
                                                tint = CoinGoldDark,
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(2.dp))
                                            Text(
                                                text = "${mission.reward} Coins",
                                                color = SkyBlueDark,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = progressFraction,
                                color = if (mission.isCompleted) Color(0xFF4CAF50) else SkyBlueDark,
                                trackColor = SkyBlueDark.copy(alpha = 0.15f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Progress: ${mission.progress}/${mission.target}",
                                color = SkyBlueDark.copy(alpha = 0.7f),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}
