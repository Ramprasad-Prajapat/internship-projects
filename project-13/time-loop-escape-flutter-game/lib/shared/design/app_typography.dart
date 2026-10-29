// lib/shared/design/app_typography.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Centralized typography tokens for 11:57 — The Last Check-In.
class AppTypography {
  static const String fontFamily = 'Inter';

  // --- Display / Hero Titles ---
  static const TextStyle heroClock = TextStyle(
    fontSize: 48.0,
    fontWeight: FontWeight.w900,
    letterSpacing: 2.0,
    color: AppColors.accentGold,
    fontFamily: fontFamily,
  );

  static const TextStyle heroTitle = TextStyle(
    fontSize: 32.0,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.8,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  // --- Section & Card Headlines ---
  static const TextStyle h1 = TextStyle(
    fontSize: 24.0,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  static const TextStyle h2 = TextStyle(
    fontSize: 20.0,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.3,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  static const TextStyle h3 = TextStyle(
    fontSize: 16.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  // --- Body Text ---
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16.0,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14.0,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
    fontFamily: fontFamily,
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12.0,
    fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
    fontFamily: fontFamily,
  );

  // --- Controls & Buttons ---
  static const TextStyle button = TextStyle(
    fontSize: 14.0,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.5,
    color: AppColors.textPrimary,
    fontFamily: fontFamily,
  );

  // --- Captions & Badges ---
  static const TextStyle caption = TextStyle(
    fontSize: 11.0,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.8,
    color: AppColors.accentCyanLight,
    fontFamily: fontFamily,
  );

  static const TextStyle countdownTimer = TextStyle(
    fontSize: 22.0,
    fontWeight: FontWeight.w800,
    letterSpacing: 1.5,
    color: AppColors.accentGoldLight,
    fontFamily: fontFamily,
  );
}
