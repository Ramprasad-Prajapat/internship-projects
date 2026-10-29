// lib/shared/widgets/app_pill.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';

enum AppPillColor { gold, cyan, purple, danger, good }

class AppPill extends StatelessWidget {
  final String label;
  final IconData? icon;
  final AppPillColor colorScheme;

  const AppPill({
    Key? key,
    required this.label,
    this.icon,
    this.colorScheme = AppPillColor.purple,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color text;

    switch (colorScheme) {
      case AppPillColor.gold:
        bg = AppColors.accentGold.withOpacity(0.12);
        border = AppColors.accentGold.withOpacity(0.35);
        text = AppColors.accentGoldLight;
        break;
      case AppPillColor.cyan:
        bg = AppColors.accentCyan.withOpacity(0.12);
        border = AppColors.accentCyan.withOpacity(0.35);
        text = AppColors.accentCyanLight;
        break;
      case AppPillColor.purple:
        bg = AppColors.accentPurple.withOpacity(0.12);
        border = AppColors.accentPurple.withOpacity(0.35);
        text = AppColors.accentPurpleLight;
        break;
      case AppPillColor.danger:
        bg = AppColors.danger.withOpacity(0.12);
        border = AppColors.danger.withOpacity(0.35);
        text = AppColors.danger;
        break;
      case AppPillColor.good:
        bg = AppColors.good.withOpacity(0.12);
        border = AppColors.good.withOpacity(0.35);
        text = AppColors.good;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm + 4, vertical: AppSpacing.xs + 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppSpacing.borderRadiusPill,
        border: Border.all(color: border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: text),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: AppTypography.caption.copyWith(color: text),
          ),
        ],
      ),
    );
  }
}
