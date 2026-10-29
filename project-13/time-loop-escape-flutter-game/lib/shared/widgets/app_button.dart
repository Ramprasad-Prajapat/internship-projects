// lib/shared/widgets/app_button.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';

enum AppButtonVariant { primary, secondary, ghost, danger }

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final double? width;

  const AppButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.width,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case AppButtonVariant.primary:
        bg = AppColors.accentGold;
        fg = Colors.black;
        break;
      case AppButtonVariant.secondary:
        bg = AppColors.panelSecondary;
        fg = AppColors.textPrimary;
        border = const BorderSide(color: AppColors.lineBorder);
        break;
      case AppButtonVariant.ghost:
        bg = Colors.transparent;
        fg = AppColors.textSecondary;
        break;
      case AppButtonVariant.danger:
        bg = AppColors.danger.withOpacity(0.15);
        fg = AppColors.danger;
        border = BorderSide(color: AppColors.danger.withOpacity(0.3));
        break;
    }

    final content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading)
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(strokeWidth: 2, color: fg),
          )
        else ...[
          if (icon != null) ...[
            Icon(icon, size: 18, color: fg),
            const SizedBox(width: AppSpacing.sm),
          ],
          Text(
            label,
            style: AppTypography.button.copyWith(color: fg),
          ),
        ],
      ],
    );

    return SizedBox(
      width: width,
      height: AppSpacing.minTouchTargetSize,
      child: Material(
        color: bg,
        borderRadius: AppSpacing.borderRadiusMd,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: AppSpacing.borderRadiusMd,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            decoration: BoxDecoration(
              borderRadius: AppSpacing.borderRadiusMd,
              border: Border.fromBorderSide(border),
            ),
            alignment: Alignment.center,
            child: content,
          ),
        ),
      ),
    );
  }
}
