package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Abc
import androidx.compose.material.icons.filled.AdsClick
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ChatBubble
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DirectionsRun
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.GTranslate
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.BadgeData
import com.example.data.EquipmentData
import com.example.data.LevelData
import com.example.data.MistakeData
import com.example.data.ModeData
import com.example.data.UserData
import com.example.ui.theme.BorderGray
import com.example.ui.theme.CardSurface
import com.example.ui.theme.ErrorRed
import com.example.ui.theme.GoldCoin
import com.example.ui.theme.LightBackground
import com.example.ui.theme.PerfectGreen
import com.example.ui.theme.PrimaryPurple
import com.example.ui.theme.PrimaryPurpleLight
import com.example.ui.theme.PurpleAccent
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

// Utility helper to map icon strings to Vector Icons
fun getVectorIcon(name: String): ImageVector {
    return when (name) {
        "home" -> Icons.Default.Home
        "abc" -> Icons.Default.Abc
        "chat_bubble" -> Icons.Default.ChatBubble
        "g_translate" -> Icons.Default.GTranslate
        "translate" -> Icons.Default.Translate
        "speed" -> Icons.Default.Speed
        "ads_click" -> Icons.Default.AdsClick
        "calendar_month" -> Icons.Default.CalendarMonth
        "emoji_events" -> Icons.Default.EmojiEvents
        "directions_run" -> Icons.Default.DirectionsRun
        "flight" -> Icons.Default.Flight
        "local_fire_department" -> Icons.Default.LocalFireDepartment
        "person" -> Icons.Default.Person
        "shopping_bag" -> Icons.Default.ShoppingBag
        "school" -> Icons.Default.School
        "refresh" -> Icons.Default.Refresh
        "star" -> Icons.Default.Star
        else -> Icons.Default.PlayArrow
    }
}

// 1. AppButton with clean purple gradient and Material Ripple
@Composable
fun AppButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    secondary: Boolean = false,
    tag: String = "app_button"
) {
    val gradientBrush = if (enabled) {
        Brush.linearGradient(
            colors = listOf(PrimaryPurple, PurpleAccent)
        )
    } else {
        Brush.linearGradient(
            colors = listOf(Color(0xFFCCCCCC), Color(0xFFE0E0E0))
        )
    }

    Box(
        modifier = if (secondary && enabled) {
            modifier
                .testTag(tag)
                .height(52.dp)
                .shadow(6.dp, RoundedCornerShape(16.dp))
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White)
                .clickable(enabled = enabled, onClick = onClick)
                .padding(horizontal = 24.dp)
        } else {
            modifier
                .testTag(tag)
                .height(52.dp)
                .shadow(6.dp, RoundedCornerShape(16.dp))
                .clip(RoundedCornerShape(16.dp))
                .background(gradientBrush)
                .clickable(enabled = enabled, onClick = onClick)
                .padding(horizontal = 24.dp)
        },
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (secondary && enabled) PrimaryPurple else Color.White,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                color = if (secondary && enabled) PrimaryPurple else Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center
            )
        }
    }
}

// 2. StatCard for grids/rows
@Composable
fun StatCard(
    title: String,
    value: String,
    icon: ImageVector,
    iconColor: Color,
    modifier: Modifier = Modifier,
    tag: String = "stat_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .border(1.dp, Color(0xFFEEF2FF), RoundedCornerShape(20.dp))
            .shadow(2.dp, RoundedCornerShape(20.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(20.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title.uppercase(),
                    color = TextSecondary,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = value,
                    color = PrimaryPurple, // Highlighted text color as per Immersive UI
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black
                )
            }
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(iconColor.copy(alpha = 0.12f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = iconColor,
                    modifier = Modifier.size(22.dp)
                )
            }
        }
    }
}

