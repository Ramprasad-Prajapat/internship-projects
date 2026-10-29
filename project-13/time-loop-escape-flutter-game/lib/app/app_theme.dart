// lib/app/app_theme.dart
import 'package:flutter/material.dart';
import '../shared/design/app_colors.dart';
import '../shared/design/app_spacing.dart';
import '../shared/design/app_typography.dart';

/// Centralized ThemeData using Phase 02 Design Tokens.
class AppTheme {
  static ThemeData get darkTheme {
    final dynamic cardThemeObj = CardTheme(
      color: AppColors.panel,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusLg,
        side: const BorderSide(color: AppColors.lineBorder),
      ),
    );

    final dynamic dialogThemeObj = DialogTheme(
      backgroundColor: AppColors.panel,
      elevation: 16,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusXl,
        side: const BorderSide(color: AppColors.lineBorder),
      ),
    );

    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: AppTypography.fontFamily,
      colorScheme: const ColorScheme.dark(
        background: AppColors.background,
        surface: AppColors.panel,
        primary: AppColors.accentGold,
        secondary: AppColors.accentCyan,
        tertiary: AppColors.accentPurple,
        onBackground: AppColors.textPrimary,
        onSurface: AppColors.textPrimary,
        error: AppColors.danger,
      ),
      cardTheme: cardThemeObj,
      dialogTheme: dialogThemeObj,
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.panelSecondary,
        modalBackgroundColor: AppColors.panelSecondary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusXl)),
        ),
      ),
      useMaterial3: true,
    );
  }
}
