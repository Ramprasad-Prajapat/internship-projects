// lib/core/services/game_service.dart
import 'package:flutter/foundation.dart';
import '../../app/app_config.dart';
import '../errors/app_exception.dart';
import '../models/game_state.dart';
import '../repositories/game_repository.dart';

/// Core domain service orchestrating GameState lifecycle, deterministic loop resets,
/// and separation of resettable world state from persistent player knowledge.
class GameService extends ChangeNotifier {
  final GameRepository _repository;
  GameState _currentState = const GameState();

  GameService(this._repository);

  GameState get currentState => _currentState;
  GameLifecyclePhase get lifecyclePhase => _currentState.lifecyclePhase;

  Future<bool> hasSavedGame() async {
    return await _repository.hasSavedGame();
  }

  /// Initialize a brand new game session (Loop #1).
  Future<void> startNewGame() async {
    try {
      _currentState = const GameState(
        currentLoopNumber: 1,
        elapsedLoopSeconds: 0,
        lifecyclePhase: GameLifecyclePhase.loopActive,
        worldState: ResettableWorldState(playerLocationId: 'lobby_reception'),
        persistentKnowledge: PersistentKnowledgeState(currentChapter: 1),
      );
      await _repository.saveGameState(_currentState);
      notifyListeners();
    } catch (e) {
      throw StorageException('Failed to initialize new game state: ${e.toString()}');
    }
  }

