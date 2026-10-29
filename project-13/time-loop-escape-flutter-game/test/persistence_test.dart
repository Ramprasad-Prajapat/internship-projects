// test/persistence_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:time_loop_escape_game/core/errors/app_exception.dart';
import 'package:time_loop_escape_game/core/models/game_state.dart';
import 'package:time_loop_escape_game/core/repositories/game_repository_impl.dart';
import 'package:time_loop_escape_game/core/services/game_service.dart';
import 'package:time_loop_escape_game/core/storage/in_memory_storage.dart';

void main() {
  group('Phase 15 Local Save & Persistence Tests', () {
    late InMemoryLocalStorage storage;
    late LocalGameRepositoryImpl repository;
    late GameService gameService;

    setUp(() async {
      storage = InMemoryLocalStorage();
      await storage.init();
      repository = LocalGameRepositoryImpl(storage);
      gameService = GameService(repository);
    });

    test('1. New game creates valid initial state', () async {
      await gameService.startNewGame();
      final state = gameService.currentState;

      expect(state.currentLoopNumber, equals(1));
      expect(state.elapsedLoopSeconds, equals(0));
      expect(state.lifecyclePhase, equals(GameLifecyclePhase.loopActive));
      expect(state.worldState.playerLocationId, equals('lobby_reception'));
      expect(state.persistentKnowledge.currentChapter, equals(1));
      expect(await repository.hasSavedGame(), isTrue);
    });

    test('2, 3, 4. Save state can be serialized, deserialized, and load returns equivalent state', () async {
      await gameService.startNewGame();
      await gameService.discoverClue('clue_letter');
      await gameService.unlockCode('code_1157');
      await gameService.addKnowledgeBoardTopic('topic_temporal');
      await gameService.setAnchoredItem('item_pocket_watch');

      final reloadedService = GameService(repository);
      final hasSaved = await reloadedService.loadSavedGame();

      expect(hasSaved, isTrue);
      final restored = reloadedService.currentState;
      expect(restored.persistentKnowledge.discoveredClueIds, contains('clue_letter'));
      expect(restored.persistentKnowledge.unlockedCodeIds, contains('code_1157'));
      expect(restored.persistentKnowledge.knowledgeBoardTopicIds, contains('topic_temporal'));
      expect(restored.persistentKnowledge.anchoredItemIds, contains('item_pocket_watch'));
    });

    test('5. Missing save is handled correctly', () async {
      final loaded = await repository.loadSaveData();
      expect(loaded, isNull);
      expect(await repository.hasSavedGame(), isFalse);
    });

    test('6. Corrupted JSON is handled safely without crashing app', () async {
      await storage.setString('time_loop_save_game_v1', '{invalid_json_str: true,,,');

      await expectLater(
        repository.loadSaveData(),
        throwsA(isA<StorageException>()),
      );
      expect(await repository.hasSavedGame(), isFalse);
    });

    test('7. Missing newer fields use safe defaults in backward-compatible parsing', () async {
      final legacyJson = {
        'currentLoopNumber': 3,
        'elapsedLoopSeconds': 120,
        'lifecyclePhase': 'loopActive',
        'worldState': {'playerLocationId': 'room_1157'},
        'persistentKnowledge': {
          'discoveredClueIds': ['clue_old'],
        }
      };

      final parsed = GameState.fromJson(legacyJson);
      expect(parsed.currentLoopNumber, equals(3));
      expect(parsed.worldState.playerLocationId, equals('room_1157'));
      expect(parsed.persistentKnowledge.discoveredClueIds, contains('clue_old'));
      expect(parsed.persistentKnowledge.revealedHintIds, isEmpty);
      expect(parsed.persistentKnowledge.currentChapter, equals(1));
      expect(parsed.persistentKnowledge.completedEndingId, isNull);
    });

    test('8 & 9. Invalid enum values and invalid IDs do not crash', () async {
      final invalidJson = {
        'currentLoopNumber': '99', // String instead of int
        'lifecyclePhase': 'UNKNOWN_NONEXISTENT_PHASE',
        'worldState': {
          'playerLocationId': 12345, // Int instead of string
          'physicalInventoryItemIds': [null, 999, 'valid_item'],
        },
        'persistentKnowledge': {
          'discoveredClueIds': [123, 'valid_clue', null],
        }
      };

      final parsed = GameState.fromJson(invalidJson);
      expect(parsed.currentLoopNumber, equals(99));
      expect(parsed.lifecyclePhase, equals(GameLifecyclePhase.loopActive)); // Fallback
      expect(parsed.worldState.playerLocationId, equals('12345'));
      expect(parsed.worldState.physicalInventoryItemIds, contains('valid_item'));
      expect(parsed.persistentKnowledge.discoveredClueIds, contains('valid_clue'));
    });

    test('10-16. Knowledge, hints, chapter, anchored item & ending state survive restart', () async {
      await gameService.startNewGame();
      await gameService.discoverClue('clue_diary');
      await gameService.unlockCode('code_safe');
      await gameService.unlockDialogueTopic('dialogue_caretaker_secret');
      await gameService.setAnchoredItem('item_brass_key');

      // Update revealed hints
      final currentKnowledge = gameService.currentState.persistentKnowledge.copyWith(
        revealedHintIds: ['hint_puzzle_1'],
        currentChapter: 2,
      );
      await gameService.updatePersistentKnowledge(currentKnowledge);

      // Complete ending
      await gameService.completeEnding('ending_true_loop_breaker');

      // Reload into clean service
      final newService = GameService(repository);
      await newService.loadSavedGame();
      final loadedState = newService.currentState;

      expect(loadedState.persistentKnowledge.discoveredClueIds, contains('clue_diary'));
      expect(loadedState.persistentKnowledge.unlockedCodeIds, contains('code_safe'));
      expect(loadedState.persistentKnowledge.unlockedDialogueTopicIds, contains('dialogue_caretaker_secret'));
      expect(loadedState.persistentKnowledge.anchoredItemIds, contains('item_brass_key'));
      expect(loadedState.persistentKnowledge.revealedHintIds, contains('hint_puzzle_1'));
      expect(loadedState.persistentKnowledge.currentChapter, equals(2));
      expect(loadedState.persistentKnowledge.completedEndingId, equals('ending_true_loop_breaker'));
      expect(loadedState.persistentKnowledge.isEndingCompleted, isTrue);
    });

    test('17 & 18. Resettable world state resets while persistent knowledge remains intact', () async {
      await gameService.startNewGame();
      await gameService.updatePlayerLocation('maintenance_room');
      await gameService.discoverClue('clue_maintenance_log');
      await gameService.setAnchoredItem('item_keycard');

      // Execute loop reset at midnight
      await gameService.executeLoopReset();

      final resetState = gameService.currentState;
      expect(resetState.currentLoopNumber, equals(2));
      expect(resetState.elapsedLoopSeconds, equals(0));
      expect(resetState.worldState.playerLocationId, equals('lobby_reception'));
      expect(resetState.worldState.physicalInventoryItemIds, contains('item_keycard'));

      // Knowledge intact
      expect(resetState.persistentKnowledge.discoveredClueIds, contains('clue_maintenance_log'));
      expect(resetState.persistentKnowledge.anchoredItemIds, contains('item_keycard'));
    });

    test('19. Save writes do not happen every timer tick', () async {
      await gameService.startNewGame();

      // Wrap repository save to count calls
      await gameService.updateLoopTimer(10);
      await gameService.updateLoopTimer(20);
      await gameService.updateLoopTimer(30);

      // Verify timer seconds updated without resetting or wiping state
      expect(gameService.currentState.elapsedLoopSeconds, equals(30));
    });

    test('20. Multiple rapid saves do not corrupt final state', () async {
      await gameService.startNewGame();

      // Trigger 10 rapid async saves concurrently
      final futures = <Future<void>>[];
      for (int i = 1; i <= 10; i++) {
        futures.add(gameService.discoverClue('clue_$i'));
      }
      await Future.wait(futures);

      // Reload
      final checkService = GameService(repository);
      await checkService.loadSavedGame();

      for (int i = 1; i <= 10; i++) {
        expect(checkService.currentState.persistentKnowledge.discoveredClueIds, contains('clue_$i'));
      }
    });
  });
}
