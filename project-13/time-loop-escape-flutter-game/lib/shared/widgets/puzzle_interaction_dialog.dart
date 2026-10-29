// lib/shared/widgets/puzzle_interaction_dialog.dart
import 'package:flutter/material.dart';
import '../../core/models/puzzle_model.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';
import 'app_card.dart';
import 'app_pill.dart';

class PuzzleInteractionDialog extends StatefulWidget {
  final GamePuzzle puzzle;
  final Function(String solution) onSubmitSolution;

  const PuzzleInteractionDialog({
    Key? key,
    required this.puzzle,
    required this.onSubmitSolution,
  }) : super(key: key);

  @override
  State<PuzzleInteractionDialog> createState() => _PuzzleInteractionDialogState();
}

class _PuzzleInteractionDialogState extends State<PuzzleInteractionDialog> {
  final TextEditingController _codeController = TextEditingController();

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isCodePuzzle = widget.puzzle.correctSolution == '1157';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(AppSpacing.md),
      child: AppCard(
        borderColor: AppColors.accentGold,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const AppPill(label: 'PUZZLE MECHANISM', colorScheme: AppPillColor.gold),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textMuted),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(widget.puzzle.title, style: AppTypography.h1),
            const SizedBox(height: AppSpacing.xs),
            Text(widget.puzzle.description, style: AppTypography.bodyMedium),
            const SizedBox(height: AppSpacing.lg),

            if (isCodePuzzle) ...[
              const Text('ENTER 4-DIGIT COMBINATION CODE', style: AppTypography.h3),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                controller: _codeController,
                keyboardType: TextInputType.number,
                maxLength: 4,
                style: const TextStyle(
                  color: AppColors.accentCyan,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 8.0,
                ),
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  counterText: '',
                  filled: true,
                  fillColor: AppColors.backgroundDark,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: AppColors.lineBorder),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              AppButton(
                label: 'SUBMIT CODE',
                icon: Icons.lock_open_rounded,
                variant: AppButtonVariant.primary,
                onPressed: () {
                  final code = _codeController.text;
                  Navigator.of(context).pop();
                  widget.onSubmitSolution(code);
                },
              ),
            ] else ...[
              AppButton(
                label: 'ENGAGE MECHANISM',
                icon: Icons.play_arrow_rounded,
                variant: AppButtonVariant.primary,
                onPressed: () {
                  Navigator.of(context).pop();
                  widget.onSubmitSolution(widget.puzzle.correctSolution);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
