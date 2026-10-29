// lib/core/models/interaction_model.dart
import '../models/timeline_event.dart';

/// Mobile interaction type modes defined by Phase 08 specification.
enum MobileInteractionType {
  tapInspect,
  readDocument,
  unlockMechanism,
  pickupItem,
  holdHighlight,
  dragManipulate,
}

/// Status of an interaction availability evaluation.
enum InteractionAvailability {
  available,
  lockedMissingItem,
  lockedMissingCode,
  lockedStageRequirement,
  alreadyCompleted,
}

/// Prerequisite condition required before an interaction can be executed.
class InteractionCondition {
  final String? requiredLocationId;
  final String? requiredItemInInventory;
  final String? requiredCodeUnlocked;
  final String? requiredClueDiscovered;
  final TimelineStage? requiredTimelineStage;
  final int? minLoopNumber;
  final bool isOneTimeOnly;

  const InteractionCondition({
    this.requiredLocationId,
    this.requiredItemInInventory,
    this.requiredCodeUnlocked,
    this.requiredClueDiscovered,
    this.requiredTimelineStage,
    this.minLoopNumber,
    this.isOneTimeOnly = false,
  });
}

/// Result returned after executing an interaction.
class InteractionResult {
  final bool success;
  final String feedbackMessage;
  final String? unlockedClueId;
  final String? unlockedCodeId;
  final String? acquiredItemId;
  final String? failureReason;

  const InteractionResult({
    required this.success,
    required this.feedbackMessage,
    this.unlockedClueId,
    this.unlockedCodeId,
    this.acquiredItemId,
    this.failureReason,
  });

  factory InteractionResult.successResult({
    required String message,
    String? clueId,
    String? codeId,
    String? itemId,
  }) {
    return InteractionResult(
      success: true,
      feedbackMessage: message,
      unlockedClueId: clueId,
      unlockedCodeId: codeId,
      acquiredItemId: itemId,
    );
  }

  factory InteractionResult.failureResult(String reason) {
    return InteractionResult(
      success: false,
      feedbackMessage: reason,
      failureReason: reason,
    );
  }
}

/// Model representing a formal interactable object in the game world.
class GameInteraction {
  final String id;
  final String targetLocationId;
  final String title;
  final String description;
  final MobileInteractionType interactionType;
  final InteractionCondition condition;
  final String? clueIdToUnlock;
  final String? codeIdToUnlock;
  final String? itemToPickup;

  const GameInteraction({
    required this.id,
    required this.targetLocationId,
    required this.title,
    required this.description,
    required this.interactionType,
    this.condition = const InteractionCondition(),
    this.clueIdToUnlock,
    this.codeIdToUnlock,
    this.itemToPickup,
  });
}
