// lib/core/models/ending_model.dart
import 'game_state.dart';

/// Categories of endings defined in the research.
enum EndingCategory {
  escape,
  sibling,
  truth,
  secret,
}

/// Prerequisite conditions that must be satisfied in accumulated GameState
/// for an ending to become reachable.
class EndingRequirement {
  final int? requiredChapter;
  final List<String> requiredClueIds;
  final List<String> requiredCodeIds;
  final List<String> requiredDialogueTopicIds;
  final List<String> requiredSolvedPuzzleIds;
  final String? requiredAnchoredItemId;
  final String? requiredLocationId;

  const EndingRequirement({
    this.requiredChapter,
    this.requiredClueIds = const [],
    this.requiredCodeIds = const [],
    this.requiredDialogueTopicIds = const [],
    this.requiredSolvedPuzzleIds = const [],
    this.requiredAnchoredItemId,
    this.requiredLocationId,
  });

  /// Deterministically evaluates whether current GameState meets all conditions.
  bool isSatisfied(GameState state) {
    // 1. Chapter requirement
    if (requiredChapter != null &&
        state.persistentKnowledge.currentChapter < requiredChapter!) {
      return false;
    }

    // 2. Discovered clue requirements
    for (final clueId in requiredClueIds) {
      if (!state.persistentKnowledge.discoveredClueIds.contains(clueId)) {
        return false;
      }
    }

    // 3. Unlocked code requirements
    for (final codeId in requiredCodeIds) {
      if (!state.persistentKnowledge.unlockedCodeIds.contains(codeId)) {
        return false;
      }
    }

    // 4. Unlocked dialogue topic requirements
    for (final topicId in requiredDialogueTopicIds) {
      if (!state.persistentKnowledge.unlockedDialogueTopicIds.contains(topicId)) {
        return false;
      }
    }

    // 5. Solved puzzle requirements
    for (final puzzleId in requiredSolvedPuzzleIds) {
      final puzzleState = state.worldState.activePuzzleStates[puzzleId];
      final isSolvedInState = puzzleState != null && puzzleState['solved'] == true;
      if (!isSolvedInState) {
        return false;
      }
    }

    // 6. Anchored / physical item requirement
    if (requiredAnchoredItemId != null) {
      final isAnchored = state.persistentKnowledge.anchoredItemIds.contains(requiredAnchoredItemId);
      final inPhysicalInventory = state.worldState.physicalInventoryItemIds.contains(requiredAnchoredItemId);
      if (!isAnchored && !inPhysicalInventory) {
        return false;
      }
    }

    // 7. Location requirement
    if (requiredLocationId != null &&
        state.worldState.playerLocationId != requiredLocationId) {
      return false;
    }

    return true;
  }

  Map<String, dynamic> toJson() => {
        'requiredChapter': requiredChapter,
        'requiredClueIds': requiredClueIds,
        'requiredCodeIds': requiredCodeIds,
        'requiredDialogueTopicIds': requiredDialogueTopicIds,
        'requiredSolvedPuzzleIds': requiredSolvedPuzzleIds,
        'requiredAnchoredItemId': requiredAnchoredItemId,
        'requiredLocationId': requiredLocationId,
      };

  factory EndingRequirement.fromJson(Map<String, dynamic> json) {
    return EndingRequirement(
      requiredChapter: json['requiredChapter'] as int?,
      requiredClueIds: List<String>.from(json['requiredClueIds'] ?? []),
      requiredCodeIds: List<String>.from(json['requiredCodeIds'] ?? []),
      requiredDialogueTopicIds: List<String>.from(json['requiredDialogueTopicIds'] ?? []),
      requiredSolvedPuzzleIds: List<String>.from(json['requiredSolvedPuzzleIds'] ?? []),
      requiredAnchoredItemId: json['requiredAnchoredItemId'] as String?,
      requiredLocationId: json['requiredLocationId'] as String?,
    );
  }
}

/// Production domain model representing an ending definition.
class EndingModel {
  final String id;
  final String title;
  final String description;
  final String narrativeConclusion;
  final String recap;
  final EndingCategory category;
  final int priority;
  final bool isEnabledForMvp;
  final EndingRequirement requirement;

  const EndingModel({
    required this.id,
    required this.title,
    required this.description,
    required this.narrativeConclusion,
    required this.recap,
    required this.category,
    required this.priority,
    required this.isEnabledForMvp,
    required this.requirement,
  });

  bool isReachable(GameState state) {
    if (!isEnabledForMvp) return false;
    return requirement.isSatisfied(state);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'narrativeConclusion': narrativeConclusion,
        'recap': recap,
        'category': category.name,
        'priority': priority,
        'isEnabledForMvp': isEnabledForMvp,
        'requirement': requirement.toJson(),
      };

  factory EndingModel.fromJson(Map<String, dynamic> json) {
    final catName = json['category'] as String? ?? 'escape';
    final category = EndingCategory.values.firstWhere(
      (e) => e.name == catName,
      orElse: () => EndingCategory.escape,
    );

    return EndingModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      narrativeConclusion: json['narrativeConclusion'] as String,
      recap: json['recap'] as String,
      category: category,
      priority: json['priority'] as int? ?? 0,
      isEnabledForMvp: json['isEnabledForMvp'] as bool? ?? false,
      requirement: EndingRequirement.fromJson(json['requirement'] ?? {}),
    );
  }
}
