// lib/core/services/feedback_service.dart
import 'dart:async';
import 'audio_service.dart';
import 'haptic_feedback_service.dart';

/// Feedback Coordinator pairing audio cues with tactile/haptic feedback.
/// Enforces duplicate event protection to prevent audio/vibration spam during widget rebuilds.
class FeedbackService {
  final AudioService _audioService;
  final HapticFeedbackService _hapticService;

  final Map<SemanticSoundEvent, DateTime> _lastTriggerTimes = {};
  static const Duration _defaultDebounceDuration = Duration(milliseconds: 250);
  static const Duration _warningDebounceDuration = Duration(milliseconds: 2000);

  FeedbackService(this._audioService, this._hapticService);

  bool _isDuplicate(SemanticSoundEvent event, {Duration? customDebounce}) {
    final now = DateTime.now();
    final lastTime = _lastTriggerTimes[event];
    final debounce = customDebounce ?? _defaultDebounceDuration;

    if (lastTime != null && now.difference(lastTime) < debounce) {
      return true;
    }
    _lastTriggerTimes[event] = now;
    return false;
  }

  Future<void> playButtonPressed() async {
    if (_isDuplicate(SemanticSoundEvent.buttonPressed)) return;
    await _audioService.playEvent(SemanticSoundEvent.buttonPressed);
    await _hapticService.lightTap();
  }

  Future<void> playLocationEntered() async {
    if (_isDuplicate(SemanticSoundEvent.locationEntered)) return;
    await _audioService.playEvent(SemanticSoundEvent.locationEntered);
  }

  Future<void> playObjectInspected() async {
    if (_isDuplicate(SemanticSoundEvent.objectInspected)) return;
    await _audioService.playEvent(SemanticSoundEvent.objectInspected);
    await _hapticService.lightTap();
  }

  Future<void> playItemPickedUp() async {
    if (_isDuplicate(SemanticSoundEvent.itemPickedUp)) return;
    await _audioService.playEvent(SemanticSoundEvent.itemPickedUp);
    await _hapticService.lightTap();
  }

  Future<void> playItemAnchored() async {
    if (_isDuplicate(SemanticSoundEvent.itemAnchored)) return;
    await _audioService.playEvent(SemanticSoundEvent.itemAnchored);
    await _hapticService.mediumImpact();
  }

  Future<void> playClueDiscovered() async {
    if (_isDuplicate(SemanticSoundEvent.clueDiscovered)) return;
    await _audioService.playEvent(SemanticSoundEvent.clueDiscovered);
    await _hapticService.success();
  }

  Future<void> playKnowledgeConfirmed() async {
    if (_isDuplicate(SemanticSoundEvent.knowledgeConfirmed)) return;
    await _audioService.playEvent(SemanticSoundEvent.knowledgeConfirmed);
    await _hapticService.mediumImpact();
  }

  Future<void> playPuzzleOpened() async {
    if (_isDuplicate(SemanticSoundEvent.puzzleOpened)) return;
    await _audioService.playEvent(SemanticSoundEvent.puzzleOpened);
    await _hapticService.lightTap();
  }

  Future<void> playPuzzleSolved() async {
    if (_isDuplicate(SemanticSoundEvent.puzzleCorrect)) return;
    await _audioService.playEvent(SemanticSoundEvent.puzzleCorrect);
    await _hapticService.success();
  }

  Future<void> playPuzzleFailed() async {
    if (_isDuplicate(SemanticSoundEvent.puzzleIncorrect)) return;
    await _audioService.playEvent(SemanticSoundEvent.puzzleIncorrect);
    await _hapticService.error();
  }

  Future<void> playMechanismUnlocked() async {
    if (_isDuplicate(SemanticSoundEvent.mechanismUnlocked)) return;
    await _audioService.playEvent(SemanticSoundEvent.mechanismUnlocked);
    await _hapticService.success();
  }

  Future<void> playMechanismLocked() async {
    if (_isDuplicate(SemanticSoundEvent.mechanismLocked)) return;
    await _audioService.playEvent(SemanticSoundEvent.mechanismLocked);
    await _hapticService.error();
  }

  Future<void> playDialogueOpened() async {
    if (_isDuplicate(SemanticSoundEvent.dialogueOpened)) return;
    await _audioService.playEvent(SemanticSoundEvent.dialogueOpened);
    await _hapticService.lightTap();
  }

  Future<void> playDialogueUnlocked() async {
    if (_isDuplicate(SemanticSoundEvent.dialogueTopicUnlocked)) return;
    await _audioService.playEvent(SemanticSoundEvent.dialogueTopicUnlocked);
    await _hapticService.success();
  }

  Future<void> playHintOpened() async {
    if (_isDuplicate(SemanticSoundEvent.hintOpened)) return;
    await _audioService.playEvent(SemanticSoundEvent.hintOpened);
    await _hapticService.lightTap();
  }

  Future<void> playHintRevealed() async {
    if (_isDuplicate(SemanticSoundEvent.hintRevealed)) return;
    await _audioService.playEvent(SemanticSoundEvent.hintRevealed);
    await _hapticService.mediumImpact();
  }

  Future<void> playStageChanged() async {
    if (_isDuplicate(SemanticSoundEvent.stageChanged)) return;
    await _audioService.playEvent(SemanticSoundEvent.stageChanged);
    await _hapticService.mediumImpact();
  }

  Future<void> playCriticalWarning() async {
    if (_isDuplicate(SemanticSoundEvent.criticalTimeWarning, customDebounce: _warningDebounceDuration)) return;
    await _audioService.playEvent(SemanticSoundEvent.criticalTimeWarning);
    await _hapticService.warning();
  }

  Future<void> playLoopReset() async {
    if (_isDuplicate(SemanticSoundEvent.loopReset)) return;
    await _audioService.playEvent(SemanticSoundEvent.loopReset);
    await _hapticService.strongImpact();
  }

  Future<void> playEndingUnlocked() async {
    if (_isDuplicate(SemanticSoundEvent.endingUnlocked)) return;
    await _audioService.playEvent(SemanticSoundEvent.endingUnlocked);
    await _hapticService.success();
  }

  Future<void> playEndingCompleted() async {
    if (_isDuplicate(SemanticSoundEvent.endingCompleted)) return;
    await _audioService.playEvent(SemanticSoundEvent.endingCompleted);
    await _hapticService.success();
  }
}
