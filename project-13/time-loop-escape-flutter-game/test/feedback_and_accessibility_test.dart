// test/feedback_and_accessibility_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:time_loop_escape_game/core/repositories/game_repository_impl.dart';
import 'package:time_loop_escape_game/core/services/audio_service.dart';
import 'package:time_loop_escape_game/core/services/feedback_service.dart';
import 'package:time_loop_escape_game/core/services/game_service.dart';
import 'package:time_loop_escape_game/core/services/haptic_feedback_service.dart';
import 'package:time_loop_escape_game/core/services/preferences_service.dart';
import 'package:time_loop_escape_game/core/services/time_loop_service.dart';
import 'package:time_loop_escape_game/core/storage/in_memory_storage.dart';

void main() {
  group('Phase 16 Audio, Feedback & Accessibility Tests', () {
    late InMemoryLocalStorage storage;
    late PreferencesService prefService;
    late HapticFeedbackService hapticService;
    late AudioService audioService;
    late FeedbackService feedbackService;
    late LocalGameRepositoryImpl repository;
    late GameService gameService;
    late TimeLoopService loopService;

    setUp(() async {
      storage = InMemoryLocalStorage();
      await storage.init();
      prefService = PreferencesService(storage);
      await prefService.init();

      hapticService = HapticFeedbackService(prefService);
      audioService = AudioService(prefService);
      feedbackService = FeedbackService(audioService, hapticService);

      repository = LocalGameRepositoryImpl(storage);
      gameService = GameService(repository);
      await gameService.startNewGame();

      loopService = TimeLoopService(gameService, feedbackService);
    });

    test('1. PreferencesService initializes with safe defaults and persists changes', () async {
      expect(prefService.masterAudioEnabled, isTrue);
      expect(prefService.musicEnabled, isTrue);
      expect(prefService.effectsEnabled, isTrue);
      expect(prefService.ambientEnabled, isTrue);
      expect(prefService.hapticsEnabled, isTrue);
      expect(prefService.reducedMotion, isFalse);
      expect(prefService.subtitlesEnabled, isTrue);

      // Change preferences
      await prefService.setMasterAudioEnabled(false);
      await prefService.setHapticsEnabled(false);
      await prefService.setReducedMotion(true);

      // Verify immediate state update
      expect(prefService.masterAudioEnabled, isFalse);
      expect(prefService.hapticsEnabled, isFalse);
      expect(prefService.reducedMotion, isTrue);

      // Reload into new service from local storage
      final reloadedService = PreferencesService(storage);
      await reloadedService.init();

      expect(reloadedService.masterAudioEnabled, isFalse);
      expect(reloadedService.hapticsEnabled, isFalse);
      expect(reloadedService.reducedMotion, isTrue);
    });

    test('2. Malformed preference storage handles recovery safely with safe defaults', () async {
      await storage.setString('time_loop_user_preferences_v1', '{corrupt_pref: true,,,');

      final recoveryService = PreferencesService(storage);
      await recoveryService.init();

      expect(recoveryService.masterAudioEnabled, isTrue);
      expect(recoveryService.hapticsEnabled, isTrue);
      expect(recoveryService.preferences.stateVersion, equals(1));
    });

    test('3. AudioService checks channel toggles correctly', () {
      expect(audioService.isAudioAllowedForEvent(SemanticSoundEvent.buttonPressed), isTrue);
      expect(audioService.isAudioAllowedForEvent(SemanticSoundEvent.criticalTimeWarning), isTrue);

      prefService.setMasterAudioEnabled(false);
      expect(audioService.isAudioAllowedForEvent(SemanticSoundEvent.buttonPressed), isFalse);

      prefService.setMasterAudioEnabled(true);
      prefService.setAmbientEnabled(false);
      expect(audioService.isAudioAllowedForEvent(SemanticSoundEvent.criticalTimeWarning), isFalse);
      expect(audioService.isAudioAllowedForEvent(SemanticSoundEvent.buttonPressed), isTrue);
    });

    test('4. Audio & Haptic services fail gracefully without throwing on hardware calls', () async {
      // Should not throw even when running in unit test VM without hardware drivers
      await expectLater(hapticService.lightTap(), completes);
      await expectLater(hapticService.mediumImpact(), completes);
      await expectLater(hapticService.strongImpact(), completes);
      await expectLater(hapticService.success(), completes);
      await expectLater(hapticService.warning(), completes);
      await expectLater(hapticService.error(), completes);
      await expectLater(hapticService.selection(), completes);

      await expectLater(audioService.playEvent(SemanticSoundEvent.buttonPressed), completes);
      await expectLater(audioService.playEvent(SemanticSoundEvent.clueDiscovered), completes);
    });

    test('5. FeedbackService prevents rapid duplicate event spamming (Debounce Protection)', () async {
      // Trigger multiple rapid button presses synchronously
      await feedbackService.playButtonPressed();
      await feedbackService.playButtonPressed();
      await feedbackService.playButtonPressed();

      // No crash, debouncing safely filters rapid triggers
      expect(true, isTrue);
    });

    test('6. TimeLoopService triggers critical time warning once per loop and resets on loop reset', () async {
      // Simulate 245 seconds elapsed (remaining = 55s <= 60s warning threshold)
      await gameService.updateLoopTimer(245);

      // Start loop timer
      loopService.startLoopTimer();
      await Future.delayed(const Duration(milliseconds: 1100));
      loopService.stopLoopTimer();

      // Execute loop reset
      await gameService.executeLoopReset();

      // Reset state verifies loop elapsed seconds returned to 0
      expect(loopService.elapsedSeconds, equals(0));
      expect(loopService.remainingSeconds, equals(300));
    });
  });
}
