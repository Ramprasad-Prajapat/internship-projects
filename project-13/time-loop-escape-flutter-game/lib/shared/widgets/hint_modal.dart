// lib/shared/widgets/hint_modal.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/models/hint_model.dart';
import '../../core/services/hint_service.dart';
import '../../core/services/time_loop_service.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';
import 'app_card.dart';
import 'app_modal_sheet.dart';
import 'app_pill.dart';

class HintModal extends StatelessWidget {
  const HintModal({Key? key}) : super(key: key);

  static void show(BuildContext context) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    AppModalSheet.show(
      context: context,
      title: 'INVESTIGATION HINT SYSTEM',
      subtitle: 'Staged, non-spoiler guidance for room puzzles.',
      child: const HintModal(),
    ).then((_) {
      loopService.resumeLoopTimer();
    });
  }

  @override
  Widget build(BuildContext context) {
    final hintService = Provider.of<HintService>(context, listen: true);
    final hints = hintService.getHintsForCurrentLocation();

    if (hints.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: AppSpacing.xl),
        child: AppCard(
          child: Column(
            children: [
              Icon(Icons.lightbulb_outline_rounded, color: AppColors.textMuted, size: 48),
              SizedBox(height: AppSpacing.md),
              Text('NO HINTS REQUIRED', style: AppTypography.h2),
              SizedBox(height: AppSpacing.xs),
              Text(
                'There are no unsolved room puzzles requiring hints in your current location.',
                style: AppTypography.bodyMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text('AVAILABLE STAGED HINTS', style: AppTypography.h3),
        const SizedBox(height: AppSpacing.sm),
        ...hints.map((hint) {
          final isRevealed = hintService.isHintRevealed(hint.id);
          final colorScheme = hint.level == HintLevel.subtle
              ? AppPillColor.cyan
              : (hint.level == HintLevel.direct ? AppPillColor.gold : AppPillColor.danger);

          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child: AppCard(
              borderColor: isRevealed ? AppColors.accentGold : AppColors.lineBorder,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      AppPill(label: hint.level.displayName, colorScheme: colorScheme),
                      AppPill(
                        label: isRevealed ? 'REVEALED' : 'UNREVEALED',
                        colorScheme: isRevealed ? AppPillColor.good : AppPillColor.cyan,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(hint.title, style: AppTypography.h3),
                  const SizedBox(height: AppSpacing.xs),
                  if (isRevealed)
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppColors.backgroundDark,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.accentGold.withOpacity(0.5)),
                      ),
                      child: Text(hint.hintText, style: AppTypography.bodyMedium),
                    )
                  else
                    Text(
                      'Tap reveal below to unlock ${hint.level.displayName.toLowerCase()} for this mechanism.',
                      style: AppTypography.bodySmall,
                    ),
                  const SizedBox(height: AppSpacing.md),
                  AppButton(
                    label: isRevealed ? 'HINT REVEALED' : 'REVEAL HINT',
                    icon: isRevealed ? Icons.visibility_rounded : Icons.visibility_off_rounded,
                    variant: isRevealed ? AppButtonVariant.secondary : AppButtonVariant.primary,
                    onPressed: isRevealed ? null : () => hintService.revealHint(hint.id),
                    width: double.infinity,
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
