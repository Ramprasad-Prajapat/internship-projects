// lib/app/app_shell.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/models/timeline_event.dart';
import '../core/repositories/clue_repository.dart';
import '../core/repositories/item_repository.dart';
import '../core/services/game_service.dart';
import '../core/services/inventory_service.dart';
import '../core/services/knowledge_service.dart';
import '../core/services/time_loop_service.dart';
import '../features/exploration/exploration_view.dart';
import '../shared/design/app_colors.dart';
import '../shared/design/app_spacing.dart';
import '../shared/design/app_typography.dart';
import '../shared/widgets/app_button.dart';
import '../shared/widgets/app_card.dart';
import '../shared/widgets/app_countdown_clock.dart';
import '../shared/widgets/app_dialog.dart';
import '../shared/widgets/app_knowledge_card.dart';
import '../shared/widgets/app_modal_sheet.dart';
import '../shared/widgets/app_pill.dart';
import '../shared/widgets/app_timeline_bar.dart';
import '../shared/widgets/hint_modal.dart';
import '../core/services/feedback_service.dart';
import '../shared/widgets/settings_modal.dart';
import 'app_config.dart';
import 'app_router.dart';

class AppShell extends StatefulWidget {
  final Widget? body;

  const AppShell({Key? key, this.body}) : super(key: key);

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> with WidgetsBindingObserver {
  bool _wasPausedByLifecycle = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final loopService = Provider.of<TimeLoopService>(context, listen: false);
      if (!loopService.isRunning) {
        loopService.startLoopTimer();
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      if (loopService.isRunning && !loopService.isPaused) {
        _wasPausedByLifecycle = true;
        loopService.pauseLoopTimer();
      }
    } else if (state == AppLifecycleState.resumed) {
      if (_wasPausedByLifecycle) {
        _wasPausedByLifecycle = false;
        loopService.resumeLoopTimer();
      }
    }
  }

  void _openKnowledgeBoard(BuildContext context) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    final knowledgeService = Provider.of<KnowledgeService>(context, listen: false);

    // Fallback baseline facts if non-discovered
    final cluesToDisplay = knowledgeService.discoveredClues.isNotEmpty
        ? knowledgeService.discoveredClues
        : [
            ClueRepository.getClueById('clue_frozen_clock')!,
            ClueRepository.getClueById('clue_guest_register_dates')!,
          ];

