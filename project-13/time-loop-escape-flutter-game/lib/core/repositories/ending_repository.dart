// lib/core/repositories/ending_repository.dart
import '../models/ending_model.dart';

/// Repository providing canonical definitions for endings in 11:57 — The Last Check-In.
class EndingRepository {
  static final Map<String, EndingModel> _endings = {
    'escape_alone': const EndingModel(
      id: 'escape_alone',
      title: 'Escape Alone',
      description: 'Escape Hotel Kalchakra before midnight, leaving the unresolved mystery behind.',
      narrativeConclusion:
          'You manipulated the generator fuses and unlocked the main foyer exit door. As the clock hands ticked down to 11:59:59 PM, you slipped out into the cool desert air of Rajasthan. But as midnight echoed in the distance, a haunting truth dawned: your sibling remains trapped in Room 305, and the temporal loop continues without you.',
      recap: 'Discovered caretaker generator code (1157) and restored emergency power to escape.',
      category: EndingCategory.escape,
      priority: 50,
      isEnabledForMvp: true,
      requirement: EndingRequirement(
        requiredCodeIds: ['code_generator_fuse_1157'],
        requiredClueIds: ['clue_generator_power_restored'],
      ),
    ),
    'save_sibling': const EndingModel(
      id: 'save_sibling',
      title: 'Save the Sibling',
      description: 'Unlock the sibling lockbox, anchor the temporal coil, and rescue your sibling via the secret archive tunnel.',
      narrativeConclusion:
          'Deciphering the caretaker note allowed you to unlock your sibling\'s steel briefcase in Room 305. Combining the Temporal Coil Device with the secret archive passage in the basement, you stabilized your sibling\'s temporal projection. Hand-in-hand, you breached the hidden tunnel beneath Hotel Kalchakra just before midnight struck. The 11:57 PM temporal nexus dissolved, and both of you emerged safely into the dawn of a new day.',
      recap: 'Unlocked Sibling Briefcase (1157), heeded Sibling Temporal Message, restored power, and anchored the Temporal Coil.',
      category: EndingCategory.sibling,
      priority: 100,
      isEnabledForMvp: true,
      requirement: EndingRequirement(
        requiredCodeIds: ['code_generator_fuse_1157'],
        requiredClueIds: ['clue_sibling_journal_entry', 'clue_generator_power_restored'],
        requiredDialogueTopicIds: ['topic_sibling_warning'],
      ),
    ),
    'reveal_truth': const EndingModel(
      id: 'reveal_truth',
      title: 'Reveal the Truth',
      description: 'Unravel the 1924 founding ledger anomaly and expose the subterranean temporal nexus.',
      narrativeConclusion:
          'By piecing together the 1924 founding ledger in the subterranean archive and analyzing the grand ballroom mirror reflection, you uncovered the true origin of Hotel Kalchakra\'s temporal anomaly.',
      recap: 'Deciphered 1924 founding ledger and analyzed ballroom mirror temporal echo.',
      category: EndingCategory.truth,
      priority: 150,
      isEnabledForMvp: false, // Non-MVP ending (Disabled)
      requirement: EndingRequirement(
        requiredClueIds: ['clue_temporal_anomaly_origin', 'clue_mirror_reflection_echo'],
      ),
    ),
    'first_loop_secret': const EndingModel(
      id: 'first_loop_secret',
      title: 'Secret Ending — The First Loop',
      description: 'Discover the secret temporal inception point where Hotel Kalchakra was bound to 11:57 PM.',
      narrativeConclusion:
          'You uncovered the primary inception point where the temporal loop was first forged in 1924.',
      recap: 'Uncovered the original timeline genesis across all core clues.',
      category: EndingCategory.secret,
      priority: 200,
      isEnabledForMvp: false, // Non-MVP ending (Disabled)
      requirement: EndingRequirement(
        requiredClueIds: [
          'clue_temporal_anomaly_origin',
          'clue_frozen_clock',
          'clue_guest_register_dates',
          'clue_sun_wheel_symbol',
        ],
      ),
    ),
  };

  static EndingModel? getEndingById(String id) => _endings[id];

  static List<EndingModel> getAllEndings() => _endings.values.toList();

  static List<EndingModel> getMvpEndings() =>
      _endings.values.where((e) => e.isEnabledForMvp).toList();
}
