// lib/core/services/inventory_service.dart
import 'package:flutter/foundation.dart';
import '../models/inventory_item.dart';
import '../repositories/item_repository.dart';
import 'game_service.dart';

/// Domain service managing physical item state, timeline anchor selection, and item inspect actions.
class InventoryService extends ChangeNotifier {
  final GameService _gameService;

  InventoryService(this._gameService);

  /// Get list of physical inventory items currently held (RESETTABLE at midnight).
  List<InventoryItem> get physicalItems {
    final physicalIds = _gameService.currentState.worldState.physicalInventoryItemIds;
    return physicalIds
        .map((id) => ItemRepository.getItemById(id))
        .whereType<InventoryItem>()
        .toList();
  }

  /// Get current timeline-anchored item (PERSISTENT across loop reset).
  InventoryItem? get anchoredItem {
    final anchoredIds = _gameService.currentState.persistentKnowledge.anchoredItemIds;
    if (anchoredIds.isEmpty) return null;
    return ItemRepository.getItemById(anchoredIds.first);
  }

  /// Set physical item as the timeline anchor item (survives loop reset).
  Future<void> setTimelineAnchor(String itemId) async {
    await _gameService.setAnchoredItem(itemId);
    notifyListeners();
  }

  /// Pickup a physical item and add it to the resettable inventory.
  Future<void> pickupPhysicalItem(String itemId) async {
    await _gameService.addPhysicalItem(itemId);
    notifyListeners();
  }

  /// Check if a given item is currently in the resettable inventory.
  bool isItemInInventory(String itemId) {
    final ids = _gameService.currentState.worldState.physicalInventoryItemIds;
    return ids.contains(itemId);
  }
}
