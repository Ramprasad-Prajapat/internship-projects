// lib/core/models/hint_model.dart

/// Staged hint level enum defined by Phase 12 specification.
enum HintLevel {
  subtle, // Level 1 — Direction
  direct, // Level 2 — Focus
  solution, // Level 3 — Guidance
}

extension HintLevelExtension on HintLevel {
  String get displayName {
    switch (this) {
      case HintLevel.subtle:
        return 'LEVEL 1 — DIRECTION';
      case HintLevel.direct:
        return 'LEVEL 2 — FOCUS';
      case HintLevel.solution:
        return 'LEVEL 3 — GUIDANCE';
    }
  }
}

/// Model representing a staged hint for an active game puzzle.
class GameHint {
  final String id;
  final String puzzleId;
  final HintLevel level;
  final String title;
  final String hintText;
  final String locationId;
  final String? requiredClueId;
  final String? requiredItemId;
  final String? requiredCodeId;

  const GameHint({
    required this.id,
    required this.puzzleId,
    required this.level,
    required this.title,
    required this.hintText,
    required this.locationId,
    this.requiredClueId,
    this.requiredItemId,
    this.requiredCodeId,
  });
}
