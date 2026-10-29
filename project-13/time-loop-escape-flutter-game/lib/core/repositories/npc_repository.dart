// lib/core/repositories/npc_repository.dart
import 'package:flutter/material.dart';
import '../models/npc_model.dart';

/// Repository providing canonical NPC schedule definitions matching the 5-minute timeline.
class NpcRepository {
  static final Map<String, NpcModel> _npcs = {
    'npc_caretaker': const NpcModel(
      id: 'npc_caretaker',
      name: 'Elderly Caretaker (Vikram)',
      role: 'Head Receptionist & Caretaker',
      description: 'Stern, aged hotel caretaker carrying heavy brass keys and wearing a faded 1920s receptionist uniform.',
      icon: Icons.person_pin_rounded,
      schedule: [
        NpcScheduleEvent(
          startSeconds: 0,
          endSeconds: 40,
          locationId: 'lobby_reception',
          statusDescription: 'Standing behind the reception desk inspecting the stopped grandfather clock.',
        ),
        NpcScheduleEvent(
          startSeconds: 40,
          endSeconds: 65,
          locationId: 'lobby_reception',
          statusDescription: 'Answering a crackling phone call at the reception desk.',
        ),
        NpcScheduleEvent(
          startSeconds: 65,
          endSeconds: 90,
          locationId: 'room_101',
          statusDescription: 'Placing the Brass Master Key in Room 101 desk drawer.',
        ),
        NpcScheduleEvent(
          startSeconds: 90,
          endSeconds: 150,
          locationId: 'guest_corridor_1f',
          statusDescription: 'Patrolling the 1st floor guest corridor near Room 305.',
        ),
        NpcScheduleEvent(
          startSeconds: 150,
          endSeconds: 300,
          locationId: 'grand_ballroom',
          statusDescription: 'Inspecting the locked ballroom doors as temporal resonance intensifies.',
        ),
      ],
    ),
    'npc_sibling_ghost': const NpcModel(
      id: 'npc_sibling_ghost',
      name: 'Missing Sibling Projection',
      role: 'Temporal Echo / Investigator',
      description: 'Flickering phantom image of your missing investigator sibling from a previous temporal loop.',
      icon: Icons.blur_on_rounded,
      schedule: [
        NpcScheduleEvent(
          startSeconds: 150,
          endSeconds: 240,
          locationId: 'room_305',
          statusDescription: 'Examining the wall map in Room 305 quarters.',
        ),
        NpcScheduleEvent(
          startSeconds: 240,
          endSeconds: 300,
          locationId: 'hotel_archive',
          statusDescription: 'Deciphering the 1924 founding ledger inside the Secret Archive.',
        ),
      ],
    ),
  };

  static NpcModel? getNpcById(String id) => _npcs[id];

  static List<NpcModel> getAllNpcs() => _npcs.values.toList();
}
