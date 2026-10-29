// lib/core/services/exploration_service.dart
import 'package:flutter/foundation.dart';
import '../errors/app_exception.dart';
import '../models/hotel_location.dart';
import '../repositories/world_repository.dart';
import 'game_service.dart';

/// Domain service orchestrating hotel world exploration, location movement, lock verification,
/// and interactive hotspot execution.
class ExplorationService extends ChangeNotifier {
  final GameService _gameService;

  ExplorationService(this._gameService);

  HotelLocation get currentLocation {
    final locationId = _gameService.currentState.worldState.playerLocationId;
    return WorldRepository.getLocationById(locationId) ??
        WorldRepository.getLocationById(WorldRepository.initialLocationId)!;
  }

  List<HotelLocation> get connectedLocations {
    return currentLocation.connectedLocationIds
        .map((id) => WorldRepository.getLocationById(id))
        .whereType<HotelLocation>()
        .toList();
  }

  /// Check if a target location is unlocked for entry.
  bool canEnterLocation(HotelLocation targetLocation) {
    if (!targetLocation.isLocked) return true;

    final req = targetLocation.requiredKeyOrCodeId;
    if (req == null) return true;

    final knowledge = _gameService.currentState.persistentKnowledge;
    final world = _gameService.currentState.worldState;

    // Check persistent codes/clues or physical/anchored items
    final hasCode = knowledge.unlockedCodeIds.contains(req) || knowledge.discoveredClueIds.contains(req);
    final hasItem = world.physicalInventoryItemIds.contains(req) || knowledge.anchoredItemIds.contains(req);

    return hasCode || hasItem;
  }

  /// Move player to target location.
  Future<bool> moveToLocation(String targetLocationId) async {
    final target = WorldRepository.getLocationById(targetLocationId);
    if (target == null) {
      throw StateException('Invalid target location: $targetLocationId');
    }

    if (!canEnterLocation(target)) {
      return false; // Locked destination
    }

    _gameService.updatePlayerLocation(targetLocationId);
    notifyListeners();
    return true;
  }

  /// Execute an interactive hotspot action in current room.
  Future<String> executeInteraction(LocationInteraction interaction) async {
    final knowledge = _gameService.currentState.persistentKnowledge;

    // Check interaction lock requirements
    if (interaction.requiredKeyId != null) {
      final req = interaction.requiredKeyId!;
      final hasReq = knowledge.unlockedCodeIds.contains(req) ||
          knowledge.discoveredClueIds.contains(req) ||
          _gameService.currentState.worldState.physicalInventoryItemIds.contains(req);
      if (!hasReq) {
        return 'LOCKED: Requires $req';
      }
    }

    // Process clue unlocks (PERSISTENT)
    if (interaction.clueIdToUnlock != null) {
      await _gameService.discoverClue(interaction.clueIdToUnlock!);
      await _gameService.addKnowledgeBoardTopic(interaction.clueIdToUnlock!);
    }

    // Process code unlocks (PERSISTENT)
    if (interaction.codeIdToUnlock != null) {
      await _gameService.unlockCode(interaction.codeIdToUnlock!);
    }

    // Process physical item pickup (RESETTABLE, can be anchored)
    if (interaction.itemToPickup != null) {
      await _gameService.addPhysicalItem(interaction.itemToPickup!);
      _gameService.updateRoomState(currentLocation.id, {'lastInteraction': interaction.id});
    }

    notifyListeners();
    return interaction.description;
  }
}
