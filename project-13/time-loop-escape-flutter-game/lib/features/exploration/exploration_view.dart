// lib/features/exploration/exploration_view.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_router.dart';
import '../../core/models/hotel_location.dart';
import '../../core/models/interaction_model.dart';
import '../../core/models/puzzle_model.dart';
import '../../core/repositories/puzzle_repository.dart';
import '../../core/services/ending_service.dart';
import '../../core/services/exploration_service.dart';
import '../../core/services/interaction_service.dart';
import '../../core/services/npc_service.dart';
import '../../core/services/puzzle_service.dart';
import '../../shared/design/app_colors.dart';
import '../../shared/design/app_spacing.dart';
import '../../shared/design/app_typography.dart';
import '../../shared/widgets/app_button.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_dialog.dart';
import '../../shared/widgets/app_modal_sheet.dart';
import '../../shared/widgets/app_pill.dart';
import '../../shared/widgets/interaction_hotspot_card.dart';
import '../../shared/widgets/npc_dialogue_modal.dart';
import '../../shared/widgets/puzzle_interaction_dialog.dart';

class ExplorationView extends StatefulWidget {
  const ExplorationView({Key? key}) : super(key: key);

  @override
  State<ExplorationView> createState() => _ExplorationViewState();
}

class _ExplorationViewState extends State<ExplorationView> {
  MobileInteractionType _mapType(InteractionType type) {
    switch (type) {
      case InteractionType.inspect:
        return MobileInteractionType.tapInspect;
      case InteractionType.read:
        return MobileInteractionType.readDocument;
      case InteractionType.unlock:
        return MobileInteractionType.unlockMechanism;
      case InteractionType.pickup:
        return MobileInteractionType.pickupItem;
      case InteractionType.talk:
        return MobileInteractionType.holdHighlight;
    }
  }

