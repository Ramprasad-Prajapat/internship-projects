// lib/core/services/ending_service.dart
import 'package:flutter/foundation.dart';
import '../models/ending_model.dart';
import '../models/game_state.dart';
import '../repositories/ending_repository.dart';
import 'game_service.dart';

/// Domain service responsible for evaluating ending eligibility, resolving the
/// highest-priority reachable MVP ending deterministically, and committing ending state.
class EndingService extends ChangeNotifier {
  final GameService _gameService;

  EndingService(this._gameService);

  /// Get all canonical ending definitions.
  List<EndingModel> getAllEndings() => EndingRepository.getAllEndings();

  /// Get currently enabled MVP ending definitions.
  List<EndingModel> getMvpEndings() => EndingRepository.getMvpEndings();

  /// Evaluate current GameState and return all MVP endings whose prerequisites are satisfied.
  List<EndingModel> evaluateEligibleEndings([GameState? customState]) {
    final state = customState ?? _gameService.currentState;
    final mvpEndings = EndingRepository.getMvpEndings();

    return mvpEndings.where((ending) => ending.isReachable(state)).toList();
  }

  /// Deterministically resolve the single highest-priority reachable MVP ending.
  /// If multiple endings become eligible simultaneously, the one with the highest
  /// priority integer is returned. Returns null if no ending conditions are satisfied.
  EndingModel? getReachableEnding([GameState? customState]) {
    final eligible = evaluateEligibleEndings(customState);
    if (eligible.isEmpty) return null;

    // Sort descending by priority (higher priority integer wins tie)
    eligible.sort((a, b) => b.priority.compareTo(a.priority));
    return eligible.first;
  }

  /// Provide human-readable diagnostic explanation of unmet prerequisites for an ending.
  List<String> explainUnmetConditions(String endingId, [GameState? customState]) {
    final state = customState ?? _gameService.currentState;
    final ending = EndingRepository.getEndingById(endingId);
    if (ending == null) return ['Ending definition "$endingId" does not exist.'];

    final req = ending.requirement;
    final unmet = <String>[];

    if (!ending.isEnabledForMvp) {
      unmet.add('Ending "${ending.title}" is currently disabled for MVP scope.');
      return unmet;
    }

    if (req.requiredChapter != null &&
        state.persistentKnowledge.currentChapter < req.requiredChapter!) {
      unmet.add('Requires Chapter ${req.requiredChapter} (Current: ${state.persistentKnowledge.currentChapter}).');
    }

    for (final clueId in req.requiredClueIds) {
      if (!state.persistentKnowledge.discoveredClueIds.contains(clueId)) {
        unmet.add('Missing required clue: $clueId');
      }
    }

    for (final codeId in req.requiredCodeIds) {
      if (!state.persistentKnowledge.unlockedCodeIds.contains(codeId)) {
        unmet.add('Missing required secret code: $codeId');
      }
    }

    for (final topicId in req.requiredDialogueTopicIds) {
      if (!state.persistentKnowledge.unlockedDialogueTopicIds.contains(topicId)) {
        unmet.add('Missing required NPC dialogue topic: $topicId');
      }
    }

    for (final puzzleId in req.requiredSolvedPuzzleIds) {
      final puzzleState = state.worldState.activePuzzleStates[puzzleId];
      final isSolved = puzzleState != null && puzzleState['solved'] == true;
      if (!isSolved) {
        unmet.add('Puzzle "$puzzleId" is not solved.');
      }
    }

    if (req.requiredAnchoredItemId != null) {
      final isAnchored = state.persistentKnowledge.anchoredItemIds.contains(req.requiredAnchoredItemId);
      final inInv = state.worldState.physicalInventoryItemIds.contains(req.requiredAnchoredItemId);
      if (!isAnchored && !inInv) {
        unmet.add('Missing required item/anchor: ${req.requiredAnchoredItemId}');
      }
    }

    if (req.requiredLocationId != null &&
        state.worldState.playerLocationId != req.requiredLocationId) {
      unmet.add('Must be at location: ${req.requiredLocationId}');
    }

    return unmet;
  }

  /// Trigger and persist an ending completion deterministically.
  Future<EndingModel?> completeEnding(String endingId) async {
    final ending = EndingRepository.getEndingById(endingId);
    if (ending == null) {
      throw ArgumentError('Invalid ending ID: $endingId');
    }

    if (!ending.isEnabledForMvp) {
      throw StateError('Attempted to complete non-MVP ending: $endingId');
    }

    await _gameService.completeEnding(endingId);
    notifyListeners();
    return ending;
  }

  /// Check if an ending (or specific ending) has been completed.
  bool isEndingCompleted([String? endingId]) {
    final persistent = _gameService.currentState.persistentKnowledge;
    if (endingId == null) {
      return persistent.completedEndingId != null;
    }
    return persistent.completedEndingId == endingId ||
        persistent.unlockedEndings.contains(endingId);
  }

  /// Get the currently completed ending definition if one has been completed.
  EndingModel? get completedEnding {
    final completedId = _gameService.currentState.persistentKnowledge.completedEndingId;
    if (completedId == null) return null;
    return EndingRepository.getEndingById(completedId);
  }
}
