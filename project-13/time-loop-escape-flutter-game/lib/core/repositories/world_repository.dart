// lib/core/repositories/world_repository.dart
import 'package:flutter/material.dart';
import '../models/hotel_location.dart';

/// Repository providing static canonical world data for the 8 hotel locations.
class WorldRepository {
  static const String initialLocationId = 'lobby_reception';

  static final Map<String, HotelLocation> _locations = {
    'lobby_reception': const HotelLocation(
      id: 'lobby_reception',
      name: 'Lobby & Reception Desk',
      areaTag: 'GROUND FLOOR',
      description: 'Carved teakwood reception counter beneath a frozen brass chandelier. A heavy grandfather clock stands silent.',
      icon: Icons.hotel_rounded,
      connectedLocationIds: ['guest_corridor_1f', 'elevator_shaft', 'grand_ballroom'],
      interactions: [
        LocationInteraction(
          id: 'inspect_grandfather_clock',
          title: 'Inspect Stopped Grandfather Clock',
          description: 'The clock pendulum is frozen at 11:57:00 PM. A engraved brass plaque reads "Kalchakra 1924".',
          type: InteractionType.inspect,
          clueIdToUnlock: 'clue_frozen_clock',
        ),
        LocationInteraction(
          id: 'read_guest_register',
          title: 'Examine Leather Guest Register',
          description: 'Pages list guest check-ins from dates in 1924, 1978, and tomorrow.',
          type: InteractionType.read,
          clueIdToUnlock: 'clue_guest_register_dates',
        ),
      ],
    ),
    'guest_corridor_1f': const HotelLocation(
      id: 'guest_corridor_1f',
      name: '1st Floor Guest Corridor',
      areaTag: '1ST FLOOR',
      description: 'Dimly lit corridor lined with silk tapestries and numbered wooden doors.',
      icon: Icons.meeting_room_rounded,
      connectedLocationIds: ['lobby_reception', 'room_101', 'room_305'],
      interactions: [
        LocationInteraction(
          id: 'inspect_tapestry_wall',
          title: 'Inspect Rajasthan Wall Tapestry',
          description: 'A woven pattern depicting a sun wheel turning backwards.',
          type: InteractionType.inspect,
          clueIdToUnlock: 'clue_sun_wheel_symbol',
        ),
      ],
    ),
    'room_101': const HotelLocation(
      id: 'room_101',
      name: 'Room 101 — Caretaker Quarters',
      areaTag: '1ST FLOOR',
      description: 'Small staff bedroom containing a workbench, ring of keys, and handwritten logbook.',
      icon: Icons.bedroom_parent_outlined,
      connectedLocationIds: ['guest_corridor_1f'],
      interactions: [
        LocationInteraction(
          id: 'pickup_master_key',
          title: 'Pick Up Brass Master Key',
          description: 'Heavy brass key labeled "Master 1924". Fits hotel locks.',
          type: InteractionType.pickup,
          itemToPickup: 'brass_master_key',
        ),
        LocationInteraction(
          id: 'read_caretaker_note',
          title: 'Read Caretaker Maintenance Note',
          description: 'Jotted note reads: "Basement generator fuse combination: 1-1-5-7".',
          type: InteractionType.read,
          codeIdToUnlock: 'code_generator_fuse_1157',
        ),
      ],
    ),
    'room_305': const HotelLocation(
      id: 'room_305',
      name: 'Room 305 — Missing Sibling Quarters',
      areaTag: '1ST FLOOR',
      description: 'Disheveled suite with open suitcases, map pins on walls, and a locked steel briefcase.',
      icon: Icons.sensor_door_outlined,
      connectedLocationIds: ['guest_corridor_1f'],
      isLocked: true,
      requiredKeyOrCodeId: 'brass_master_key',
      interactions: [
        LocationInteraction(
          id: 'unlock_sibling_briefcase',
          title: 'Unlock Sibling Steel Briefcase',
          description: 'Requires maintenance code 1157 discovered from Caretaker Note.',
          type: InteractionType.unlock,
          requiredKeyId: 'code_generator_fuse_1157',
          clueIdToUnlock: 'clue_sibling_journal_entry',
        ),
        LocationInteraction(
          id: 'inspect_wall_map',
          title: 'Inspect Sibling Mystery Wall Map',
          description: 'Red string connects the Lobby Clock to the Secret Basement Archive.',
          type: InteractionType.inspect,
          clueIdToUnlock: 'clue_archive_location',
        ),
      ],
    ),
    'elevator_shaft': const HotelLocation(
      id: 'elevator_shaft',
      name: 'Heritage Brass Elevator',
      areaTag: 'GROUND FLOOR',
      description: 'Ornate brass cage elevator with floor indicator dial pointing between 1st Floor and Basement.',
      icon: Icons.elevator_rounded,
      connectedLocationIds: ['lobby_reception', 'basement_generator'],
      interactions: [
        LocationInteraction(
          id: 'inspect_elevator_dial',
          title: 'Inspect Brass Floor Dial',
          description: 'Dial housing reveals a hidden manual override lever for Basement access.',
          type: InteractionType.inspect,
          clueIdToUnlock: 'clue_elevator_override',
        ),
      ],
    ),
    'basement_generator': const HotelLocation(
      id: 'basement_generator',
      name: 'Basement Maintenance & Generator',
      areaTag: 'BASEMENT',
      description: 'Humming electric generator, copper steam pipes, and heavy iron archways.',
      icon: Icons.build_circle_outlined,
      connectedLocationIds: ['elevator_shaft', 'hotel_archive'],
      interactions: [
        LocationInteraction(
          id: 'inspect_fuse_box',
          title: 'Inspect Generator Fuse Panel',
          description: 'Digital lock requires 4-digit code to restore emergency power.',
          type: InteractionType.unlock,
          requiredKeyId: 'code_generator_fuse_1157',
          clueIdToUnlock: 'clue_generator_power_restored',
        ),
      ],
    ),
    'grand_ballroom': const HotelLocation(
      id: 'grand_ballroom',
      name: 'Grand Haveli Ballroom',
      areaTag: 'GROUND FLOOR',
      description: 'High vaulted ceiling with marble arches, a grand piano, and a towering antique mirror.',
      icon: Icons.stadium_outlined,
      connectedLocationIds: ['lobby_reception'],
      interactions: [
        LocationInteraction(
          id: 'inspect_mirror_reflection',
          title: 'Examine Antique Mirror Reflection',
          description: 'The reflection shows the ballroom at midnight full of shadowy figures.',
          type: InteractionType.inspect,
          clueIdToUnlock: 'clue_mirror_reflection_echo',
        ),
      ],
    ),
    'hotel_archive': const HotelLocation(
      id: 'hotel_archive',
      name: 'Secret Hotel Archive',
      areaTag: 'BASEMENT',
      description: 'Hidden room behind iron bookshelving containing founding ledgers from 1924.',
      icon: Icons.inventory_2_outlined,
      connectedLocationIds: ['basement_generator'],
      isLocked: true,
      requiredKeyOrCodeId: 'clue_generator_power_restored',
      interactions: [
        LocationInteraction(
          id: 'read_1924_ledger',
          title: 'Read 1924 Hotel Founding Ledger',
          description: 'Records reveal the hotel was built over an ancient temporal anomaly.',
          type: InteractionType.read,
          clueIdToUnlock: 'clue_temporal_anomaly_origin',
        ),
      ],
    ),
  };

  static List<HotelLocation> getAllLocations() => _locations.values.toList();

  static HotelLocation? getLocationById(String id) => _locations[id];
}