    AppModalSheet.show(
      context: context,
      title: 'KNOWLEDGE BOARD',
      subtitle: 'Discovered facts (${cluesToDisplay.length}) persist across loop resets.',
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
    ).then((_) {
      if (mounted) loopService.resumeLoopTimer();
    });
  }

  void _openQuickInventory(BuildContext context) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    final inventoryService = Provider.of<InventoryService>(context, listen: false);
    final anchored = inventoryService.anchoredItem ?? ItemRepository.getItemById('brass_master_key')!;
    final physicalList = inventoryService.physicalItems.isNotEmpty
        ? inventoryService.physicalItems
        : [ItemRepository.getItemById('caretaker_note')!];

    AppModalSheet.show(
      context: context,
      title: 'INVENTORY & TIMELINE ANCHOR',
      subtitle: 'Physical items (${physicalList.length}) reset at 12:00. Anchored item survives.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('ANCHORED ITEM (PERSISTENT)', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          AppCard(
            borderColor: AppColors.accentGold,
            child: Row(
              children: [
                Icon(anchored.icon, color: AppColors.accentGold, size: 28),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(anchored.name, style: AppTypography.h3),
                      const SizedBox(height: 2),
                      Text(anchored.description, style: AppTypography.bodySmall),
                    ],
                  ),
                ),
                const AppPill(label: 'ANCHORED', colorScheme: AppPillColor.gold),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          const Text('PHYSICAL ITEMS (RESETS AT 12:00)', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          ...physicalList.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: AppCard(
                borderColor: AppColors.lineBorder,
                child: Row(
                  children: [
                    Icon(item.icon, color: AppColors.textSecondary, size: 24),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.name, style: AppTypography.h3),
                          Text(item.description, style: AppTypography.bodySmall),
                        ],
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    if (item.id != anchored.id)
                      AppButton(
                        label: 'ANCHOR',
                        variant: AppButtonVariant.secondary,
                        onPressed: () async {
                          await inventoryService.setTimelineAnchor(item.id);
                          if (mounted) Navigator.of(context).pop();
                        },
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    ).then((_) {
      if (mounted) loopService.resumeLoopTimer();
    });
  }

  void _openPauseDialog(BuildContext context) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    showDialog(
      context: context,
      builder: (_) => AppDialog(
        title: 'GAME PAUSED',
        content: 'Reading notes and navigating shell controls pauses the 5-minute loop.',
        primaryButtonText: 'RESUME',
        onPrimaryPressed: () => Navigator.of(context).pop(),
        secondaryButtonText: 'QUIT TO MENU',
        onSecondaryPressed: () {
          loopService.stopLoopTimer();
          Navigator.of(context).pop();
          Navigator.of(context).pushReplacementNamed(AppRoutes.home);
        },
      ),
    ).then((_) {
      if (mounted) loopService.resumeLoopTimer();
    });
  }

  Future<bool> _onWillPop() async {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    final shouldQuit = await showDialog<bool>(
      context: context,
      builder: (_) => AppDialog(
        title: 'EXIT CURRENT LOOP?',
        content: 'Leaving the active loop will save persistent knowledge board progress, but reset physical room state.',
        primaryButtonText: 'REMAIN IN LOOP',
        onPrimaryPressed: () => Navigator.of(context).pop(false),
        secondaryButtonText: 'EXIT TO MENU',
        onSecondaryPressed: () => Navigator.of(context).pop(true),
      ),
    );

    if (shouldQuit == true) {
      loopService.stopLoopTimer();
      return true;
    } else {
      if (mounted) loopService.resumeLoopTimer();
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final gameService = Provider.of<GameService>(context, listen: true);
    final loopService = Provider.of<TimeLoopService>(context, listen: true);
    final currentState = gameService.currentState;

    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Column(
            children: [
              // --- TOP HUD BAR ---
              Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: const BoxDecoration(
                  color: AppColors.panel,
                  border: Border(bottom: BorderSide(color: AppColors.lineBorder)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Loop Count Indicator
                        AppPill(
                          label: 'LOOP #${currentState.currentLoopNumber}',
                          icon: Icons.loop,
                          colorScheme: AppPillColor.gold,
                        ),
                        // HUD Timer Component
                        AppCountdownClock(
                          elapsedSeconds: currentState.elapsedLoopSeconds,
                          totalLoopSeconds: AppConfig.targetLoopDurationSeconds,
                        ),
                        // Action Buttons
                        Row(
                          children: [
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                              icon: const Icon(Icons.lightbulb_outline_rounded, color: AppColors.accentCyan),
                              tooltip: 'Hints',
                              onPressed: () {
                                Provider.of<FeedbackService>(context, listen: false).playHintOpened();
                                HintModal.show(context);
                              },
                            ),
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                              icon: const Icon(Icons.menu_book_rounded, color: AppColors.accentPurpleLight),
                              tooltip: 'Knowledge Board',
                              onPressed: () {
                                Provider.of<FeedbackService>(context, listen: false).playButtonPressed();
                                _openKnowledgeBoard(context);
                              },
                            ),
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                              icon: const Icon(Icons.work_outline_rounded, color: AppColors.accentGold),
                              tooltip: 'Inventory',
                              onPressed: () {
                                Provider.of<FeedbackService>(context, listen: false).playButtonPressed();
                                _openQuickInventory(context);
                              },
                            ),
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                              icon: const Icon(Icons.tune_rounded, color: AppColors.textSecondary),
                              tooltip: 'Settings & Accessibility',
                              onPressed: () {
                                Provider.of<FeedbackService>(context, listen: false).playButtonPressed();
                                SettingsModal.show(context);
                              },
                            ),
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                              icon: const Icon(Icons.pause_circle_outline_rounded, color: AppColors.textPrimary),
                              tooltip: 'Pause',
                              onPressed: () {
                                Provider.of<FeedbackService>(context, listen: false).playButtonPressed();
                                _openPauseDialog(context);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    // Stage Header & Timeline Progress Bar Component
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          loopService.currentStage.displayName,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                            color: loopService.currentStage.color,
                          ),
                        ),
                        Text(
                          '${loopService.remainingSeconds}s REMAINING',
                          style: AppTypography.bodySmall,
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    AppTimelineBar(
                      elapsedSeconds: currentState.elapsedLoopSeconds,
                      totalLoopSeconds: AppConfig.targetLoopDurationSeconds,
                    ),
                  ],
                ),
              ),

              // --- MAIN SHELL CONTENT AREA ---
              Expanded(
                child: widget.body ?? const ExplorationView(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
