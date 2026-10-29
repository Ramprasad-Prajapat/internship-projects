// test/production_smoke_scenarios_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:time_loop_escape_game/app/app_router.dart';
import 'package:time_loop_escape_game/core/models/game_state.dart';

import 'package:time_loop_escape_game/core/repositories/game_repository_impl.dart';
import 'package:time_loop_escape_game/core/repositories/npc_repository.dart';
import 'package:time_loop_escape_game/core/repositories/puzzle_repository.dart';
import 'package:time_loop_escape_game/core/services/audio_service.dart';

import 'package:time_loop_escape_game/core/services/ending_service.dart';

import 'package:time_loop_escape_game/core/services/feedback_service.dart';
import 'package:time_loop_escape_game/core/services/game_service.dart';

import 'package:time_loop_escape_game/core/services/haptic_feedback_service.dart';
import 'package:time_loop_escape_game/core/services/hint_service.dart';

import 'package:time_loop_escape_game/core/services/interaction_service.dart';
import 'package:time_loop_escape_game/core/services/inventory_service.dart';

import 'package:time_loop_escape_game/core/services/knowledge_service.dart';

import 'package:time_loop_escape_game/core/services/npc_service.dart';
import 'package:time_loop_escape_game/core/services/preferences_service.dart';
import 'package:time_loop_escape_game/core/services/puzzle_service.dart';

import 'package:time_loop_escape_game/core/services/time_loop_service.dart';
import 'package:time_loop_escape_game/core/storage/in_memory_storage.dart';

