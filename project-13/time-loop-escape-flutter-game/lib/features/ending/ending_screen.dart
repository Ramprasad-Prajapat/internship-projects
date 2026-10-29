// lib/features/ending/ending_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_router.dart';
import '../../core/models/ending_model.dart';
import '../../core/repositories/clue_repository.dart';
import '../../core/repositories/ending_repository.dart';
import '../../core/services/ending_service.dart';
import '../../core/services/game_service.dart';
import '../../core/services/knowledge_service.dart';
import '../../core/services/time_loop_service.dart';
import '../../shared/design/app_colors.dart';
import '../../core/models/game_state.dart';
import '../../shared/design/app_spacing.dart';
import '../../shared/design/app_typography.dart';
import '../../shared/widgets/app_button.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_knowledge_card.dart';
import '../../shared/widgets/app_modal_sheet.dart';
import '../../shared/widgets/app_pill.dart';

class EndingScreen extends StatelessWidget {
  final String? endingId;

  const EndingScreen({Key? key, this.endingId}) : super(key: key);

  void _openKnowledgeBoard(BuildContext context) {
    final knowledgeService = Provider.of<KnowledgeService>(context, listen: false);
    final cluesToDisplay = knowledgeService.discoveredClues.isNotEmpty
        ? knowledgeService.discoveredClues
        : [
            ClueRepository.getClueById('clue_frozen_clock')!,
            ClueRepository.getClueById('clue_generator_power_restored')!,
          ];

    AppModalSheet.show(
      context: context,
      title: 'KNOWLEDGE BOARD RECAP',
      subtitle: 'Discovered facts (${cluesToDisplay.length}) persisted across your temporal journey.',
      child: Column(
        children: cluesToDisplay
            .map(
              (clue) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: AppKnowledgeCard(
                  title: clue.title,
                  category: clue.category,
                  summary: clue.summary,
                  status: clue.status,
                ),
              ),
            )
            .toList(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gameService = Provider.of<GameService>(context);
    final endingService = Provider.of<EndingService>(context);
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    final state = gameService.currentState;

    // Resolve active ending model: from argument, or completed ending ID, or highest priority reachable MVP ending
    final targetId = endingId ?? state.persistentKnowledge.completedEndingId;
    EndingModel? resolvedEnding;

    if (targetId != null) {
      resolvedEnding = EndingRepository.getEndingById(targetId);
    }
    resolvedEnding ??= endingService.getReachableEnding(state) ?? EndingRepository.getEndingById('escape_alone');

    final ending = resolvedEnding!;
    final isSiblingEnding = ending.id == 'save_sibling';

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 540),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // --- ENDING HEADER BADGE ---
                  AppPill(
                    label: isSiblingEnding ? 'TRUE MVP CONCLUSION' : 'TEMPORAL ESCAPE REACHED',
                    icon: isSiblingEnding ? Icons.stars_rounded : Icons.flight_takeoff_rounded,
                    colorScheme: isSiblingEnding ? AppPillColor.gold : AppPillColor.cyan,
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // --- ENDING TITLE ---
                  Text(
                    ending.title.toUpperCase(),
                    style: AppTypography.heroClock.copyWith(
                      fontSize: 32,
                      letterSpacing: 2.0,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    '11:57 PM — Hotel Kalchakra Resolution',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.accentGold),
                  ),
                  const SizedBox(height: AppSpacing.xxl),

                  // --- NARRATIVE CONCLUSION CARD ---
                  AppCard(
                    borderColor: isSiblingEnding ? AppColors.accentGold : AppColors.accentCyan,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isSiblingEnding ? Icons.auto_awesome_rounded : Icons.explore_rounded,
                              color: isSiblingEnding ? AppColors.accentGold : AppColors.accentCyan,
                              size: 24,
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Text('NARRATIVE OUTCOME', style: AppTypography.h2),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          ending.narrativeConclusion,
                          style: AppTypography.bodyLarge.copyWith(height: 1.6),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: AppColors.background,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.lineBorder),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('MAJOR TRUTH RECAP', style: AppTypography.h3),
                              const SizedBox(height: AppSpacing.xs),
                              Text(ending.recap, style: AppTypography.bodyMedium),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // --- INVESTIGATION STATS SUMMARY ---
                  AppCard(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            Text('LOOPS SURVIVED', style: AppTypography.bodySmall),
                            const SizedBox(height: 4),
                            Text('${state.currentLoopNumber}', style: AppTypography.h1),
                          ],
                        ),
                        Container(width: 1, height: 36, color: AppColors.lineBorder),
                        Column(
                          children: [
                            Text('CLUES DISCOVERED', style: AppTypography.bodySmall),
                            const SizedBox(height: 4),
                            Text(
                              '${state.persistentKnowledge.discoveredClueIds.length}',
                              style: AppTypography.h1.copyWith(color: AppColors.accentCyan),
                            ),
                          ],
                        ),
                        Container(width: 1, height: 36, color: AppColors.lineBorder),
                        Column(
                          children: [
                            Text('CHAPTER', style: AppTypography.bodySmall),
                            const SizedBox(height: 4),
                            Text(
                              '${state.persistentKnowledge.currentChapter}',
                              style: AppTypography.h1.copyWith(color: AppColors.accentPurpleLight),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xxl),

                  // --- POST-ENDING ACTIONS ---
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      AppButton(
                        label: 'RETURN TO HOME MENU',
                        icon: Icons.home_rounded,
                        variant: AppButtonVariant.primary,
                        onPressed: () {
                          loopService.stopLoopTimer();
                          Navigator.of(context).pushReplacementNamed(AppRoutes.home);
                        },
                      ),
                      const SizedBox(height: AppSpacing.md),
                      AppButton(
                        label: 'REVIEW KNOWLEDGE BOARD',
                        icon: Icons.menu_book_rounded,
                        variant: AppButtonVariant.secondary,
                        onPressed: () => _openKnowledgeBoard(context),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      AppButton(
                        label: 'CONTINUE HOTEL EXPLORATION',
                        icon: Icons.refresh_rounded,
                        variant: AppButtonVariant.ghost,
                        onPressed: () {
                          // Return to game shell safely to continue exploring hotel
                          gameService.setLifecyclePhase(GameLifecyclePhase.loopActive);
                          if (!loopService.isRunning) loopService.startLoopTimer();
                          Navigator.of(context).pushReplacementNamed(AppRoutes.game);
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
