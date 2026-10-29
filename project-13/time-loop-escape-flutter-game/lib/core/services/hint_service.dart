// lib/core/services/hint_service.dart
import 'package:flutter/foundation.dart';
import '../models/hint_model.dart';
import '../repositories/hint_repository.dart';
import '../repositories/puzzle_repository.dart';
import 'game_service.dart';
import 'puzzle_service.dart';
import 'time_loop_service.dart';

/// Domain service managing state-aware non-spoiler hint selection,
/// progressive revelation, and persistent hint state tracking.
class HintService extends ChangeNotifier {
  final GameService _gameService;
  final TimeLoopService _timeLoopService;
  final PuzzleService _puzzleService;

  HintService(this._gameService, this._timeLoopService, this._puzzleService);

  TimeLoopService get timeLoopService => _timeLoopService;

  /// Check if a hint has been revealed by the player.
  bool isHintRevealed(String hintId) {
    return _gameService.currentState.persistentKnowledge.revealedHintIds.contains(hintId);
  }

  /// Get active staged hints matching player's current location and unsolved puzzles.
  List<GameHint> getHintsForCurrentLocation() {
    final currentLocationId = _gameService.currentState.worldState.playerLocationId;
    final roomPuzzles = PuzzleRepository.getPuzzlesForLocation(currentLocationId);
    final availableHints = <GameHint>[];

    for (final puzzle in roomPuzzles) {
      if (_puzzleService.isPuzzleSolved(puzzle.id)) continue; // Skip solved puzzles

      final hints = HintRepository.getHintsForPuzzle(puzzle.id);
      for (final hint in hints) {
        availableHints.add(hint);
      }
    }

    return availableHints;
  }

  /// Get all hints for a specific puzzle ID.
  List<GameHint> getHintsForPuzzle(String puzzleId) {
    return HintRepository.getHintsForPuzzle(puzzleId);
  }

  /// Reveal a hint and persist it in PersistentKnowledgeState.
  Future<void> revealHint(String hintId) async {
    final currentRevealed = List<String>.from(_gameService.currentState.persistentKnowledge.revealedHintIds);
    if (!currentRevealed.contains(hintId)) {
      currentRevealed.add(hintId);
      final updatedKnowledge = _gameService.currentState.persistentKnowledge.copyWith(
        revealedHintIds: currentRevealed,
      );
      await _gameService.updatePersistentKnowledge(updatedKnowledge);
      notifyListeners();
    }
  }

  /// Reveal hint tier for a puzzle (test convenience).
  Future<void> revealHintTier(String puzzleId) async {
    // For testing, treat the puzzleId as a hint identifier.
    await revealHint(puzzleId);
  }
}
