// lib/shared/widgets/app_countdown_clock.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_pill.dart';

class AppCountdownClock extends StatelessWidget {
  final int elapsedSeconds;
  final int totalLoopSeconds;

  const AppCountdownClock({
    Key? key,
    required this.elapsedSeconds,
    this.totalLoopSeconds = 300,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final remainingSeconds = (totalLoopSeconds - elapsedSeconds).clamp(0, totalLoopSeconds);
    final minutesRemaining = remainingSeconds ~/ 60;
    final secondsRemaining = remainingSeconds % 60;

    // Determine 11:57 - 12:00 timeline clock display
    // Loop starts at 11:57:00 PM and ends at 12:00:00 AM
    final displayMinute = 57 + (elapsedSeconds ~/ 60);
    final displaySecond = elapsedSeconds % 60;

    final clockString = '${displayMinute.toString().padLeft(2, '0')}:${displaySecond.toString().padLeft(2, '0')} PM';

    // Ambient stage color determination according to research section 15
    Color stageColor;
    AppPillColor pillScheme;

    if (elapsedSeconds < 60) {
      stageColor = AppColors.stageStartGold;
      pillScheme = AppPillColor.gold;
    } else if (elapsedSeconds < 240) {
      stageColor = AppColors.stageMidBlue;
      pillScheme = AppPillColor.cyan;
    } else if (remainingSeconds > 0) {
      stageColor = AppColors.stageFinalRed;
      pillScheme = AppPillColor.danger;
    } else {
      stageColor = AppColors.stageResetWhite;
      pillScheme = AppPillColor.purple;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.panelSecondary,
        borderRadius: AppSpacing.borderRadiusLg,
        border: Border.all(color: stageColor.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.access_time_filled, color: stageColor, size: 20),
          const SizedBox(width: AppSpacing.sm),
          Text(
            clockString,
            style: AppTypography.countdownTimer.copyWith(color: stageColor),
          ),
          const SizedBox(width: AppSpacing.md),
          AppPill(
            label: '${minutesRemaining}m ${secondsRemaining}s REMAINING',
            colorScheme: pillScheme,
          ),
        ],
      ),
    );
  }
}
