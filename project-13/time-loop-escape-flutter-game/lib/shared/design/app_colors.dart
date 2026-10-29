// lib/shared/design/app_colors.dart
import 'package:flutter/material.dart';

/// Production color tokens for 11:57 — The Last Check-In (Time Loop Escape).
/// Directly derived from Master Implementation Plan & Research Specifications.
class AppColors {
  // --- Ambient Backgrounds & Surfaces ---
  static const Color background = Color(0xFF090D18);
  static const Color backgroundDark = Color(0xFF080B14);
  static const Color panel = Color(0xFF111827);
  static const Color panelSecondary = Color(0xFF172033);
  static const Color lineBorder = Color(0x1AFFFFFF); // rgba(255,255,255,0.10)

  // --- Text Colors ---
  static const Color textPrimary = Color(0xFFEEF2FF);
  static const Color textSecondary = Color(0xFFA9B4CC);
  static const Color textMuted = Color(0xFF7A869E);

  // --- Accent & Mystery Palette ---
  static const Color accentPurple = Color(0xFF8B5CF6); // Primary ultraviolet / knowledge
  static const Color accentPurpleLight = Color(0xFFC4B5FD);
  static const Color accentCyan = Color(0xFF22D3EE); // Timeline / mechanics
  static const Color accentCyanLight = Color(0xFF67E8F9);
  static const Color accentGold = Color(0xFFF59E0B); // Heritage brass / amber
  static const Color accentGoldLight = Color(0xFFFCD34D);

  // --- Status & Feedback Colors ---
  static const Color good = Color(0xFF34D399); // Success / confirmed
  static const Color danger = Color(0xFFFB7185); // Critical / countdown warning
  static const Color warning = Color(0xFFF59E0B); // Caution / lead

  // --- Timeline Stage Ambient Color Treatments (Research Section 15) ---
  /// Stage 1: Loop Start (11:57:00 - 11:57:59) — Warm amber & heritage gold
  static const Color stageStartAmber = Color(0xFFF59E0B);
  static const Color stageStartGold = Color(0xFFFCD34D);

  /// Stage 2: Mid-Loop (11:58:00 - 11:58:59) — Neutral moonlight & deep cyan/blue
  static const Color stageMidMoonlight = Color(0xFFA9B4CC);
  static const Color stageMidBlue = Color(0xFF22D3EE);

  /// Stage 3: Final Minute (11:59:00 - 11:59:59) — Red highlights & escalating dark shadows
  static const Color stageFinalRed = Color(0xFFFB7185);

  /// Stage 4: Reset (12:00:00) — White distortion & reversed particle glow
  static const Color stageResetWhite = Color(0xFFFFFFFF);
  static const Color stageResetGlow = Color(0xFFEDE9FE);
}
