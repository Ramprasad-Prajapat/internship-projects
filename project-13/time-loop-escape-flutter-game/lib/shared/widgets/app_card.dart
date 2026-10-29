// lib/shared/widgets/app_card.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_shadows.dart';
import '../design/app_spacing.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? borderColor;
  final List<BoxShadow>? shadow;

  const AppCard({
    Key? key,
    required this.child,
    this.padding,
    this.onTap,
    this.borderColor,
    this.shadow,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.panel,
        borderRadius: AppSpacing.borderRadiusLg,
        border: Border.all(color: borderColor ?? AppColors.lineBorder),
        boxShadow: shadow ?? AppShadows.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: AppSpacing.borderRadiusLg,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppSpacing.borderRadiusLg,
          child: Padding(
            padding: padding ?? const EdgeInsets.all(AppSpacing.md),
            child: child,
          ),
        ),
      ),
    );
  }
}
