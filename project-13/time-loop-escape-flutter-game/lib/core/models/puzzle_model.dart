// lib/core/models/puzzle_model.dart
import '../models/timeline_event.dart';

/// Puzzle mechanics classification defined by Phase 10 specification.
enum PuzzleType {
  observation,
  timing,
  physicalManipulation,
  dialogue,
  crossLoop,
  environmental,
  moralDecision,
}

/// Prerequisite requirement required to attempt a puzzle.
class PuzzleRequirement {
  final String? requiredLocationId;
  final String? requiredItemId;
  final String? requiredCodeId;
  final String? requiredClueId;
  final TimelineStage? requiredTimelineStage;
  final int? minLoopNumber;

  const PuzzleRequirement({
    this.requiredLocationId,
    this.requiredItemId,
    this.requiredCodeId,
    this.requiredClueId,
    this.requiredTimelineStage,
    this.minLoopNumber,
  });
}

/// Result returned after attempting a puzzle solution.
class PuzzleResult {
  final bool success;
  final String feedbackMessage;
  final String? unlockedClueId;
  final String? unlockedCodeId;
  final String? acquiredItemId;
  final String? failureReason;

  const PuzzleResult({
    required this.success,
    required this.feedbackMessage,
    this.unlockedClueId,
    this.unlockedCodeId,
    this.acquiredItemId,
    this.failureReason,
  });

  factory PuzzleResult.successResult({
    required String message,
    String? clueId,
    String? codeId,
    String? itemId,
  }) {
    return PuzzleResult(
      success: true,
      feedbackMessage: message,
      unlockedClueId: clueId,
      unlockedCodeId: codeId,
      acquiredItemId: itemId,
    );
  }

  factory PuzzleResult.failureResult(String reason) {
    return PuzzleResult(
      success: false,
      feedbackMessage: reason,
      failureReason: reason,
    );
  }
}

/// Model representing a formal puzzle mechanism in the game world.
class GamePuzzle {
  final String id;
  final String locationId;
  final String title;
  final String description;
  final PuzzleType type;
  final PuzzleRequirement requirement;
  final String correctSolution;
  final String? clueIdToUnlock;
  final String? codeIdToUnlock;
  final String? itemToGrant;

  const GamePuzzle({
    required this.id,
    required this.locationId,
    required this.title,
    required this.description,
    required this.type,
    required this.correctSolution,
    this.requirement = const PuzzleRequirement(),
    this.clueIdToUnlock,
    this.codeIdToUnlock,
    this.itemToGrant,
  });
}