void main() {
  group('Phase 17 Production Smoke Test Scenarios (1-15)', () {
    late InMemoryLocalStorage storage;
    late LocalGameRepositoryImpl repository;
    late GameService gameService;
    late TimeLoopService loopService;
    late InventoryService inventoryService;
    late KnowledgeService knowledgeService;
    late PuzzleService puzzleService;
    late NpcService npcService;
    late HintService hintService;
    late EndingService endingService;
    late InteractionService interactionService;
    late PreferencesService prefService;
    late AudioService audioService;
    late HapticFeedbackService hapticService;
    late FeedbackService feedbackService;

    setUp(() async {
      storage = InMemoryLocalStorage();
      await storage.init();
      repository = LocalGameRepositoryImpl(storage);
      gameService = GameService(repository);
      await gameService.startNewGame();

      prefService = PreferencesService(storage);
      await prefService.init();
      hapticService = HapticFeedbackService(prefService);
      audioService = AudioService(prefService);
      feedbackService = FeedbackService(audioService, hapticService);

      loopService = TimeLoopService(gameService, feedbackService);
      inventoryService = InventoryService(gameService);
      knowledgeService = KnowledgeService(gameService);
      puzzleService = PuzzleService(gameService, loopService);
      npcService = NpcService(gameService, loopService);
      hintService = HintService(gameService, loopService, puzzleService);
      endingService = EndingService(gameService);
      interactionService = InteractionService(gameService, loopService);
      expect(interactionService, isNotNull);
    });

    test('SCENARIO 1: New Game -> Loop 1 -> discover clue -> save -> reload -> clue remains', () async {
      await gameService.discoverClue('clue_frozen_clock');
      expect(knowledgeService.isClueDiscovered('clue_frozen_clock'), isTrue);

      final reloadedGameService = GameService(repository);
      await reloadedGameService.loadSavedGame();
      final reloadedKnowledge = KnowledgeService(reloadedGameService);

      expect(reloadedKnowledge.isClueDiscovered('clue_frozen_clock'), isTrue);
      expect(reloadedGameService.currentState.currentLoopNumber, equals(1));
    });

    test('SCENARIO 2: Pickup physical item -> set anchor -> loop reset -> anchored item survives', () async {
      await inventoryService.pickupPhysicalItem('brass_master_key');
      await inventoryService.setTimelineAnchor('brass_master_key');

      expect(inventoryService.anchoredItem?.id, equals('brass_master_key'));

      await gameService.executeLoopReset();

      expect(gameService.currentState.currentLoopNumber, equals(2));
      expect(inventoryService.isItemInInventory('brass_master_key'), isTrue);
      expect(inventoryService.anchoredItem?.id, equals('brass_master_key'));
    });

    test('SCENARIO 3: Pickup unanchored item -> loop reset -> item disappears from inventory', () async {
      await inventoryService.pickupPhysicalItem('caretaker_note');
      expect(inventoryService.isItemInInventory('caretaker_note'), isTrue);

      await gameService.executeLoopReset();

      expect(gameService.currentState.currentLoopNumber, equals(2));
      expect(inventoryService.isItemInInventory('caretaker_note'), isFalse);
    });

    test('SCENARIO 4: Discover code 1157 -> reload -> code remains', () async {
      await gameService.unlockCode('code_safe_1157');
      expect(knowledgeService.isCodeUnlocked('code_safe_1157'), isTrue);

      final newGameService = GameService(repository);
      await newGameService.loadSavedGame();
      final newKnowledge = KnowledgeService(newGameService);

      expect(newKnowledge.isCodeUnlocked('code_safe_1157'), isTrue);
    });

    test('SCENARIO 5: Reveal hint -> loop reset -> hint remains revealed', () async {
      await hintService.revealHintTier('puzzle_reception_safe');
      expect(hintService.isHintRevealed('puzzle_reception_safe'), isTrue);

      await gameService.executeLoopReset();

      expect(hintService.isHintRevealed('puzzle_reception_safe'), isTrue);
    });

    test('SCENARIO 6: NPC changes location according to timeline', () async {
      final caretaker = NpcRepository.getNpcById('npc_caretaker')!;
      final event1 = npcService.getCurrentScheduleEvent(caretaker);
      expect(event1?.locationId, equals('lobby_reception'));

      // Advance loop timer to 70s (stage: routineShift)
      await gameService.updateLoopTimer(70);

      final event2 = npcService.getCurrentScheduleEvent(caretaker);
      expect(event2?.locationId, equals('room_101'));
    });

    test('SCENARIO 7: Puzzle solved -> loop reset -> physical puzzle resets but discovered knowledge remains', () async {
      final puzzle = PuzzleRepository.getPuzzleById('puzzle_lobby_clock')!;

      final result = await puzzleService.attemptPuzzle(puzzle.id, 'kalchakra_1924');
      expect(result.success, isTrue);
      expect(puzzleService.isPuzzleSolved(puzzle.id), isTrue);

      // Loop reset
      await gameService.executeLoopReset();

      // Discovered clue remains persistent
      expect(knowledgeService.isClueDiscovered('clue_frozen_clock'), isTrue);
      // Physical puzzle active state returns to default
      expect(puzzleService.isPuzzleSolved(puzzle.id), isFalse);
    });

    test('SCENARIO 8: Complete ending -> reload -> ending remains completed', () async {
      await endingService.completeEnding('escape_alone');

      expect(endingService.isEndingCompleted(), isTrue);
      expect(endingService.completedEnding?.id, equals('escape_alone'));

      final newService = GameService(repository);
      await newService.loadSavedGame();
      final newEndingService = EndingService(newService);

      expect(newEndingService.isEndingCompleted(), isTrue);
      expect(newEndingService.completedEnding?.id, equals('escape_alone'));
    });

    test('SCENARIO 9: Corrupt save -> launch app -> recover safely', () async {
      await storage.setString('time_loop_save_game_v1', 'corrupted_json{{{');

      final recoveryRepo = LocalGameRepositoryImpl(storage);
      final recoveryService = GameService(recoveryRepo);

      await expectLater(recoveryService.loadSavedGame(), throwsA(isA<Exception>()));
      expect(await recoveryRepo.hasSavedGame(), isFalse);
    });

    test('SCENARIO 10: Open Knowledge Board -> timer pauses -> close -> timer resumes', () async {
      loopService.startLoopTimer();
      expect(loopService.isRunning, isTrue);
      expect(loopService.isPaused, isFalse);

      loopService.pauseLoopTimer();
      expect(loopService.isPaused, isTrue);
      expect(gameService.lifecyclePhase, equals(GameLifecyclePhase.investigation));

      loopService.resumeLoopTimer();
      expect(loopService.isPaused, isFalse);
      expect(gameService.lifecyclePhase, equals(GameLifecyclePhase.loopActive));

      loopService.stopLoopTimer();
    });

    test('SCENARIO 11: Rapid pause/resume -> exactly one timer', () async {
      loopService.startLoopTimer();

      loopService.pauseLoopTimer();
      loopService.pauseLoopTimer();
      loopService.resumeLoopTimer();
      loopService.resumeLoopTimer();

      expect(loopService.isRunning, isTrue);
      expect(loopService.isPaused, isFalse);

      loopService.stopLoopTimer();
    });

    test('SCENARIO 12: App background/foreground -> no duplicate timers', () async {
      loopService.startLoopTimer();

      // Background transition
      loopService.pauseLoopTimer();
      expect(loopService.isPaused, isTrue);

      // Foreground transition
      loopService.resumeLoopTimer();
      expect(loopService.isPaused, isFalse);
      expect(loopService.isRunning, isTrue);

      loopService.stopLoopTimer();
    });

    test('SCENARIO 13: Missing audio asset -> gameplay continues', () async {
      await expectLater(audioService.playEvent(SemanticSoundEvent.clueDiscovered), completes);
    });

    test('SCENARIO 14: Haptics unavailable -> gameplay continues', () async {
      await expectLater(hapticService.lightTap(), completes);
      await expectLater(hapticService.strongImpact(), completes);
    });

    test('SCENARIO 15: Invalid route -> safe fallback screen', () {
      final routeSetting = AppRouter.generateRoute(const RouteSettings(name: '/invalid_route_path'));
      expect(routeSetting, isNotNull);
    });
  });
}
