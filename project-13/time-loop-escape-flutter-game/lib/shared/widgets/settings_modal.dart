// lib/shared/widgets/settings_modal.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/feedback_service.dart';
import '../../core/services/preferences_service.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';
import 'app_card.dart';
import 'app_modal_sheet.dart';

/// Production Settings & Accessibility Preferences Modal.
/// Provides independent toggles for audio channels, haptic feedback, subtitles, and reduced motion.
class SettingsModal extends StatelessWidget {
  const SettingsModal({Key? key}) : super(key: key);

  static void show(BuildContext context) {
    AppModalSheet.show(
      context: context,
      title: 'SETTINGS & ACCESSIBILITY',
      subtitle: 'Customize audio, haptics, subtitles, and motion preferences.',
      child: const SettingsModal(),
    );
  }

  Widget _buildToggleRow(
    BuildContext context, {
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required String semanticLabel,
  }) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Semantics(
        label: semanticLabel,
        toggled: value,
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTypography.h3),
                  const SizedBox(height: 2),
                  Text(subtitle, style: AppTypography.bodySmall),
                ],
              ),
            ),
            ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
              child: Switch(
                value: value,
                activeColor: AppColors.accentGold,
                activeTrackColor: AppColors.accentGold.withOpacity(0.3),
                inactiveThumbColor: AppColors.textMuted,
                inactiveTrackColor: AppColors.panel,
                onChanged: (val) {
                  onChanged(val);
                  final feedback = Provider.of<FeedbackService>(context, listen: false);
                  feedback.playButtonPressed();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final prefService = Provider.of<PreferencesService>(context, listen: true);
    final prefs = prefService.preferences;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('AUDIO CONTROL', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Master Audio',
            subtitle: 'Enable or disable all game audio output',
            value: prefs.masterAudioEnabled,
            onChanged: (val) => prefService.setMasterAudioEnabled(val),
            semanticLabel: 'Master Audio toggle, currently ${prefs.masterAudioEnabled ? "enabled" : "disabled"}',
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Ambient Atmosphere',
            subtitle: 'Hotel background soundscape & 11:57 clock ambience',
            value: prefs.ambientEnabled,
            onChanged: (val) => prefService.setAmbientEnabled(val),
            semanticLabel: 'Ambient atmosphere toggle',
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Sound Effects (SFX)',
            subtitle: 'Puzzle solved, clue discovered, & UI tap feedback',
            value: prefs.effectsEnabled,
            onChanged: (val) => prefService.setEffectsEnabled(val),
            semanticLabel: 'Sound effects toggle',
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Ending Music',
            subtitle: 'Cinematic music tracks during milestone endings',
            value: prefs.musicEnabled,
            onChanged: (val) => prefService.setMusicEnabled(val),
            semanticLabel: 'Ending music toggle',
          ),
          const SizedBox(height: AppSpacing.lg),
          const Text('FEEDBACK & HAPTICS', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Haptic Vibration',
            subtitle: 'Tactile vibration cues for taps, clues, & loop warnings',
            value: prefs.hapticsEnabled,
            onChanged: (val) => prefService.setHapticsEnabled(val),
            semanticLabel: 'Haptic vibration toggle',
          ),
          const SizedBox(height: AppSpacing.lg),
          const Text('ACCESSIBILITY', style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Subtitles & Visual Cues',
            subtitle: 'Display text alternatives for audio cues & dialogue',
            value: prefs.subtitlesEnabled,
            onChanged: (val) => prefService.setSubtitlesEnabled(val),
            semanticLabel: 'Subtitles and visual cues toggle',
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildToggleRow(
            context,
            title: 'Reduced Motion',
            subtitle: 'Minimize pulsing lights, disorienting effects, & fast transitions',
            value: prefs.reducedMotion,
            onChanged: (val) => prefService.setReducedMotion(val),
            semanticLabel: 'Reduced motion toggle',
          ),
          const SizedBox(height: AppSpacing.xl),
          AppButton(
            label: 'RESTORE DEFAULT PREFERENCES',
            variant: AppButtonVariant.secondary,
            onPressed: () async {
              await prefService.resetToDefaults();
            },
            width: double.infinity,
          ),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            label: 'CLOSE SETTINGS',
            variant: AppButtonVariant.primary,
            onPressed: () => Navigator.of(context).pop(),
            width: double.infinity,
          ),
        ],
      ),
    );
  }
}
