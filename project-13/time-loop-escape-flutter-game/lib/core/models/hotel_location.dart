// lib/core/models/hotel_location.dart
import 'package:flutter/material.dart';

/// Interaction type within a hotel room.
enum InteractionType {
  inspect,
  unlock,
  pickup,
  read,
  talk,
}

/// Model representing an interactive object/hotspot within a hotel location.
class LocationInteraction {
  final String id;
  final String title;
  final String description;
  final InteractionType type;
  final String? clueIdToUnlock;
  final String? codeIdToUnlock;
  final String? itemToPickup;
  final String? requiredKeyId;

  const LocationInteraction({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    this.clueIdToUnlock,
    this.codeIdToUnlock,
    this.itemToPickup,
    this.requiredKeyId,
  });
}

/// Model representing a canonical location in the Heritage Hotel Kalchakra.
class HotelLocation {
  final String id;
  final String name;
  final String areaTag; // e.g. "GROUND FLOOR", "1ST FLOOR", "BASEMENT"
  final String description;
  final IconData icon;
  final List<String> connectedLocationIds;
  final bool isLocked;
  final String? requiredKeyOrCodeId;
  final List<LocationInteraction> interactions;

  const HotelLocation({
    required this.id,
    required this.name,
    required this.areaTag,
    required this.description,
    required this.icon,
    required this.connectedLocationIds,
    this.isLocked = false,
    this.requiredKeyOrCodeId,
    this.interactions = const [],
  });
}