  /// Load existing saved game state from repository.
  Future<bool> loadSavedGame() async {
    try {
      final saved = await _repository.loadSaveData();
      if (saved != null) {
        _currentState = saved.copyWith(
          lifecyclePhase: saved.lifecyclePhase == GameLifecyclePhase.loopCompleted
              ? GameLifecyclePhase.loopCompleted
              : GameLifecyclePhase.loopActive,
        );
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      throw StorageException('Failed to load saved game state: ${e.toString()}');
    }
  }

  /// Direct update of persistent knowledge state (e.g., hint revelation, dialogue unlocks).
  Future<void> updatePersistentKnowledge(PersistentKnowledgeState updatedKnowledge) async {
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);
    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Update active lifecycle phase (e.g. paused, investigating, loopActive).
  void setLifecyclePhase(GameLifecyclePhase phase) {
    if (_currentState.lifecyclePhase == phase) return;
    _currentState = _currentState.copyWith(lifecyclePhase: phase);
    notifyListeners();
  }

  /// Update loop timer. Keeps countdown runtime state without disk write per tick.
  /// If time limit reached, triggers deterministic loop reset and persists post-reset state.
  Future<void> updateLoopTimer(int seconds) async {
    if (_currentState.lifecyclePhase != GameLifecyclePhase.loopActive) return;

    final updatedSeconds = seconds.clamp(0, AppConfig.targetLoopDurationSeconds);
    _currentState = _currentState.copyWith(elapsedLoopSeconds: updatedSeconds);

    if (updatedSeconds >= AppConfig.targetLoopDurationSeconds) {
      await executeLoopReset();
    } else {
      notifyListeners();
    }
  }

  /// Update player location within resettable world state and persist change.
  Future<void> updatePlayerLocation(String locationId) async {
    final updatedWorld = _currentState.worldState.copyWith(playerLocationId: locationId);
    _currentState = _currentState.copyWith(worldState: updatedWorld);
    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Update room physical state in current loop and persist change.
  Future<void> updateRoomState(String roomId, Map<String, dynamic> roomStateData) async {
    final currentRooms = Map<String, dynamic>.from(_currentState.worldState.roomStates);
    currentRooms[roomId] = roomStateData;
    final updatedWorld = _currentState.worldState.copyWith(roomStates: currentRooms);
    _currentState = _currentState.copyWith(worldState: updatedWorld);
    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Update NPC state in current loop and persist change.
  Future<void> updateNPCState(String npcId, Map<String, dynamic> npcStateData) async {
    final currentNpcs = Map<String, dynamic>.from(_currentState.worldState.npcStates);
    currentNpcs[npcId] = npcStateData;
    final updatedWorld = _currentState.worldState.copyWith(npcStates: currentNpcs);
    _currentState = _currentState.copyWith(worldState: updatedWorld);
    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Update puzzle physical state in current loop and persist change.
  Future<void> updatePuzzleState(String puzzleId, Map<String, dynamic> puzzleStateData) async {
    final currentPuzzles = Map<String, dynamic>.from(_currentState.worldState.activePuzzleStates);
    currentPuzzles[puzzleId] = puzzleStateData;
    final updatedWorld = _currentState.worldState.copyWith(activePuzzleStates: currentPuzzles);
    _currentState = _currentState.copyWith(worldState: updatedWorld);
    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Discover a clue (PERSISTENT: survives reset).
  Future<void> discoverClue(String clueId) async {
    if (_currentState.persistentKnowledge.discoveredClueIds.contains(clueId)) return;

    final updatedClues = List<String>.from(_currentState.persistentKnowledge.discoveredClueIds)..add(clueId);
    final updatedKnowledge = _currentState.persistentKnowledge.copyWith(discoveredClueIds: updatedClues);
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);

    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Unlock a secret code or combination (PERSISTENT: survives reset).
  Future<void> unlockCode(String codeId) async {
    if (_currentState.persistentKnowledge.unlockedCodeIds.contains(codeId)) return;

    final updatedCodes = List<String>.from(_currentState.persistentKnowledge.unlockedCodeIds)..add(codeId);
    final updatedKnowledge = _currentState.persistentKnowledge.copyWith(unlockedCodeIds: updatedCodes);
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);

    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Add a topic to Knowledge Board (PERSISTENT: survives reset).
  Future<void> addKnowledgeBoardTopic(String topicId) async {
    if (_currentState.persistentKnowledge.knowledgeBoardTopicIds.contains(topicId)) return;

    final updatedTopics = List<String>.from(_currentState.persistentKnowledge.knowledgeBoardTopicIds)..add(topicId);
    final updatedKnowledge = _currentState.persistentKnowledge.copyWith(knowledgeBoardTopicIds: updatedTopics);
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);

    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Unlock dialogue topic with NPC (PERSISTENT: survives reset).
  Future<void> unlockDialogueTopic(String topicId) async {
    if (_currentState.persistentKnowledge.unlockedDialogueTopicIds.contains(topicId)) return;

    final updatedTopics = List<String>.from(_currentState.persistentKnowledge.unlockedDialogueTopicIds)..add(topicId);
    final updatedKnowledge = _currentState.persistentKnowledge.copyWith(unlockedDialogueTopicIds: updatedTopics);
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);

    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Set anchored item (PERSISTENT: max 1 physical item survives temporal reset).
  Future<void> setAnchoredItem(String itemId) async {
    final updatedKnowledge = _currentState.persistentKnowledge.copyWith(anchoredItemIds: [itemId]);
    _currentState = _currentState.copyWith(persistentKnowledge: updatedKnowledge);

    await _repository.saveGameState(_currentState);
    notifyListeners();
  }

  /// Deterministic Loop Reset Execution:
  /// - Increments currentLoopNumber
  /// - Resets elapsedLoopSeconds to 0
  /// - Resets resettable world state (room states, NPC positions, unanchored items)
  /// - Carries over anchored item to physical inventory if present
  /// - PRESERVES persistent player knowledge completely intact
  /// - Saves updated state to repository
  Future<void> executeLoopReset() async {
    try {
      _currentState = _currentState.copyWith(lifecyclePhase: GameLifecyclePhase.loopResetting);
      notifyListeners();

      final nextLoopNumber = _currentState.currentLoopNumber + 1;
      final anchored = List<String>.from(_currentState.persistentKnowledge.anchoredItemIds);

      // Resettable state returned to default lobby reception with anchored item carried over
      final resetWorld = ResettableWorldState(
        playerLocationId: 'lobby_reception',
        physicalInventoryItemIds: anchored,
      );

      _currentState = GameState(
        currentLoopNumber: nextLoopNumber,
        elapsedLoopSeconds: 0,
        lifecyclePhase: GameLifecyclePhase.loopActive,
        worldState: resetWorld,
        // PERSISTENT KNOWLEDGE PRESERVED INTACT
        persistentKnowledge: _currentState.persistentKnowledge,
      );

      await _repository.saveGameState(_currentState);
      notifyListeners();
    } catch (e) {
      throw StateException('Failed during loop reset execution: ${e.toString()}');
    }
  }

  /// Complete an ending, persist completed ending ID, and update lifecycle phase to loopCompleted.
  /// Preserves all discovered clues, codes, topics, and persistent knowledge intact.
  Future<void> completeEnding(String endingId) async {
    try {
      final nowIso = DateTime.now().toIso8601String();
      final currentUnlocked = List<String>.from(_currentState.persistentKnowledge.unlockedEndings);
      if (!currentUnlocked.contains(endingId)) {
        currentUnlocked.add(endingId);
      }

      final updatedKnowledge = _currentState.persistentKnowledge.copyWith(
        completedEndingId: endingId,
        endingCompletedAt: nowIso,
        unlockedEndings: currentUnlocked,
      );

      _currentState = _currentState.copyWith(
        lifecyclePhase: GameLifecyclePhase.loopCompleted,
        persistentKnowledge: updatedKnowledge,
      );

      await _repository.saveGameState(_currentState);
      notifyListeners();
    } catch (e) {
      throw StorageException('Failed to persist ending completion: ${e.toString()}');
    }
  }

  // New helper to add a physical item to inventory (resettable world state).
  Future<void> addPhysicalItem(String itemId) async {
    final currentIds = List<String>.from(_currentState.worldState.physicalInventoryItemIds);
    if (!currentIds.contains(itemId)) {
      currentIds.add(itemId);
      final updatedWorld = _currentState.worldState.copyWith(physicalInventoryItemIds: currentIds);
      _currentState = _currentState.copyWith(worldState: updatedWorld);
      await _repository.saveGameState(_currentState);
      notifyListeners();
    }
  }

}
