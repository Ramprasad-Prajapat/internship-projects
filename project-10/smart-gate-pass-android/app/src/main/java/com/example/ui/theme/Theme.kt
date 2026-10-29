package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = RoyalBlue,
    secondary = PrimaryNavy,
    tertiary = SuccessGreen,
    background = PrimaryNavy,
    surface = PrimaryNavy,
    onPrimary = CardBackgroundColor,
    onSecondary = CardBackgroundColor,
    onBackground = BackgroundColor,
    onSurface = BackgroundColor
)

private val LightColorScheme = lightColorScheme(
    primary = RoyalBlue,
    secondary = PrimaryNavy,
    tertiary = SuccessGreen,
    background = BackgroundColor,
    surface = CardBackgroundColor,
    onPrimary = CardBackgroundColor,
    onSecondary = CardBackgroundColor,
    onBackground = PrimaryText,
    onSurface = PrimaryText
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        DarkColorScheme
    } else {
        LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
