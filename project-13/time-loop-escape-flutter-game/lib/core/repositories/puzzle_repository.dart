// lib/core/repositories/puzzle_repository.dart
import '../models/puzzle_model.dart';
import '../models/timeline_event.dart';

/// Repository providing canonical MVP puzzles for the Heritage Hotel Kalchakra.
class PuzzleRepository {
  static final Map<String, GamePuzzle> _puzzles = {
    'puzzle_lobby_clock': const GamePuzzle(
      id: 'puzzle_lobby_clock',
      locationId: 'lobby_reception',
      title: 'Lobby Grandfather Clock Plaque',
      description: 'Examine frozen clock pendulum and engraved brass plaque.',
      type: PuzzleType.observation,
      correctSolution: 'kalchakra_1924',
      clueIdToUnlock: 'clue_frozen_clock',
    ),
    'puzzle_guest_register': const GamePuzzle(
      id: 'puzzle_guest_register',
      locationId: 'lobby_reception',
      title: 'Leather Guest Register Dates',
      description: 'Examine check-in date timestamps in the reception logbook.',
      type: PuzzleType.observation,
      correctSolution: 'future_dates',
      clueIdToUnlock: 'clue_guest_register_dates',
    ),
    'puzzle_caretaker_note': const GamePuzzle(
      id: 'puzzle_caretaker_note',
      locationId: 'room_101',
      title: 'Caretaker Maintenance Note',
      description: 'Read maintenance paper to discover generator fuse combination.',
      type: PuzzleType.crossLoop,
      correctSolution: 'read_note',
      codeIdToUnlock: 'code_generator_fuse_1157',
    ),
    'puzzle_room_305_door': const GamePuzzle(
      id: 'puzzle_room_305_door',
      locationId: 'guest_corridor_1f',
      title: 'Room 305 Door Keylock',
      description: 'Requires Brass Master Key to unlock Room 305 suite door.',
      type: PuzzleType.crossLoop,
      requirement: PuzzleRequirement(
        requiredLocationId: 'guest_corridor_1f',
        requiredItemId: 'brass_master_key',
      ),
      correctSolution: 'brass_master_key',
    ),
    'puzzle_sibling_lockbox': const GamePuzzle(
      id: 'puzzle_sibling_lockbox',
      locationId: 'room_305',
      title: 'Sibling Steel Briefcase Lock',
      description: 'Input 4-digit code discovered from Caretaker Note.',
      type: PuzzleType.crossLoop,
      requirement: PuzzleRequirement(
        requiredLocationId: 'room_305',
        requiredCodeId: 'code_generator_fuse_1157',
      ),
      correctSolution: '1157',
      clueIdToUnlock: 'clue_sibling_journal_entry',
    ),
    'puzzle_elevator_dial': const GamePuzzle(
      id: 'puzzle_elevator_dial',
      locationId: 'elevator_shaft',
      title: 'Elevator Floor Indicator Dial',
      description: 'Align manual override lever to release elevator to Basement.',
      type: PuzzleType.physicalManipulation,
      correctSolution: 'override_lever',
      clueIdToUnlock: 'clue_elevator_override',
    ),
    'puzzle_generator_fuse': const GamePuzzle(
      id: 'puzzle_generator_fuse',
      locationId: 'basement_generator',
      title: 'Generator Fuse Panel Keypad',
      description: 'Enter 4-digit maintenance combination to restore emergency power.',
      type: PuzzleType.environmental,
      requirement: PuzzleRequirement(
        requiredLocationId: 'basement_generator',
        requiredCodeId: 'code_generator_fuse_1157',
      ),
      correctSolution: '1157',
      clueIdToUnlock: 'clue_generator_power_restored',
    ),
    'puzzle_ballroom_echo': const GamePuzzle(
      id: 'puzzle_ballroom_echo',
      locationId: 'grand_ballroom',
      title: 'Ballroom Mirror Reflection',
      description: 'Observe antique mirror reflection during tension timeline stage.',
      type: PuzzleType.timing,
      requirement: PuzzleRequirement(
        requiredLocationId: 'grand_ballroom',
        requiredTimelineStage: TimelineStage.tension,
      ),
      correctSolution: 'observe_reflection',
      clueIdToUnlock: 'clue_mirror_reflection_echo',
    ),
    'puzzle_archive_door': const GamePuzzle(
      id: 'puzzle_archive_door',
      locationId: 'basement_generator',
      title: 'Secret Archive Iron Door',
      description: 'Requires emergency power restored to unlock iron bookshelf door.',
      type: PuzzleType.environmental,
      requirement: PuzzleRequirement(
        requiredLocationId: 'basement_generator',
        requiredClueId: 'clue_generator_power_restored',
      ),
      correctSolution: 'power_unlocked',
    ),
    'puzzle_founding_ledger': const GamePuzzle(
      id: 'puzzle_founding_ledger',
      locationId: 'hotel_archive',
      title: '1924 Hotel Founding Ledger',
      description: 'Read founding ledger to reveal the origin of the temporal anomaly.',
      type: PuzzleType.observation,
      correctSolution: 'read_ledger',
      clueIdToUnlock: 'clue_temporal_anomaly_origin',
    ),
  };

  static GamePuzzle? getPuzzleById(String id) => _puzzles[id];

  static List<GamePuzzle> getPuzzlesForLocation(String locationId) {
    return _puzzles.values.where((p) => p.locationId == locationId).toList();
  }

  static List<GamePuzzle> getAllPuzzles() => _puzzles.values.toList();
}
