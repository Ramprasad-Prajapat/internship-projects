// lib/shared/widgets/app_timeline_bar.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';

class AppTimelineBar extends StatelessWidget {
  final int elapsedSeconds;
  final int totalLoopSeconds;

  const AppTimelineBar({
    Key? key,
    required this.elapsedSeconds,
    this.totalLoopSeconds = 300,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double progress = (elapsedSeconds / totalLoopSeconds).clamp(0.0, 1.0);

    Color progressColor;
    if (progress < 0.2) {
      progressColor = AppColors.stageStartGold;
    } else if (progress < 0.8) {
      progressColor = AppColors.stageMidBlue;
    } else {
      progressColor = AppColors.stageFinalRed;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: AppSpacing.borderRadiusPill,
          child: Container(
            height: 6,
            color: AppColors.panelSecondary,
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  color: progressColor,
                  borderRadius: AppSpacing.borderRadiusPill,
                  boxShadow: [
                    BoxShadow(
                      color: progressColor.withOpacity(0.5),
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
