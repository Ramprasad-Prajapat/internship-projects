// lib/core/models/inventory_item.dart
import 'package:flutter/material.dart';

/// Model representing a physical or anchored inventory item in the game world.
class InventoryItem {
  final String id;
  final String name;
  final String category;
  final String description;
  final IconData icon;
  final bool isAnchorable;

  const InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.icon,
    this.isAnchorable = true,
  });
}
