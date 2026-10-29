// lib/core/repositories/hint_repository.dart
import '../models/hint_model.dart';

/// Repository providing canonical staged non-spoiler hints matching real MVP puzzles.
class HintRepository {
  static final Map<String, List<GameHint>> _puzzleHints = {
    'puzzle_lobby_clock': [
      const GameHint(
        id: 'hint_lobby_clock_1',
        puzzleId: 'puzzle_lobby_clock',
        level: HintLevel.subtle,
        title: 'Examine the Reception Wall',
        hintText: 'Observe the large grandfather clock hanging near the reception desk. Why is it stopped at 11:57 PM?',
        locationId: 'lobby_reception',
      ),
      const GameHint(
        id: 'hint_lobby_clock_2',
        puzzleId: 'puzzle_lobby_clock',
        level: HintLevel.direct,
        title: 'Inspect the Pendulum Plaque',
        hintText: 'Look closely at the brass plaque beneath the frozen clock pendulum for engraved founding details.',
        locationId: 'lobby_reception',
      ),
      const GameHint(
        id: 'hint_lobby_clock_3',
        puzzleId: 'puzzle_lobby_clock',
        level: HintLevel.solution,
        title: 'Clock Mechanism Solution',
        hintText: 'Interact with the clock mechanism to record the frozen time anomaly (11:57 PM) onto your Knowledge Board.',
        locationId: 'lobby_reception',
      ),
    ],
    'puzzle_caretaker_note': [
      const GameHint(
        id: 'hint_caretaker_note_1',
        puzzleId: 'puzzle_caretaker_note',
        level: HintLevel.subtle,
        title: 'Check Caretaker Quarters',
        hintText: 'Caretaker Vikram carries maintenance papers. Search Room 101 for handwritten instructions.',
        locationId: 'room_101',
      ),
      const GameHint(
        id: 'hint_caretaker_note_2',
        puzzleId: 'puzzle_caretaker_note',
        level: HintLevel.direct,
        title: 'Desk Drawer Document',
        hintText: 'Inspect the maintenance paper inside the desk drawer in Room 101 to find a 4-digit code.',
        locationId: 'room_101',
      ),
      const GameHint(
        id: 'hint_caretaker_note_3',
        puzzleId: 'puzzle_caretaker_note',
        level: HintLevel.solution,
        title: 'Generator Code 1157',
        hintText: 'Read the Caretaker Note to record combination code "1157" onto your Knowledge Board for later use.',
        locationId: 'room_101',
      ),
    ],
    'puzzle_room_305_door': [
      const GameHint(
        id: 'hint_room_305_1',
        puzzleId: 'puzzle_room_305_door',
        level: HintLevel.subtle,
        title: 'Locate the Master Key',
        hintText: 'Room 305 requires a heavy brass key. Watch Caretaker Vikram\'s timeline routine closely.',
        locationId: 'guest_corridor_1f',
      ),
      const GameHint(
        id: 'hint_room_305_2',
        puzzleId: 'puzzle_room_305_door',
        level: HintLevel.direct,
        title: 'Timeline Key Placement',
        hintText: 'At T+65s (11:58:05), Caretaker Vikram places the Brass Master Key in Room 101.',
        locationId: 'guest_corridor_1f',
      ),
      const GameHint(
        id: 'hint_room_305_3',
        puzzleId: 'puzzle_room_305_door',
        level: HintLevel.solution,
        title: 'Unlock Suite 305',
        hintText: 'Retrieve the Brass Master Key from Room 101 and unlock Room 305 before the loop resets.',
        locationId: 'guest_corridor_1f',
        requiredItemId: 'brass_master_key',
      ),
    ],
    'puzzle_sibling_lockbox': [
      const GameHint(
        id: 'hint_sibling_lockbox_1',
        puzzleId: 'puzzle_sibling_lockbox',
        level: HintLevel.subtle,
        title: 'Briefcase Keypad',
        hintText: 'Your missing sibling\'s steel briefcase requires a 4-digit maintenance combination.',
        locationId: 'room_305',
      ),
      const GameHint(
        id: 'hint_sibling_lockbox_2',
        puzzleId: 'puzzle_sibling_lockbox',
        level: HintLevel.direct,
        title: 'Maintenance Note Connection',
        hintText: 'The 4-digit code discovered on the Caretaker Note in Room 101 matches this briefcase keypad.',
        locationId: 'room_305',
        requiredCodeId: 'code_generator_fuse_1157',
      ),
      const GameHint(
        id: 'hint_sibling_lockbox_3',
        puzzleId: 'puzzle_sibling_lockbox',
        level: HintLevel.solution,
        title: 'Input Code 1157',
        hintText: 'Enter code "1157" into the briefcase keypad to open it and unlock your sibling\'s journal entry.',
        locationId: 'room_305',
      ),
    ],
    'puzzle_generator_fuse': [
      const GameHint(
        id: 'hint_generator_fuse_1',
        puzzleId: 'puzzle_generator_fuse',
        level: HintLevel.subtle,
        title: 'Restore Emergency Power',
        hintText: 'The basement is dark and silent. Search for the main fuse panel near the generator.',
        locationId: 'basement_generator',
      ),
      const GameHint(
        id: 'hint_generator_fuse_2',
        puzzleId: 'puzzle_generator_fuse',
        level: HintLevel.direct,
        title: 'Fuse Panel Keypad',
        hintText: 'The fuse panel has a digital keypad. Enter the 4-digit maintenance combination recorded on your Knowledge Board.',
        locationId: 'basement_generator',
        requiredCodeId: 'code_generator_fuse_1157',
      ),
      const GameHint(
        id: 'hint_generator_fuse_3',
        puzzleId: 'puzzle_generator_fuse',
        level: HintLevel.solution,
        title: 'Enter 1157 to Power Generator',
        hintText: 'Key in "1157" on the generator keypad to restore emergency power and open electrifiable metal doors.',
        locationId: 'basement_generator',
      ),
    ],
    'puzzle_ballroom_echo': [
      const GameHint(
        id: 'hint_ballroom_echo_1',
        puzzleId: 'puzzle_ballroom_echo',
        level: HintLevel.subtle,
        title: 'Ballroom Timeline Resonance',
        hintText: 'The Grand Ballroom changes as temporal collapse nears. Visit during later timeline stages.',
        locationId: 'grand_ballroom',
      ),
      const GameHint(
        id: 'hint_ballroom_echo_2',
        puzzleId: 'puzzle_ballroom_echo',
        level: HintLevel.direct,
        title: 'Observe Antique Mirror',
        hintText: 'During the Tension stage (after T+150s), look into the antique ballroom mirror for temporal echoes.',
        locationId: 'grand_ballroom',
      ),
      const GameHint(
        id: 'hint_ballroom_echo_3',
        puzzleId: 'puzzle_ballroom_echo',
        level: HintLevel.solution,
        title: 'Mirror Echo Contradiction',
        hintText: 'Examine the mirror echo reflection to record a contradiction clue onto your Knowledge Board.',
        locationId: 'grand_ballroom',
      ),
    ],
  };

  static List<GameHint> getHintsForPuzzle(String puzzleId) {
    return _puzzleHints[puzzleId] ?? const [];
  }

  static GameHint? getHintById(String hintId) {
    for (final hints in _puzzleHints.values) {
      for (final hint in hints) {
        if (hint.id == hintId) return hint;
      }
    }
    return null;
  }
}
