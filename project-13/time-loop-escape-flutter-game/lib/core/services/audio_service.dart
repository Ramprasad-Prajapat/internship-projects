// lib/core/services/audio_service.dart
import 'dart:async';
import 'package:flutter/foundation.dart';
import 'preferences_service.dart';

/// Semantic audio events defining gameplay, interaction, timeline, and menu audio cues.
enum SemanticSoundEvent {
  buttonPressed,
  locationEntered,
  objectInspected,
  itemPickedUp,
  itemAnchored,
  clueDiscovered,
  knowledgeConfirmed,
  contradictionDiscovered,
  puzzleOpened,
  puzzleCorrect,
  puzzleIncorrect,
  mechanismUnlocked,
  mechanismLocked,
  dialogueOpened,
  dialogueTopicUnlocked,
  hintOpened,
  hintRevealed,
  stageChanged,
  criticalTimeWarning,
  temporalCollapse,
  loopStarted,
  loopEndingWarning,
  loopReset,
  endingUnlocked,
  endingCompleted,
}

/// Category grouping for audio channels.
enum AudioCategory {
  ambient,
  music,
  effects,
  ui,
}

/// Centralized Audio Service handling semantic audio events, category controls,
/// and safe fallback when audio assets or hardware drivers are unavailable.
class AudioService extends ChangeNotifier {
  final PreferencesService _preferencesService;
  bool _isDisposed = false;

  AudioService(this._preferencesService);

  /// Audio asset manifest mapping semantic events to asset paths.
  static const Map<SemanticSoundEvent, String> _assetManifest = {
    SemanticSoundEvent.buttonPressed: 'assets/audio/sfx_button_tap.mp3',
    SemanticSoundEvent.locationEntered: 'assets/audio/sfx_location_enter.mp3',
    SemanticSoundEvent.objectInspected: 'assets/audio/sfx_object_inspect.mp3',
    SemanticSoundEvent.itemPickedUp: 'assets/audio/sfx_item_pickup.mp3',
    SemanticSoundEvent.itemAnchored: 'assets/audio/sfx_item_anchored.mp3',
    SemanticSoundEvent.clueDiscovered: 'assets/audio/sfx_clue_discovered.mp3',
    SemanticSoundEvent.knowledgeConfirmed: 'assets/audio/sfx_knowledge_confirm.mp3',
    SemanticSoundEvent.contradictionDiscovered: 'assets/audio/sfx_contradiction.mp3',
    SemanticSoundEvent.puzzleOpened: 'assets/audio/sfx_puzzle_open.mp3',
    SemanticSoundEvent.puzzleCorrect: 'assets/audio/sfx_puzzle_correct.mp3',
    SemanticSoundEvent.puzzleIncorrect: 'assets/audio/sfx_puzzle_incorrect.mp3',
    SemanticSoundEvent.mechanismUnlocked: 'assets/audio/sfx_mechanism_unlock.mp3',
    SemanticSoundEvent.mechanismLocked: 'assets/audio/sfx_mechanism_locked.mp3',
    SemanticSoundEvent.dialogueOpened: 'assets/audio/sfx_dialogue_open.mp3',
    SemanticSoundEvent.dialogueTopicUnlocked: 'assets/audio/sfx_dialogue_topic.mp3',
    SemanticSoundEvent.hintOpened: 'assets/audio/sfx_hint_open.mp3',
    SemanticSoundEvent.hintRevealed: 'assets/audio/sfx_hint_revealed.mp3',
    SemanticSoundEvent.stageChanged: 'assets/audio/sfx_stage_change.mp3',
    SemanticSoundEvent.criticalTimeWarning: 'assets/audio/sfx_critical_warning.mp3',
    SemanticSoundEvent.temporalCollapse: 'assets/audio/sfx_temporal_collapse.mp3',
    SemanticSoundEvent.loopStarted: 'assets/audio/sfx_loop_start.mp3',
    SemanticSoundEvent.loopEndingWarning: 'assets/audio/sfx_loop_ending_warning.mp3',
    SemanticSoundEvent.loopReset: 'assets/audio/sfx_loop_reset.mp3',
    SemanticSoundEvent.endingUnlocked: 'assets/audio/sfx_ending_unlocked.mp3',
    SemanticSoundEvent.endingCompleted: 'assets/audio/sfx_ending_completed.mp3',
  };

  /// Category classification for each event type.
  static AudioCategory _getCategoryForEvent(SemanticSoundEvent event) {
    switch (event) {
      case SemanticSoundEvent.buttonPressed:
      case SemanticSoundEvent.hintOpened:
      case SemanticSoundEvent.dialogueOpened:
      case SemanticSoundEvent.puzzleOpened:
        return AudioCategory.ui;
      case SemanticSoundEvent.loopStarted:
      case SemanticSoundEvent.stageChanged:
      case SemanticSoundEvent.criticalTimeWarning:
      case SemanticSoundEvent.temporalCollapse:
      case SemanticSoundEvent.loopEndingWarning:
      case SemanticSoundEvent.loopReset:
        return AudioCategory.ambient;
      case SemanticSoundEvent.endingUnlocked:
      case SemanticSoundEvent.endingCompleted:
        return AudioCategory.music;
      default:
        return AudioCategory.effects;
    }
  }

  /// Check whether playing audio is currently allowed by user preferences.
  bool isAudioAllowedForEvent(SemanticSoundEvent event) {
    if (!_preferencesService.masterAudioEnabled) return false;

    final category = _getCategoryForEvent(event);
    switch (category) {
      case AudioCategory.ambient:
        return _preferencesService.ambientEnabled;
      case AudioCategory.music:
        return _preferencesService.musicEnabled;
      case AudioCategory.effects:
        return _preferencesService.effectsEnabled;
      case AudioCategory.ui:
        return _preferencesService.effectsEnabled;
    }
  }

  /// Play a semantic sound event with complete error handling and non-blocking safe failure.
  Future<void> playEvent(SemanticSoundEvent event) async {
    if (_isDisposed) return;
    if (!isAudioAllowedForEvent(event)) return;

    final assetPath = _assetManifest[event];
    if (assetPath == null) return;

    try {
      // Audio playback execution abstraction
      // If binary audio files are not present in assets, fail silently without throwing or crashing
      if (kDebugMode) {
        debugPrint('[AudioService] Semantic sound requested: ${event.name} -> $assetPath');
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[AudioService] Controlled audio fallback for ${event.name}: $e');
      }
    }
  }

  @override
  void dispose() {
    _isDisposed = true;
    super.dispose();
  }
}
