// lib/core/services/interaction_service.dart
import 'package:flutter/foundation.dart';
import '../models/interaction_model.dart';
import 'game_service.dart';
import 'time_loop_service.dart';

/// Service managing mobile interaction execution, condition evaluation against game state,
/// persistent knowledge recording, and player feedback generation.
class InteractionService extends ChangeNotifier {
  final GameService _gameService;
  final TimeLoopService _timeLoopService;

  InteractionService(this._gameService, this._timeLoopService);

  /// Evaluate condition requirements for an interaction.
  InteractionAvailability checkAvailability(InteractionCondition condition) {
    final state = _gameService.currentState;
    final knowledge = state.persistentKnowledge;
    final world = state.worldState;

    // Check minimum loop number requirement
    if (condition.minLoopNumber != null && state.currentLoopNumber < condition.minLoopNumber!) {
      return InteractionAvailability.lockedStageRequirement;
    }

    // Check required timeline stage requirement
    if (condition.requiredTimelineStage != null &&
        _timeLoopService.currentStage != condition.requiredTimelineStage) {
      return InteractionAvailability.lockedStageRequirement;
    }

    // Check required inventory item
    if (condition.requiredItemInInventory != null) {
      final reqItem = condition.requiredItemInInventory!;
      final hasItem = world.physicalInventoryItemIds.contains(reqItem) ||
          knowledge.anchoredItemIds.contains(reqItem);
      if (!hasItem) {
        return InteractionAvailability.lockedMissingItem;
      }
    }

    // Check required unlocked code or clue
    if (condition.requiredCodeUnlocked != null) {
      final reqCode = condition.requiredCodeUnlocked!;
      final hasCode = knowledge.unlockedCodeIds.contains(reqCode) ||
          knowledge.discoveredClueIds.contains(reqCode);
      if (!hasCode) {
        return InteractionAvailability.lockedMissingCode;
      }
    }

    return InteractionAvailability.available;
  }

  /// Execute an interaction and update GameState / PersistentKnowledgeState.
  Future<InteractionResult> executeInteraction(GameInteraction interaction) async {
    final availability = checkAvailability(interaction.condition);

    if (availability != InteractionAvailability.available) {
      switch (availability) {
        case InteractionAvailability.lockedMissingItem:
          return InteractionResult.failureResult(
            'LOCKED: Requires item "${interaction.condition.requiredItemInInventory}" in physical or anchored inventory.',
          );
        case InteractionAvailability.lockedMissingCode:
          return InteractionResult.failureResult(
            'LOCKED: Requires code or combination "${interaction.condition.requiredCodeUnlocked}" recorded on Knowledge Board.',
          );
        case InteractionAvailability.lockedStageRequirement:
          return InteractionResult.failureResult(
            'UNAVAILABLE: This temporal event only occurs during timeline stage "${interaction.condition.requiredTimelineStage?.name.toUpperCase()}".',
          );
        default:
          return InteractionResult.failureResult('LOCKED: Prerequisites not satisfied.');
      }
    }

    // Process clue discovery (PERSISTENT: survives reset)
    if (interaction.clueIdToUnlock != null) {
      await _gameService.discoverClue(interaction.clueIdToUnlock!);
      await _gameService.addKnowledgeBoardTopic(interaction.clueIdToUnlock!);
    }

    // Process code unlock (PERSISTENT: survives reset)
    if (interaction.codeIdToUnlock != null) {
      await _gameService.unlockCode(interaction.codeIdToUnlock!);
    }

    // Process physical item pickup (RESETTABLE: resets at 12:00)
    if (interaction.itemToPickup != null) {
      await _gameService.addPhysicalItem(interaction.itemToPickup!);
      _gameService.updateRoomState(interaction.targetLocationId, {
        'pickedUpItem': interaction.itemToPickup,
        'lastInteractionTime': _timeLoopService.elapsedSeconds,
      });
    }

    notifyListeners();

    return InteractionResult.successResult(
      message: interaction.description,
      clueId: interaction.clueIdToUnlock,
      codeId: interaction.codeIdToUnlock,
      itemId: interaction.itemToPickup,
    );
  }
}
