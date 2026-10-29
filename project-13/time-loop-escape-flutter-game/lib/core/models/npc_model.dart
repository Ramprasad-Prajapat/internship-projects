// lib/core/models/npc_model.dart
import 'package:flutter/material.dart';

/// Model representing a deterministic NPC schedule event on the 5-minute loop timeline.
class NpcScheduleEvent {
  final int startSeconds;
  final int endSeconds;
  final String locationId;
  final String statusDescription;

  const NpcScheduleEvent({
    required this.startSeconds,
    required this.endSeconds,
    required this.locationId,
    required this.statusDescription,
  });
}

/// Model representing a canonical NPC in the game world.
class NpcModel {
  final String id;
  final String name;
  final String role;
  final String description;
  final IconData icon;
  final List<NpcScheduleEvent> schedule;

  const NpcModel({
    required this.id,
    required this.name,
    required this.role,
    required this.description,
    required this.icon,
    required this.schedule,
  });
}
