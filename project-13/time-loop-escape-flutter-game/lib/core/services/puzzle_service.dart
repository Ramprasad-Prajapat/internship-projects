// lib/core/services/puzzle_service.dart
import 'package:flutter/foundation.dart';
import '../models/puzzle_model.dart';
import '../repositories/puzzle_repository.dart';
import 'game_service.dart';
import 'time_loop_service.dart';

/// Domain service managing puzzle prerequisite validation, solution verification,
/// physical puzzle state updates, and persistent clue unlocks.
class PuzzleService extends ChangeNotifier {
  final GameService _gameService;
  final TimeLoopService _timeLoopService;

  PuzzleService(this._gameService, this._timeLoopService);

  /// Check if a puzzle is solved in the current loop.
  bool isPuzzleSolved(String puzzleId) {
    final activePuzzles = _gameService.currentState.worldState.activePuzzleStates;
    if (activePuzzles.containsKey(puzzleId)) {
      final data = activePuzzles[puzzleId];
      if (data is Map && data['solved'] == true) return true;
    }
    return false;
  }

  /// Evaluate prerequisite requirements for attempting a puzzle.
  String? checkPrerequisites(GamePuzzle puzzle) {
    final req = puzzle.requirement;
    final state = _gameService.currentState;
    final knowledge = state.persistentKnowledge;
    final world = state.worldState;

    // Check location requirement
    if (req.requiredLocationId != null && world.playerLocationId != req.requiredLocationId) {
      return 'Must be located in room "${req.requiredLocationId}" to attempt puzzle.';
    }

    // Check minimum loop requirement
    if (req.minLoopNumber != null && state.currentLoopNumber < req.minLoopNumber!) {
      return 'Requires minimum temporal Loop #${req.minLoopNumber}.';
    }

    // Check timeline stage requirement
    if (req.requiredTimelineStage != null && _timeLoopService.currentStage != req.requiredTimelineStage) {
      return 'Requires timeline stage "${req.requiredTimelineStage?.name.toUpperCase()}".';
    }

    // Check physical or anchored item requirement
    if (req.requiredItemId != null) {
      final hasItem = world.physicalInventoryItemIds.contains(req.requiredItemId) ||
          knowledge.anchoredItemIds.contains(req.requiredItemId);
      if (!hasItem) {
        return 'LOCKED: Requires item "${req.requiredItemId}" in inventory or timeline anchor slot.';
      }
    }

    // Check code requirement
    if (req.requiredCodeId != null) {
      final hasCode = knowledge.unlockedCodeIds.contains(req.requiredCodeId) ||
          knowledge.discoveredClueIds.contains(req.requiredCodeId);
      if (!hasCode) {
        return 'LOCKED: Requires combination code "${req.requiredCodeId}" recorded on Knowledge Board.';
      }
    }

    // Check clue requirement
    if (req.requiredClueId != null) {
      final hasClue = knowledge.discoveredClueIds.contains(req.requiredClueId);
      if (!hasClue) {
        return 'LOCKED: Requires prerequisite clue "${req.requiredClueId}".';
      }
    }

    return null; // All prerequisites satisfied
  }

  /// Attempt to solve a puzzle with input solution string.
  Future<PuzzleResult> attemptPuzzle(String puzzleId, String inputSolution) async {
    final puzzle = PuzzleRepository.getPuzzleById(puzzleId);
    if (puzzle == null) {
      return PuzzleResult.failureResult('Puzzle ID not found: $puzzleId');
    }

    // Check prerequisites
    final reqError = checkPrerequisites(puzzle);
    if (reqError != null) {
      return PuzzleResult.failureResult(reqError);
    }

    // Solution validation
    final isCorrect = inputSolution.trim().toLowerCase() == puzzle.correctSolution.trim().toLowerCase();
    if (!isCorrect) {
      return PuzzleResult.failureResult('INCORRECT COMBINATION OR MANIPULATION FAILED.');
    }

    // Process puzzle solution success state
    _gameService.updatePuzzleState(puzzleId, {'solved': true});

    // Process clue unlock (PERSISTENT)
    if (puzzle.clueIdToUnlock != null) {
      await _gameService.discoverClue(puzzle.clueIdToUnlock!);
      await _gameService.addKnowledgeBoardTopic(puzzle.clueIdToUnlock!);
    }

    // Process code unlock (PERSISTENT)
    if (puzzle.codeIdToUnlock != null) {
      await _gameService.unlockCode(puzzle.codeIdToUnlock!);
    }

    // Process item grant (RESETTABLE)
    if (puzzle.itemToGrant != null) {
      final currentPhysical = List<String>.from(_gameService.currentState.worldState.physicalInventoryItemIds);
      if (!currentPhysical.contains(puzzle.itemToGrant!)) {
        currentPhysical.add(puzzle.itemToGrant!);
        _gameService.updateRoomState(puzzle.locationId, {'grantedItem': puzzle.itemToGrant});
      }
    }

    notifyListeners();

    return PuzzleResult.successResult(
      message: 'PUZZLE SOLVED: ${puzzle.title} successfully unlocked!',
      clueId: puzzle.clueIdToUnlock,
      codeId: puzzle.codeIdToUnlock,
      itemId: puzzle.itemToGrant,
    );
  }
}
