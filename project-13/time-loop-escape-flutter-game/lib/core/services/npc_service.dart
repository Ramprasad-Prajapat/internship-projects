// lib/core/services/npc_service.dart
import 'package:flutter/foundation.dart';
import '../models/dialogue_model.dart';
import '../models/npc_model.dart';
import '../repositories/dialogue_repository.dart';
import '../repositories/npc_repository.dart';
import 'game_service.dart';
import 'time_loop_service.dart';

/// Domain service managing deterministic NPC schedule calculations, location tracking,
/// dialogue condition evaluation, and persistent knowledge recording.
class NpcService extends ChangeNotifier {
  final GameService _gameService;
  final TimeLoopService _timeLoopService;

  NpcService(this._gameService, this._timeLoopService);

  /// Compute current schedule event for an NPC based on TimeLoopService elapsed seconds.
  NpcScheduleEvent? getCurrentScheduleEvent(NpcModel npc) {
    final elapsed = _timeLoopService.elapsedSeconds;
    for (final event in npc.schedule) {
      if (elapsed >= event.startSeconds && elapsed < event.endSeconds) {
        return event;
      }
    }
    return npc.schedule.isNotEmpty ? npc.schedule.first : null;
  }

  /// Get list of NPCs currently residing in a room location based on 5-minute timeline.
  List<NpcModel> getNpcsInLocation(String locationId) {
    final allNpcs = NpcRepository.getAllNpcs();
    final present = <NpcModel>[];

    for (final npc in allNpcs) {
      final currentEvent = getCurrentScheduleEvent(npc);
      if (currentEvent != null && currentEvent.locationId == locationId) {
        present.add(npc);
      }
    }

    return present;
  }

  /// Check if a dialogue topic prerequisite is met against persistent knowledge.
  bool isTopicAvailable(DialogueTopic topic) {
    final knowledge = _gameService.currentState.persistentKnowledge;

    if (topic.requiredClueId != null) {
      final hasClue = knowledge.discoveredClueIds.contains(topic.requiredClueId);
      if (!hasClue) return false;
    }

    if (topic.requiredCodeId != null) {
      final hasCode = knowledge.unlockedCodeIds.contains(topic.requiredCodeId) ||
          knowledge.discoveredClueIds.contains(topic.requiredCodeId);
      if (!hasCode) return false;
    }

    return true;
  }

  /// Get available dialogue topics for an NPC.
  List<DialogueTopic> getTopicsForNpc(String npcId) {
    final allTopics = DialogueRepository.getTopicsForNpc(npcId);
    return allTopics;
  }

  /// Execute selection of a dialogue topic.
  Future<void> executeDialogueTopic(DialogueTopic topic) async {
    // Record topic in PersistentKnowledgeState (survives loop reset)
    final currentTopics = List<String>.from(_gameService.currentState.persistentKnowledge.unlockedDialogueTopicIds);
    if (!currentTopics.contains(topic.id)) {
      currentTopics.add(topic.id);
      final updatedKnowledge = _gameService.currentState.persistentKnowledge.copyWith(
        unlockedDialogueTopicIds: currentTopics,
      );
      _gameService.updatePersistentKnowledge(updatedKnowledge);
    }

    // Process clue unlock (PERSISTENT)
    if (topic.clueIdToUnlock != null) {
      await _gameService.discoverClue(topic.clueIdToUnlock!);
      await _gameService.addKnowledgeBoardTopic(topic.clueIdToUnlock!);
    }

    // Process code unlock (PERSISTENT)
    if (topic.codeIdToUnlock != null) {
      await _gameService.unlockCode(topic.codeIdToUnlock!);
    }

    notifyListeners();
  }
}
