// lib/shared/widgets/app_modal_sheet.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';

class AppModalSheet extends StatelessWidget {
  final String title;
  final Widget child;
  final String? subtitle;

  const AppModalSheet({
    Key? key,
    required this.title,
    required this.child,
    this.subtitle,
  }) : super(key: key);

  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    required Widget child,
    String? subtitle,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.panelSecondary,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusXl)),
      ),
      builder: (_) => AppModalSheet(
        title: title,
        subtitle: subtitle,
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.lg,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.textMuted.withOpacity(0.4),
                borderRadius: AppSpacing.borderRadiusPill,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Text(title, style: AppTypography.h2.copyWith(color: AppColors.accentGold)),
          if (subtitle != null) ...[
            const SizedBox(height: AppSpacing.xs),
            Text(subtitle!, style: AppTypography.bodySmall),
          ],
          const SizedBox(height: AppSpacing.md),
          const Divider(color: AppColors.lineBorder),
          const SizedBox(height: AppSpacing.md),
          Flexible(child: SingleChildScrollView(child: child)),
        ],
      ),
    );
  }
}
