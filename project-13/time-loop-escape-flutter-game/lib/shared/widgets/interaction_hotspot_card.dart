// lib/shared/widgets/interaction_hotspot_card.dart
import 'package:flutter/material.dart';
import '../../core/models/interaction_model.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';
import 'app_card.dart';
import 'app_pill.dart';

class InteractionHotspotCard extends StatelessWidget {
  final GameInteraction interaction;
  final InteractionAvailability availability;
  final VoidCallback onExecute;

  const InteractionHotspotCard({
    Key? key,
    required this.interaction,
    required this.availability,
    required this.onExecute,
  }) : super(key: key);

  IconData _getIconForType(MobileInteractionType type) {
    switch (type) {
      case MobileInteractionType.tapInspect:
        return Icons.search_rounded;
      case MobileInteractionType.readDocument:
        return Icons.article_outlined;
      case MobileInteractionType.unlockMechanism:
        return Icons.lock_open_rounded;
      case MobileInteractionType.pickupItem:
        return Icons.archive_outlined;
      case MobileInteractionType.holdHighlight:
        return Icons.touch_app_rounded;
      case MobileInteractionType.dragManipulate:
        return Icons.swipe_vertical_rounded;
    }
  }

  String _getTypeLabel(MobileInteractionType type) {
    switch (type) {
      case MobileInteractionType.tapInspect:
        return 'TAP INSPECT';
      case MobileInteractionType.readDocument:
        return 'READ DOCUMENT';
      case MobileInteractionType.unlockMechanism:
        return 'UNLOCK';
      case MobileInteractionType.pickupItem:
        return 'PICKUP';
      case MobileInteractionType.holdHighlight:
        return 'HOLD HIGHLIGHT';
      case MobileInteractionType.dragManipulate:
        return 'MANIPULATE';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAvailable = availability == InteractionAvailability.available;

    return AppCard(
      borderColor: isAvailable ? AppColors.lineBorder : AppColors.lineBorder.withOpacity(0.3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(_getIconForType(interaction.interactionType), color: isAvailable ? AppColors.accentCyan : AppColors.textMuted),
                  const SizedBox(width: AppSpacing.sm),
                  Text(_getTypeLabel(interaction.interactionType), style: AppTypography.bodySmall),
                ],
              ),
              AppPill(
                label: isAvailable ? 'AVAILABLE' : 'LOCKED',
                colorScheme: isAvailable ? AppPillColor.cyan : AppPillColor.danger,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(interaction.title, style: AppTypography.h3),
          const SizedBox(height: 2),
          Text(interaction.description, style: AppTypography.bodySmall),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            label: isAvailable ? 'INTERACT' : 'EXAMINE LOCK',
            icon: isAvailable ? Icons.play_arrow_rounded : Icons.lock_outline_rounded,
            variant: isAvailable ? AppButtonVariant.primary : AppButtonVariant.ghost,
            onPressed: onExecute,
            width: double.infinity,
          ),
        ],
      ),
    );
  }
}
