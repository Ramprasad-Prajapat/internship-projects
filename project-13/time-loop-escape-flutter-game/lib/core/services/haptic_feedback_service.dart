// lib/core/services/haptic_feedback_service.dart
import 'package:flutter/services.dart';
import 'preferences_service.dart';

/// Centralized service encapsulating tactile and haptic feedback.
/// Decoupled from low-level platform APIs and controlled by user preferences.
class HapticFeedbackService {
  final PreferencesService _preferencesService;

  HapticFeedbackService(this._preferencesService);

  bool get _isHapticsEnabled => _preferencesService.hapticsEnabled;

  /// Light tap for standard UI button presses and interactions.
  Future<void> lightTap() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.lightImpact();
    } catch (_) {}
  }

  /// Medium impact for state toggles, item anchoring, or key interactions.
  Future<void> mediumImpact() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  /// Strong impact for temporal resets, collapse, or major milestones.
  Future<void> strongImpact() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  /// Success vibration for puzzle solutions, clue discoveries, or ending unlocks.
  Future<void> success() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.vibrate();
    } catch (_) {}
  }

  /// Warning vibration for critical time warnings or low-time alerts.
  Future<void> warning() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  /// Error vibration for locked doors, incorrect puzzle codes, or failed attempts.
  Future<void> error() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.vibrate();
    } catch (_) {}
  }

  /// Selection click for tab switching, dialogue option scrolling, or list selections.
  Future<void> selection() async {
    if (!_isHapticsEnabled) return;
    try {
      await HapticFeedback.selectionClick();
    } catch (_) {}
  }
}
