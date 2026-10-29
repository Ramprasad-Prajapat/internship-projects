// lib/features/home/home_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_config.dart';
import '../../app/app_router.dart';
import '../../core/services/game_service.dart';
import '../../shared/design/app_colors.dart';
import '../../shared/design/app_spacing.dart';
import '../../shared/design/app_typography.dart';
import '../../shared/widgets/app_button.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_dialog.dart';
import '../../shared/widgets/app_modal_sheet.dart';
import '../../shared/widgets/app_pill.dart';
import '../../shared/widgets/settings_modal.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isLoading = false;

  Future<void> _handleNewGame(BuildContext context) async {
    final gameService = Provider.of<GameService>(context, listen: false);
    final hasSave = await gameService.hasSavedGame();

    if (hasSave && mounted) {
      final confirm = await showDialog<bool>(
        context: context,
        builder: (_) => AppDialog(
          title: 'START NEW CHECK-IN?',
          content: 'An active temporal loop save exists on this device. Starting a new check-in will overwrite your progress.',
          primaryButtonText: 'OVERWRITE & START',
          onPrimaryPressed: () => Navigator.of(context).pop(true),
          secondaryButtonText: 'CANCEL',
          onSecondaryPressed: () => Navigator.of(context).pop(false),
        ),
      );
      if (confirm != true) return;
    }

    setState(() => _isLoading = true);
    await gameService.startNewGame();
    setState(() => _isLoading = false);
    if (mounted) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.game);
    }
  }

  Future<void> _handleContinueGame(BuildContext context) async {
    setState(() => _isLoading = true);
    final gameService = Provider.of<GameService>(context, listen: false);
    final hasSave = await gameService.loadSavedGame();
    setState(() => _isLoading = false);

    if (!mounted) return;

    if (hasSave) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.game);
    } else {
      showDialog(
        context: context,
        builder: (_) => AppDialog(
          title: 'NO SAVED CHECK-IN FOUND',
          content: 'No previous temporal loop save data exists on this device. Start a new check-in to enter the hotel.',
          primaryButtonText: 'START NEW CHECK-IN',
          onPrimaryPressed: () {
            Navigator.of(context).pop();
            _handleNewGame(context);
          },
          secondaryButtonText: 'BACK',
          onSecondaryPressed: () => Navigator.of(context).pop(),
        ),
      );
    }
  }

  void _showCaseBrief(BuildContext context) {
    AppModalSheet.show(
      context: context,
      title: 'INVESTIGATION BRIEF & LOOP RULES',
      subtitle: 'Read the hotel rules before entering Room 11:57.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppPill(label: 'THE RESET RULE', colorScheme: AppPillColor.gold),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'All hotel clocks collapse at 12:00 midnight. The physical world, opened doors, and NPC positions return to 11:57 PM.',
            style: AppTypography.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.lg),
          const AppPill(label: 'KNOWLEDGE RETENTION', colorScheme: AppPillColor.purple),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Discovered notes, codes, dialogue options, and timeline events are permanently recorded in your Knowledge Board and survive every reset.',
            style: AppTypography.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.lg),
          const AppPill(label: 'TIMELINE ANCHOR', colorScheme: AppPillColor.cyan),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'One physical object can be anchored using the mid-game anchor device to bypass temporal restoration.',
            style: AppTypography.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.lg),
          AppButton(
            label: 'UNDERSTOOD',
            onPressed: () => Navigator.of(context).pop(),
            width: double.infinity,
          ),
        ],
      ),
    );
  }

  void _showSettingsModal(BuildContext context) {
    SettingsModal.show(context);
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AppDialog(
        title: 'ABOUT THE GAME',
        content: '${AppConfig.appTitle}\nVersion ${AppConfig.appVersion}\n\nA cinematic mobile mystery adventure set in a Rajasthan heritage hotel trapped in a 5-minute temporal reset.\n\nArchitected offline-first using pure local storage abstractions.',
        primaryButtonText: 'CLOSE',
        onPrimaryPressed: () => Navigator.of(context).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // --- HERO TITLE CONTAINER ---
                  const AppPill(
                    label: 'OFFLINE MYSTERY ADVENTURE',
                    icon: Icons.lock_clock,
                    colorScheme: AppPillColor.gold,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Text(
                    '11:57',
                    style: AppTypography.heroClock,
                  ),
                  const Text(
                    'THE LAST CHECK-IN',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 4.0,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    AppConfig.appTitle,
                    style: AppTypography.bodySmall,
                  ),
                  const SizedBox(height: AppSpacing.xxl),

                  // --- ENTRY ACTIONS CARD ---
                  AppCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        AppButton(
                          label: 'NEW CHECK-IN (NEW GAME)',
                          icon: Icons.play_arrow_rounded,
                          variant: AppButtonVariant.primary,
                          isLoading: _isLoading,
                          onPressed: () => _handleNewGame(context),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        AppButton(
                          label: 'CONTINUE INVESTIGATION',
                          icon: Icons.restore_rounded,
                          variant: AppButtonVariant.secondary,
                          isLoading: _isLoading,
                          onPressed: () => _handleContinueGame(context),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        AppButton(
                          label: 'INVESTIGATION BRIEF & RULES',
                          icon: Icons.menu_book_rounded,
                          variant: AppButtonVariant.ghost,
                          onPressed: () => _showCaseBrief(context),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        AppButton(
                          label: 'SETTINGS & PREFERENCES',
                          icon: Icons.tune_rounded,
                          variant: AppButtonVariant.ghost,
                          onPressed: () => _showSettingsModal(context),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // --- FOOTER ABOUT ACTION ---
                  TextButton.icon(
                    onPressed: () => _showAboutDialog(context),
                    icon: const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.textMuted),
                    label: Text(
                      'v${AppConfig.appVersion} — Heritage Hotel Kalchakra',
                      style: AppTypography.bodySmall,
                    ),
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
