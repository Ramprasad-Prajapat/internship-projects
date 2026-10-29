package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val GameColorScheme = lightColorScheme(
    primary = BalloonRed,
    secondary = SkyBlueDark,
    tertiary = CoinGold,
    background = SkyBlueLight,
    surface = CloudWhite,
    onPrimary = CloudWhite,
    onSecondary = CloudWhite,
    onTertiary = BalloonRedDark,
    onBackground = SkyBlueDark,
    onSurface = SkyBlueDark
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Disable dynamic colors to keep game theme consistent
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = GameColorScheme,
        typography = Typography,
        content = content
    )
}
