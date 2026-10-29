// lib/core/repositories/item_repository.dart
import 'package:flutter/material.dart';
import '../models/inventory_item.dart';

/// Repository providing canonical item definitions for the game.
class ItemRepository {
  static final Map<String, InventoryItem> _items = {
    'brass_master_key': const InventoryItem(
      id: 'brass_master_key',
      name: 'Brass Master Key',
      category: 'Key / Equipment',
      description: 'Heavy brass key stamped "Master 1924". Unlocks 1st floor guest suites and room doors.',
      icon: Icons.vpn_key_rounded,
      isAnchorable: true,
    ),
    'caretaker_note': const InventoryItem(
      id: 'caretaker_note',
      name: 'Caretaker Note',
      category: 'Document / Paper',
      description: 'Handwritten paper containing maintenance code "1157" for the Basement Generator panel.',
      icon: Icons.description_outlined,
      isAnchorable: true,
    ),
    'temporal_anchor_device': const InventoryItem(
      id: 'temporal_anchor_device',
      name: 'Temporal Coil Device',
      category: 'Artifact / Device',
      description: 'Vintage pocket clock modified with a glowing brass temporal anchor coil.',
      icon: Icons.timelapse_rounded,
      isAnchorable: true,
    ),
    'sibling_steel_lockbox': const InventoryItem(
      id: 'sibling_steel_lockbox',
      name: 'Sibling Steel Lockbox',
      category: 'Container / Evidence',
      description: 'Compact steel lockbox containing sibling research notes and hotel archive schematics.',
      icon: Icons.inventory_2_outlined,
      isAnchorable: true,
    ),
  };

  static InventoryItem? getItemById(String id) => _items[id];

  static List<InventoryItem> getAllItems() => _items.values.toList();
}
