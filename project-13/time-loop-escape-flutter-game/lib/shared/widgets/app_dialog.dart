// lib/shared/widgets/app_dialog.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';

class AppDialog extends StatelessWidget {
  final String title;
  final String content;
  final String? primaryButtonText;
  final VoidCallback? onPrimaryPressed;
  final String? secondaryButtonText;
  final VoidCallback? onSecondaryPressed;
  final Widget? customContent;

  const AppDialog({
    Key? key,
    required this.title,
    required this.content,
    this.primaryButtonText,
    this.onPrimaryPressed,
    this.secondaryButtonText,
    this.onSecondaryPressed,
    this.customContent,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.panel,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacing.borderRadiusXl,
        side: const BorderSide(color: AppColors.lineBorder),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: AppTypography.h2.copyWith(color: AppColors.accentGoldLight),
            ),
            const SizedBox(height: AppSpacing.md),
            if (customContent != null)
              customContent!
            else
              Text(
                content,
                style: AppTypography.bodyMedium,
              ),
            const SizedBox(height: AppSpacing.lg),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (secondaryButtonText != null) ...[
                  AppButton(
                    label: secondaryButtonText!,
                    onPressed: onSecondaryPressed ?? () => Navigator.of(context).pop(),
                    variant: AppButtonVariant.secondary,
                  ),
                  const SizedBox(width: AppSpacing.md),
                ],
                if (primaryButtonText != null)
                  AppButton(
                    label: primaryButtonText!,
                    onPressed: onPrimaryPressed ?? () => Navigator.of(context).pop(),
                    variant: AppButtonVariant.primary,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
