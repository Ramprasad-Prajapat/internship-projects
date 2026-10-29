// lib/core/services/knowledge_service.dart
import 'package:flutter/foundation.dart';
import '../models/clue_item.dart';
import '../repositories/clue_repository.dart';
import '../../shared/widgets/app_knowledge_card.dart';
import 'game_service.dart';

/// Domain service managing persistent player knowledge board data and category filtering.
class KnowledgeService extends ChangeNotifier {
  final GameService _gameService;

  KnowledgeService(this._gameService);

  /// All discovered clues and topics surviving temporal resets.
  List<ClueItem> get discoveredClues {
    final persistent = _gameService.currentState.persistentKnowledge;
    final allIds = <String>{
      ...persistent.discoveredClueIds,
      ...persistent.unlockedCodeIds,
      ...persistent.knowledgeBoardTopicIds,
    };

    return allIds
        .map((id) => ClueRepository.getClueById(id))
        .whereType<ClueItem>()
        .toList();
  }

  List<ClueItem> get newDiscoveries =>
      discoveredClues.where((c) => c.status == KnowledgeStatus.isNew).toList();

  List<ClueItem> get confirmedFacts =>
      discoveredClues.where((c) => c.status == KnowledgeStatus.confirmed).toList();

  List<ClueItem> get unresolvedLeads =>
      discoveredClues.where((c) => c.status == KnowledgeStatus.unresolved).toList();

  List<ClueItem> get contradictions =>
      discoveredClues.where((c) => c.status == KnowledgeStatus.contradiction).toList();

  // Compatibility API for tests
  bool isClueDiscovered(String id) {
    return _gameService.currentState.persistentKnowledge.discoveredClueIds.contains(id);
  }

  bool isCodeUnlocked(String id) {
    return _gameService.currentState.persistentKnowledge.unlockedCodeIds.contains(id);
  }
}
