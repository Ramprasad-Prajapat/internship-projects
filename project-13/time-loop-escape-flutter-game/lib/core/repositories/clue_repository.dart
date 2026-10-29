// lib/core/repositories/clue_repository.dart
import '../models/clue_item.dart';
import '../../shared/widgets/app_knowledge_card.dart';

/// Repository providing canonical clue and fact definitions for the Knowledge Board.
class ClueRepository {
  static final Map<String, ClueItem> _clues = {
    'clue_frozen_clock': const ClueItem(
      id: 'clue_frozen_clock',
      title: 'Frozen Clock Mechanism',
      category: 'Location / Lobby',
      summary: 'All hotel clocks remain stopped at 11:57 PM. At midnight, a temporal collapse occurs.',
      status: KnowledgeStatus.confirmed,
      locationId: 'lobby_reception',
    ),
    'clue_guest_register_dates': const ClueItem(
      id: 'clue_guest_register_dates',
      title: 'Future Guest Check-in Dates',
      category: 'Story Lead / Mystery',
      summary: 'Guest register contains handwritten check-in names dated 1924, 1978, and tomorrow.',
      status: KnowledgeStatus.isNew,
      locationId: 'lobby_reception',
    ),
    'clue_sun_wheel_symbol': const ClueItem(
      id: 'clue_sun_wheel_symbol',
      title: 'Sun Wheel Tapestry Symbol',
      category: 'Location / Corridor',
      summary: 'Woven silk tapestry depicts a sun wheel turning counterclockwise, matching the elevator dial.',
      status: KnowledgeStatus.unresolved,
      locationId: 'guest_corridor_1f',
    ),
    'code_generator_fuse_1157': const ClueItem(
      id: 'code_generator_fuse_1157',
      title: 'Generator Fuse Combination 1157',
      category: 'Code / Maintenance',
      summary: 'Four-digit combination (1-1-5-7) required to restore emergency power in the Basement Maintenance area.',
      status: KnowledgeStatus.confirmed,
      locationId: 'room_101',
    ),
    'clue_sibling_journal_entry': const ClueItem(
      id: 'clue_sibling_journal_entry',
      title: 'Sibling Briefcase Journal',
      category: 'Story Lead / Sibling',
      summary: 'Journal details sibling\'s discovery of the Secret Hotel Archive behind the basement bookshelf.',
      status: KnowledgeStatus.isNew,
      locationId: 'room_305',
    ),
    'clue_archive_location': const ClueItem(
      id: 'clue_archive_location',
      title: 'Archive Location Mystery Map',
      category: 'Location / Archive',
      summary: 'Red thread map connects the lobby clock mechanism to the subterranean archive.',
      status: KnowledgeStatus.unresolved,
      locationId: 'room_305',
    ),
    'clue_elevator_override': const ClueItem(
      id: 'clue_elevator_override',
      title: 'Elevator Floor Dial Override',
      category: 'Mechanism / Elevator',
      summary: 'Brass dial housing conceals a manual release lever for basement level access.',
      status: KnowledgeStatus.confirmed,
      locationId: 'elevator_shaft',
    ),
    'clue_generator_power_restored': const ClueItem(
      id: 'clue_generator_power_restored',
      title: 'Emergency Power Restoration',
      category: 'World State / Generator',
      summary: 'Restoring generator fuses unlocks electrifiable metal doors in the basement corridor.',
      status: KnowledgeStatus.confirmed,
      locationId: 'basement_generator',
    ),
    'clue_mirror_reflection_echo': const ClueItem(
      id: 'clue_mirror_reflection_echo',
      title: 'Ballroom Mirror Temporal Echo',
      category: 'Temporal Echo / Ballroom',
      summary: 'Antique mirror reflects shadowy figures dancing in 1924 while the ballroom stands empty.',
      status: KnowledgeStatus.contradiction,
      locationId: 'grand_ballroom',
    ),
    'clue_temporal_anomaly_origin': const ClueItem(
      id: 'clue_temporal_anomaly_origin',
      title: '1924 Hotel Founding Anomaly',
      category: 'Core Mystery / Origin',
      summary: 'Founding ledger reveals Hotel Kalchakra was erected over a natural temporal nexus.',
      status: KnowledgeStatus.confirmed,
      locationId: 'hotel_archive',
    ),
  };

  static ClueItem? getClueById(String id) => _clues[id];

  static List<ClueItem> getAllClues() => _clues.values.toList();
}