// 3. ModeCard
@Composable
fun ModeCard(
    mode: ModeData,
    onStartClick: () -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "mode_card"
) {
    val difficultyColor = when (mode.difficulty.uppercase()) {
        "EASY" -> PerfectGreen
        "MEDIUM" -> GoldCoin
        "HARD" -> ErrorRed
        else -> PrimaryPurple
    }

    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(6.dp, RoundedCornerShape(20.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(PrimaryPurpleLight, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = getVectorIcon(mode.iconName),
                            contentDescription = null,
                            tint = PrimaryPurple,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = mode.name,
                            color = TextPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = mode.category.uppercase(),
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                // Difficulty Badge
                Box(
                    modifier = Modifier
                        .background(difficultyColor.copy(alpha = 0.12f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = mode.difficulty,
                        color = difficultyColor,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = mode.description,
                color = TextSecondary,
                fontSize = 13.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Progress Bar Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "PROGRESS",
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${mode.progressPercent}%",
                            color = PrimaryPurple,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    ProgressBar(progress = mode.progressPercent / 100f)
                }
                Spacer(modifier = Modifier.width(16.dp))

                // Start arrow button
                AppButton(
                    text = "START ▶",
                    onClick = onStartClick,
                    modifier = Modifier
                        .width(110.dp)
                        .height(38.dp),
                    tag = "start_mode_${mode.id}"
                )
            }
        }
    }
}

// 4. LevelCard (used in roadmap)
@Composable
fun LevelCard(
    level: LevelData,
    onPlayClick: () -> Unit,
    modifier: Modifier = Modifier,
    stepNumber: Int = 1,
    tag: String = "level_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(if (level.unlocked) 4.dp else 1.dp, RoundedCornerShape(16.dp))
            .alpha(if (level.unlocked) 1f else 0.6f),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .background(
                                if (level.completed) PerfectGreen else PrimaryPurple,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = stepNumber.toString(),
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = level.name,
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = level.difficultyLabel.uppercase(),
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                if (!level.unlocked) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Locked",
                        tint = TextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                } else {
                    Row {
                        repeat(3) { index ->
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = if (index < level.stars) GoldCoin else Color(0xFFE0E0E0),
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            if (level.unlocked) {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = level.targetText,
                    color = TextSecondary,
                    fontSize = 12.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                if (level.completed) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Row {
                        Text(
                            text = "Best WPM: ${level.bestWpm}",
                            color = PrimaryPurple,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = "Accuracy: ${level.bestAccuracy.toInt()}%",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                AppButton(
                    text = if (level.completed) "REPLAY RUN ▶" else "START LEVEL ▶",
                    onClick = onPlayClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(38.dp),
                    tag = "play_level_${level.id}"
                )
            }
        }
    }
}

// 5. BottomTabBar
@Composable
fun BottomTabBar(
    activeTab: String,
    onTabSelected: (String) -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "bottom_tab_bar"
) {
    val tabs = listOf(
        Triple("home", "Home", Icons.Default.Home),
        Triple("modes", "Modes", Icons.Default.PlayArrow),
        Triple("progress", "Progress", Icons.Default.TrendingUp),
        Triple("rewards", "Rewards", Icons.Default.ShoppingBag),
        Triple("profile", "Profile", Icons.Default.Person)
    )

    Card(
        modifier = modifier
            .testTag(tag)
            .fillMaxWidth()
            .shadow(16.dp, RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding() // Protect bottom on gestures/edge-to-edge
                .padding(vertical = 12.dp, horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            tabs.forEach { (id, label, icon) ->
                val isActive = activeTab == id
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onTabSelected(id) }
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isActive) PrimaryPurpleLight else Color.Transparent)
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = label,
                            tint = if (isActive) PrimaryPurple else TextSecondary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = label,
                        color = if (isActive) PrimaryPurple else TextSecondary,
                        fontSize = 11.sp,
                        fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.Medium
                    )
                }
            }
        }
    }
}

// 6. ProgressBar
@Composable
fun ProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    height: Dp = 8.dp,
    color: Color = PrimaryPurple
) {
    val animatedProgress by animateFloatAsState(targetValue = progress.coerceIn(0f, 1f))

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(RoundedCornerShape(height / 2))
            .background(BorderGray)
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(animatedProgress)
                .clip(RoundedCornerShape(height / 2))
                .background(
                    Brush.linearGradient(
                        colors = listOf(color, color.copy(alpha = 0.7f))
                    )
                )
        )
    }
}

// 7. GameHud
@Composable
fun GameHud(
    title: String,
    elapsedText: String,
    liveWpm: Int,
    liveAccuracy: Double,
    coinsCollected: Int,
    progress: Float,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "game_hud"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(
                    onClick = onBackClick,
                    colors = IconButtonDefaults.iconButtonColors(containerColor = LightBackground)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = PrimaryPurple
                    )
                }

                Text(
                    text = title.uppercase(),
                    color = PrimaryPurple,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )

                // Coins collected badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(GoldCoin.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "🪙",
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "+$coinsCollected",
                        color = GoldCoin,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Progress tracking
            ProgressBar(progress = progress)

            Spacer(modifier = Modifier.height(12.dp))

            // Real-time stats display
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Time
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("TIME", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(elapsedText, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Black)
                }

                // WPM
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("SPEED", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text("$liveWpm WPM", color = PrimaryPurple, fontSize = 16.sp, fontWeight = FontWeight.Black)
                }

                // Accuracy
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("ACCURACY", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text("${liveAccuracy.toInt()}%", color = PerfectGreen, fontSize = 16.sp, fontWeight = FontWeight.Black)
                }
            }
        }
    }
}