  void _showEndingStatusModal(BuildContext context) {
    final endingService = Provider.of<EndingService>(context, listen: false);
    final allEndings = endingService.getAllEndings();

    AppModalSheet.show(
      context: context,
      title: 'ENDINGS & ESCAPE CONDITIONS',
      subtitle: 'Ending eligibility derived from accumulated knowledge, clues, and actions.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: allEndings.map((ending) {
          final isReachable = endingService.getReachableEnding()?.id == ending.id;
          final unmet = endingService.explainUnmetConditions(ending.id);

          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child: AppCard(
              borderColor: isReachable
                  ? AppColors.accentGold
                  : ending.isEnabledForMvp
                      ? AppColors.lineBorder
                      : AppColors.textMuted.withOpacity(0.3),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(ending.title, style: AppTypography.h3),
                      AppPill(
                        label: isReachable
                            ? 'READY'
                            : ending.isEnabledForMvp
                                ? 'LOCKED'
                                : 'NON-MVP',
                        colorScheme: isReachable
                            ? AppPillColor.gold
                            : ending.isEnabledForMvp
                                ? AppPillColor.purple
                                : AppPillColor.cyan,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(ending.description, style: AppTypography.bodySmall),
                  if (unmet.isNotEmpty) ...[
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Prerequisites remaining:',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.accentPurpleLight),
                    ),
                    ...unmet.map((cond) => Text('• $cond', style: AppTypography.bodySmall)),
                  ],
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _handleGameInteraction(BuildContext context, LocationInteraction locInter, String locId) async {
    final interactionService = Provider.of<InteractionService>(context, listen: false);

    final gameInter = GameInteraction(
      id: locInter.id,
      targetLocationId: locId,
      title: locInter.title,
      description: locInter.description,
      interactionType: _mapType(locInter.type),
      condition: InteractionCondition(
        requiredLocationId: locId,
        requiredCodeUnlocked: locInter.requiredKeyId,
        requiredItemInInventory: locInter.itemToPickup == null ? locInter.requiredKeyId : null,
      ),
      clueIdToUnlock: locInter.clueIdToUnlock,
      codeIdToUnlock: locInter.codeIdToUnlock,
      itemToPickup: locInter.itemToPickup,
    );

    final result = await interactionService.executeInteraction(gameInter);

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (_) => AppDialog(
        title: result.success ? 'KNOWLEDGE DISCOVERED' : 'INTERACTION FAILED',
        content: result.success ? result.feedbackMessage : 'LOCKED: ${result.failureReason}',
        primaryButtonText: result.success ? 'RECORD TO KNOWLEDGE BOARD' : 'UNDERSTOOD',
        onPrimaryPressed: () => Navigator.of(context).pop(),
      ),
    );
  }

  void _handlePuzzleInteraction(BuildContext context, GamePuzzle puzzle) {
    final puzzleService = Provider.of<PuzzleService>(context, listen: false);
    final reqError = puzzleService.checkPrerequisites(puzzle);

    if (reqError != null) {
      showDialog(
        context: context,
        builder: (_) => AppDialog(
          title: 'PUZZLE LOCKED',
          content: reqError,
          primaryButtonText: 'BACK',
          onPrimaryPressed: () => Navigator.of(context).pop(),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (_) => PuzzleInteractionDialog(
        puzzle: puzzle,
        onSubmitSolution: (solution) async {
          final result = await puzzleService.attemptPuzzle(puzzle.id, solution);
          if (!mounted) return;

          showDialog(
            context: context,
            builder: (_) => AppDialog(
              title: result.success ? 'PUZZLE SOLVED' : 'PUZZLE FAILED',
              content: result.success ? result.feedbackMessage : 'ERROR: ${result.failureReason}',
              primaryButtonText: result.success ? 'UPDATE KNOWLEDGE BOARD' : 'TRY AGAIN',
              onPrimaryPressed: () => Navigator.of(context).pop(),
            ),
          );
        },
      ),
    );
  }

  void _handleNavigation(BuildContext context, HotelLocation destination) async {
    final explorationService = Provider.of<ExplorationService>(context, listen: false);

    if (!explorationService.canEnterLocation(destination)) {
      showDialog(
        context: context,
        builder: (_) => AppDialog(
          title: 'LOCATION LOCKED',
          content: 'The door to ${destination.name} is locked.\nRequired Key / Code: ${destination.requiredKeyOrCodeId ?? 'Unknown'}',
          primaryButtonText: 'BACK',
          onPrimaryPressed: () => Navigator.of(context).pop(),
        ),
      );
      return;
    }

    await explorationService.moveToLocation(destination.id);
  }

  @override
  Widget build(BuildContext context) {
    final explorationService = Provider.of<ExplorationService>(context, listen: true);
    final interactionService = Provider.of<InteractionService>(context, listen: true);
    final puzzleService = Provider.of<PuzzleService>(context, listen: true);
    final npcService = Provider.of<NpcService>(context, listen: true);
    final endingService = Provider.of<EndingService>(context, listen: true);

    final currentLoc = explorationService.currentLocation;
    final connectedLocs = explorationService.connectedLocations;
    final roomPuzzles = PuzzleRepository.getPuzzlesForLocation(currentLoc.id);
    final roomNpcs = npcService.getNpcsInLocation(currentLoc.id);
    final reachableEnding = endingService.getReachableEnding();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // --- CURRENT ROOM HEADER CARD ---
          AppCard(
            borderColor: AppColors.accentGold.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    AppPill(
                      label: currentLoc.areaTag,
                      icon: currentLoc.icon,
                      colorScheme: AppPillColor.gold,
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.stars_outlined, color: AppColors.accentGold, size: 20),
                          tooltip: 'Ending Requirements',
                          onPressed: () => _showEndingStatusModal(context),
                        ),
                        const AppPill(
                          label: 'ACTIVE EXPLORATION',
                          colorScheme: AppPillColor.cyan,
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Text(currentLoc.name, style: AppTypography.h1),
                const SizedBox(height: AppSpacing.xs),
                Text(currentLoc.description, style: AppTypography.bodyMedium),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // --- REACHABLE ENDING PROMPT ---
          if (reachableEnding != null) ...[
            AppCard(
              borderColor: AppColors.accentGold,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.flight_takeoff_rounded, color: AppColors.accentGold),
                          SizedBox(width: AppSpacing.xs),
                          Text('TEMPORAL RESOLUTION', style: AppTypography.h3),
                        ],
                      ),
                      const AppPill(label: 'ENDING READY', colorScheme: AppPillColor.gold),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'You have accumulated all required knowledge and prerequisites to trigger: ${reachableEnding.title}.',
                    style: AppTypography.bodyMedium,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  AppButton(
                    label: 'TRIGGER ENDING — ${reachableEnding.title.toUpperCase()}',
                    icon: Icons.check_circle_rounded,
                    variant: AppButtonVariant.primary,
                    onPressed: () async {
                      await endingService.completeEnding(reachableEnding.id);
                      if (mounted) {
                        Navigator.of(context).pushReplacementNamed(AppRoutes.ending);
                      }
                    },
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
          ],

          // --- PRESENT NPCS IN ROOM ---
          if (roomNpcs.isNotEmpty) ...[
            const Text('PRESENT NPCS IN ROOM', style: AppTypography.h3),
            const SizedBox(height: AppSpacing.sm),
            ...roomNpcs.map((npc) {
              final scheduleEvent = npcService.getCurrentScheduleEvent(npc)!;
              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: AppCard(
                  borderColor: AppColors.accentGold,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(npc.icon, color: AppColors.accentGold),
                              const SizedBox(width: AppSpacing.xs),
                              Text(npc.name, style: AppTypography.h3),
                            ],
                          ),
                          const AppPill(label: 'TIMELINE SCHEDULED', colorScheme: AppPillColor.gold),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(scheduleEvent.statusDescription, style: AppTypography.bodySmall),
                      const SizedBox(height: AppSpacing.md),
                      AppButton(
                        label: 'TALK / INTERACT',
                        icon: Icons.forum_rounded,
                        variant: AppButtonVariant.primary,
                        onPressed: () => NpcDialogueModal.show(context, npc, scheduleEvent),
                        width: double.infinity,
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: AppSpacing.lg),
          ],

          // --- ROOM PUZZLE MECHANISMS ---
          if (roomPuzzles.isNotEmpty) ...[
            const Text('ROOM PUZZLE MECHANISMS', style: AppTypography.h3),
            const SizedBox(height: AppSpacing.sm),
            ...roomPuzzles.map((puzzle) {
              final isSolved = puzzleService.isPuzzleSolved(puzzle.id);
              final reqError = puzzleService.checkPrerequisites(puzzle);
              final isAvailable = !isSolved && reqError == null;

              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: AppCard(
                  borderColor: isSolved
                      ? AppColors.good
                      : isAvailable
                          ? AppColors.accentGold
                          : AppColors.lineBorder,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.extension_outlined, color: AppColors.accentGold),
                              SizedBox(width: AppSpacing.xs),
                              Text('MAIN PUZZLE', style: AppTypography.bodySmall),
                            ],
                          ),
                          AppPill(
                            label: isSolved ? 'SOLVED' : (isAvailable ? 'AVAILABLE' : 'LOCKED'),
                            colorScheme: isSolved
                                ? AppPillColor.good
                                : (isAvailable ? AppPillColor.gold : AppPillColor.danger),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Text(puzzle.title, style: AppTypography.h3),
                      const SizedBox(height: 2),
                      Text(puzzle.description, style: AppTypography.bodySmall),
                      const SizedBox(height: AppSpacing.md),
                      AppButton(
                        label: isSolved ? 'MECHANISM UNLOCKED' : 'ENGAGE PUZZLE',
                        icon: isSolved ? Icons.check_circle_rounded : Icons.lock_open_rounded,
                        variant: isSolved ? AppButtonVariant.secondary : AppButtonVariant.primary,
                        onPressed: isSolved ? null : () => _handlePuzzleInteraction(context, puzzle),
                        width: double.infinity,
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: AppSpacing.lg),
          ],

          // --- ROOM INTERACTION HOTSPOTS ---
          const Text('ROOM INTERACTIONS & HOTSPOTS', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          if (currentLoc.interactions.isEmpty)
            const AppCard(
              child: Text('No active interactions remaining in this room.', style: AppTypography.bodySmall),
            )
          else
            ...currentLoc.interactions.map((locInter) {
              final gameInter = GameInteraction(
                id: locInter.id,
                targetLocationId: currentLoc.id,
                title: locInter.title,
                description: locInter.description,
                interactionType: _mapType(locInter.type),
                condition: InteractionCondition(
                  requiredLocationId: currentLoc.id,
                  requiredCodeUnlocked: locInter.requiredKeyId,
                  requiredItemInInventory: locInter.itemToPickup == null ? locInter.requiredKeyId : null,
                ),
              );
              final availability = interactionService.checkAvailability(gameInter.condition);

              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: InteractionHotspotCard(
                  interaction: gameInter,
                  availability: availability,
                  onExecute: () => _handleGameInteraction(context, locInter, currentLoc.id),
                ),
              );
            }),
          const SizedBox(height: AppSpacing.lg),

          // --- CONNECTED ROOM NAVIGATION ---
          const Text('CONNECTED ROOM ACCESSIBILITY', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          ...connectedLocs.map((dest) {
            final isUnlocked = explorationService.canEnterLocation(dest);
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: AppCard(
                borderColor: isUnlocked ? AppColors.lineBorder : AppColors.danger.withOpacity(0.5),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(dest.icon, color: isUnlocked ? AppColors.textPrimary : AppColors.textMuted),
                        const SizedBox(width: AppSpacing.md),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(dest.name, style: AppTypography.h3),
                            Text(dest.areaTag, style: AppTypography.bodySmall),
                          ],
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        AppPill(
                          label: isUnlocked ? 'OPEN' : 'LOCKED',
                          colorScheme: isUnlocked ? AppPillColor.good : AppPillColor.danger,
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        AppButton(
                          label: 'ENTER',
                          icon: Icons.east_rounded,
                          variant: isUnlocked ? AppButtonVariant.secondary : AppButtonVariant.ghost,
                          onPressed: () => _handleNavigation(context, dest),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
