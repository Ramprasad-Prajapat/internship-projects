// lib/core/repositories/dialogue_repository.dart
import '../models/dialogue_model.dart';

/// Repository providing canonical dialogue topics for Hotel Kalchakra NPCs.
class DialogueRepository {
  static final Map<String, DialogueTopic> _topics = {
    'topic_caretaker_frozen_clock': const DialogueTopic(
      id: 'topic_caretaker_frozen_clock',
      npcId: 'npc_caretaker',
      title: 'Ask about the frozen lobby clock',
      dialoguePrompt: '"Caretaker Vikram, why are all the clocks in this lobby stopped at 11:57 PM?"',
      npcResponse: '"Stopped? They are not stopped, guest. They are waiting. Every night at 11:57 PM, the time wheel resets back to the beginning. If you are smart, you will leave before 12:00 midnight."',
      clueIdToUnlock: 'clue_frozen_clock',
    ),
    'topic_caretaker_1924_history': const DialogueTopic(
      id: 'topic_caretaker_1924_history',
      npcId: 'npc_caretaker',
      title: 'Inquire about the 1924 founding ledger',
      dialoguePrompt: '"I saw guest check-in dates spanning back to 1924. What happened in this hotel?"',
      npcResponse: '"In 1924, the founding architect built the subterranean archive directly over a temporal nexus. The clock mechanism controls the flow of time. Restore the generator fuses if you wish to see the archive."',
      requiredClueId: 'clue_guest_register_dates',
      clueIdToUnlock: 'clue_temporal_anomaly_origin',
    ),
    'topic_caretaker_fuse_code': const DialogueTopic(
      id: 'topic_caretaker_fuse_code',
      npcId: 'npc_caretaker',
      title: 'Ask about the generator combination code',
      dialoguePrompt: '"Is 1157 the maintenance code for the basement generator panel?"',
      npcResponse: '"Ah! You found my maintenance note in Room 101! Yes, 1-1-5-7 resets the fuse panel. Punch it into the keypad in the basement generator room to restore power."',
      requiredCodeId: 'code_generator_fuse_1157',
      codeIdToUnlock: 'code_generator_fuse_1157',
    ),
    'topic_sibling_warning': const DialogueTopic(
      id: 'topic_sibling_warning',
      npcId: 'npc_sibling_ghost',
      title: 'Listen to sibling\'s temporal message',
      dialoguePrompt: '"Sibling! Is that really you? How are you projecting across loops?"',
      npcResponse: '"I anchor my memory in Room 305! You must anchor a key or tool using the pocket device before 12:00. The Secret Archive in the basement holds the final escape mechanism!"',
      clueIdToUnlock: 'clue_sibling_journal_entry',
    ),
    'topic_sibling_archive_secret': const DialogueTopic(
      id: 'topic_sibling_archive_secret',
      npcId: 'npc_sibling_ghost',
      title: 'Ask how to breach the Secret Archive',
      dialoguePrompt: '"The iron door to the archive is sealed shut!"',
      npcResponse: '"Restore emergency power in the basement generator room using code 1157. Once the power hums, the iron bookshelf door will slide open automatically!"',
      requiredClueId: 'clue_archive_location',
      clueIdToUnlock: 'clue_generator_power_restored',
    ),
  };

  static DialogueTopic? getTopicById(String id) => _topics[id];

  static List<DialogueTopic> getTopicsForNpc(String npcId) {
    return _topics.values.where((t) => t.npcId == npcId).toList();
  }

  static List<DialogueTopic> getAllTopics() => _topics.values.toList();
}