// 8. ProfileCard
@Composable
fun ProfileCard(
    user: UserData,
    modifier: Modifier = Modifier,
    tag: String = "profile_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(6.dp, RoundedCornerShape(24.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(contentAlignment = Alignment.BottomEnd) {
                // Avatar Circle
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(
                            Brush.sweepGradient(listOf(PrimaryPurple, PurpleAccent)),
                            CircleShape
                        )
                        .padding(3.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .fillMaxHeight()
                            .background(Color.White, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            tint = PrimaryPurple,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }

                // Level indicator overlay
                Box(
                    modifier = Modifier
                        .offset(x = 6.dp, y = 6.dp)
                        .background(PrimaryPurple, RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "LVL ${user.level}",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = user.username,
                color = TextPrimary,
                fontSize = 22.sp,
                fontWeight = FontWeight.Black
            )
            Text(
                text = user.email,
                color = TextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // XP Progress tracker
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "XP GROWTH",
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${user.xp} / ${user.nextLevelXp} XP",
                    color = PrimaryPurple,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            ProgressBar(progress = user.xp.toFloat() / user.nextLevelXp.toFloat())
        }
    }
}

// 9. MistakeCard
@Composable
fun MistakeCard(
    mistake: MistakeData,
    onClearClick: () -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "mistake_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(3.dp, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
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
                // Word Error
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .background(ErrorRed.copy(alpha = 0.12f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = mistake.originalWord.uppercase(),
                            color = ErrorRed,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Typed: \"${mistake.typedWord}\"",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Mark Corrected",
                    tint = BorderGray,
                    modifier = Modifier
                        .size(20.dp)
                        .clickable { onClearClick() }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(LightBackground, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = "ORIGINAL:",
                    color = TextSecondary,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = mistake.originalSentence,
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "TYPED:",
                    color = ErrorRed,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = mistake.typedSentence,
                    color = ErrorRed,
                    fontSize = 13.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = mistake.helpText,
                color = PrimaryPurple,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

// 10. RewardCard / Achievements item
@Composable
fun RewardCard(
    title: String,
    coinsReward: Int,
    xpReward: Int,
    unlocked: Boolean,
    onClaimClick: () -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "reward_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(3.dp, RoundedCornerShape(16.dp))
            .alpha(if (unlocked) 1f else 0.6f),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(PrimaryPurpleLight, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.EmojiEvents,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = title,
                        color = TextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "🪙 $coinsReward",
                            color = GoldCoin,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "⚡ +$xpReward XP",
                            color = PrimaryPurple,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            AppButton(
                text = if (unlocked) "CLAIMED" else "CLAIM",
                onClick = onClaimClick,
                enabled = !unlocked,
                modifier = Modifier
                    .width(90.dp)
                    .height(34.dp),
                tag = "claim_${title.replace(" ", "_")}"
            )
        }
    }
}

// 11. BadgeCard (trophies)
@Composable
fun BadgeCard(
    badge: BadgeData,
    modifier: Modifier = Modifier,
    tag: String = "badge_card"
) {
    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(if (badge.unlocked) 4.dp else 1.dp, RoundedCornerShape(16.dp))
            .alpha(if (badge.unlocked) 1f else 0.5f),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(54.dp)
                    .background(
                        if (badge.unlocked) PrimaryPurpleLight else BorderGray,
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = getVectorIcon(badge.iconName),
                    contentDescription = null,
                    tint = if (badge.unlocked) PrimaryPurple else TextSecondary,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = badge.title,
                color = TextPrimary,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(2.dp))

            Text(
                text = badge.description,
                color = TextSecondary,
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                lineHeight = 14.sp,
                maxLines = 2
            )
        }
    }
}

// 12. EquipmentCard (shop)
@Composable
fun EquipmentCard(
    equipment: EquipmentData,
    onActionClick: () -> Unit,
    modifier: Modifier = Modifier,
    tag: String = "equipment_card"
) {
    val rarityColor = when (equipment.rarity.uppercase()) {
        "MYTHIC" -> ErrorRed
        "LEGENDARY" -> GoldCoin
        "EPIC" -> PrimaryPurple
        else -> TextSecondary
    }

    Card(
        modifier = modifier
            .testTag(tag)
            .shadow(4.dp, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        shape = RoundedCornerShape(16.dp)
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(PrimaryPurpleLight, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = getVectorIcon(equipment.iconName),
                            contentDescription = null,
                            tint = PrimaryPurple,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = equipment.name,
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = equipment.category.uppercase(),
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                // Rarity Tag
                Box(
                    modifier = Modifier
                        .background(rarityColor.copy(alpha = 0.12f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = equipment.rarity,
                        color = rarityColor,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = equipment.effect,
                color = TextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                if (!equipment.unlocked) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🪙", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = equipment.cost.toString(),
                            color = GoldCoin,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .background(PerfectGreen.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = if (equipment.equipped) "EQUIPPED" else "UNLOCKED",
                            color = PerfectGreen,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                val buttonText = when {
                    !equipment.unlocked -> "BUY NOW"
                    equipment.equipped -> "ACTIVE"
                    else -> "EQUIP"
                }

                AppButton(
                    text = buttonText,
                    onClick = onActionClick,
                    enabled = !equipment.equipped,
                    modifier = Modifier
                        .width(100.dp)
                        .height(34.dp),
                    tag = "equip_action_${equipment.id}"
                )
            }
        }
    }
}
