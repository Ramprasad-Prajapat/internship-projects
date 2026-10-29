// lib/core/models/clue_item.dart
import '../../shared/widgets/app_knowledge_card.dart';

/// Model representing a persistent clue or topic recorded on the Knowledge Board.
class ClueItem {
  final String id;
  final String title;
  final String category;
  final String summary;
  final KnowledgeStatus status;
  final String locationId;

  const ClueItem({
    required this.id,
    required this.title,
    required this.category,
    required this.summary,
    required this.status,
    required this.locationId,
  });
}
